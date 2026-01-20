import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { usePlantData } from '../hooks/usePlantData';
import { ConnectionStatusBanner } from '../components/dashboard/ConnectionStatusBanner';
import { OvenStatusCard } from '../components/dashboard/OvenStatusCard';
import { CraneStatusCard } from '../components/dashboard/CraneStatusCard';
import { ConveyorStatusCard } from '../components/dashboard/ConveyorStatusCard';
import { StockHistoryChart } from '../components/dashboard/StockHistoryChart';
import { WarehouseDetails } from '../components/dashboard/WarehouseDetails';
import { SystemMetrics } from '../components/dashboard/SystemMetrics';
import { DataSourceCard } from '../components/dashboard/DataSourceCard';
import '../kensan.css';

interface HistoricalData {
  timestamp: number;
  warehouseStock: number;
}

function Dashboard() {
  const { data, isOnline, error, timeUntilRefresh } = usePlantData();
  const lastUpdateTime = useRef<number>(0);
  
  // Load stock history from localStorage on mount
  const [stockHistory, setStockHistory] = useState<HistoricalData[]>(() => {
    try {
      const saved = localStorage.getItem('stockHistory');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filter out old data (older than 2 minutes)
        const twoMinutesAgo = Date.now() - 120000;
        return parsed.filter((item: HistoricalData) => item.timestamp > twoMinutesAgo);
      }
    } catch (error) {
      console.error('Failed to load stock history:', error);
    }
    return [];
  });

  // Save stock history to localStorage whenever it changes
  useEffect(() => {
    if (stockHistory.length > 0) {
      localStorage.setItem('stockHistory', JSON.stringify(stockHistory));
    }
  }, [stockHistory]);

  // Track stock history for the chart - updates only when timeUntilRefresh resets (every 5 seconds)
  useEffect(() => {
    const now = Date.now();
    // Only add a new data point if at least 4 seconds have passed since last update
    // This prevents multiple additions when data object changes
    if (now - lastUpdateTime.current >= 4000) {
      const newDataPoint = {
        timestamp: now,
        warehouseStock: data.warehouseStock,
      };

      setStockHistory((prev) => {
        const updated = [...prev, newDataPoint];
        // Keep only last 20 data points (100 seconds of history)
        return updated.slice(-20);
      });

      lastUpdateTime.current = now;
    }
  }, [data.warehouseStock, timeUntilRefresh]); // Track stock changes and refresh timer

  return (
    <div className="kensan-container">
      <Sidebar activeItem="dashboard" />

      <div className="kensan-main-content">
        <Header buttonColor={data.ovenRunning && data.craneRunning ? "green" : "red"} />

        <main className="kensan-dashboard-main">
          {/* Connection Status Banner */}
          <ConnectionStatusBanner isOnline={isOnline} timeUntilRefresh={timeUntilRefresh} />

          <div className="kensan-dashboard-grid">
            {/* Top Cards - Status Overview */}
            <OvenStatusCard ovenRunning={data.ovenRunning} ovenStatus={data.ovenStatus} />
            <CraneStatusCard 
              craneRunning={data.craneRunning} 
              cranePosition={data.cranePosition}
              craneMove={data.craneMove}
            />
            <ConveyorStatusCard conveyerRunning={data.conveyerRunning} />

            {/* Wide Card - Stock History Chart */}
            <StockHistoryChart stockHistory={stockHistory} />

            {/* Tall Card - Warehouse Details */}
            <WarehouseDetails
              warehouseRunning={data.warehouseRunning}
              warehouseLocationX={data.warehouseLocationX}
              warehouseLocationY={data.warehouseLocationY}
              warehouseStock={data.warehouseStock}
              ovenRunning={data.ovenRunning}
              craneRunning={data.craneRunning}
              conveyerRunning={data.conveyerRunning}
            />

            {/* Bottom Cards */}
            <SystemMetrics
              ovenRunning={data.ovenRunning}
              craneRunning={data.craneRunning}
              conveyerRunning={data.conveyerRunning}
              warehouseRunning={data.warehouseRunning}
            />
            <DataSourceCard isOnline={isOnline} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
