import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

interface HistoricalData {
  timestamp: number;
  warehouseStock: number;
}

interface StockHistoryChartProps {
  stockHistory: HistoricalData[];
}

export const StockHistoryChart: React.FC<StockHistoryChartProps> = ({ stockHistory }) => (
  <div className="kensan-card wide" style={{ padding: '1.5rem' }}>
    <h3 style={{ 
      margin: '0 0 1rem 0', 
      color: 'var(--color-cyberdefense-orange)',
      fontSize: '1.1rem',
      fontWeight: 600 
    }}>
      Warehouse Stock History
    </h3>
    {stockHistory.length > 1 ? (
      <LineChart
        dataset={stockHistory.map(point => ({
          timestamp: new Date(point.timestamp),
          warehouseStock: point.warehouseStock
        }))}
        xAxis={[
          {
            dataKey: 'timestamp',
            scaleType: 'time',
            valueFormatter: (value) => new Date(value).toLocaleTimeString(),
          },
        ]}
        yAxis={[
          {
            label: 'Stock Level',
            labelStyle: {
              fill: 'var(--color-kensan-white)',
            },
          },
        ]}
        series={[
          {
            dataKey: 'warehouseStock',
            label: 'Stock',
            showMark: true,
            color: '#29AAE2',
          },
        ]}
        height={220}
        grid={{ vertical: true, horizontal: true }}
        sx={{
          '& .MuiChartsAxis-line': { stroke: 'var(--color-kensan-light_gray)' },
          '& .MuiChartsAxis-tick': { stroke: 'var(--color-kensan-light_gray)' },
          '& .MuiChartsAxis-tickLabel': { fill: 'var(--color-kensan-white) !important' },
          '& .MuiChartsAxis-label': { fill: 'var(--color-kensan-white) !important' },
          '& .MuiChartsGrid-line': { stroke: 'rgba(255,255,255,0.05)' },
          '& .MuiChartsLegend-label': { fill: 'var(--color-kensan-white) !important' },
          '& .MuiChartsLegend-series text': { fill: 'var(--color-kensan-white) !important' },
        }}
      />
    ) : (
      <div style={{ 
        height: '220px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'var(--color-kensan-light_gray)'
      }}>
        Collecting data...
      </div>
    )}
  </div>
);
