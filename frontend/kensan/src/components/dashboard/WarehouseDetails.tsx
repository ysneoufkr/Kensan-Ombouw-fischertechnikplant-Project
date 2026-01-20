import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { StatusIndicator } from './StatusIndicator';

interface WarehouseDetailsProps {
  warehouseRunning: boolean;
  warehouseLocationX: number;
  warehouseLocationY: number;
  warehouseStock: number;
  ovenRunning: boolean;
  craneRunning: boolean;
  conveyerRunning: boolean;
}

export const WarehouseDetails: React.FC<WarehouseDetailsProps> = ({
  warehouseRunning,
  warehouseLocationX,
  warehouseLocationY,
  warehouseStock,
  ovenRunning,
  craneRunning,
  conveyerRunning,
}) => (
  <div className="kensan-card tall" style={{ padding: '1.5rem' }}>
    <h3 style={{ 
      margin: '0 0 1.5rem 0', 
      color: 'var(--color-cyberdefense-orange)',
      fontSize: '1.1rem',
      fontWeight: 600 
    }}>
      Warehouse Details
    </h3>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <StatusIndicator running={warehouseRunning} label="Warehouse System" />
      
      <div style={{ 
        padding: '1rem',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ 
            margin: '0 0 0.5rem 0', 
            fontSize: '0.85rem', 
            color: 'var(--color-kensan-light_gray)' 
          }}>
            Current Position
          </p>
          <p style={{ 
            margin: 0, 
            fontSize: '1.5rem', 
            color: 'var(--color-kensan-white)',
            fontWeight: 600
          }}>
            X: {warehouseLocationX} / Y: {warehouseLocationY}
          </p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ 
            margin: '0 0 0.5rem 0', 
            fontSize: '0.85rem', 
            color: 'var(--color-kensan-light_gray)' 
          }}>
            Stock Level
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <p style={{ 
              margin: 0, 
              fontSize: '2rem', 
              color: 'var(--color-kensan-light_blue)',
              fontWeight: 700
            }}>
              {warehouseStock}
            </p>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-kensan-light_gray)' }}>
              items
            </span>
          </div>
        </div>
      </div>

      {/* Mini pie chart for operations */}
      <div style={{ marginTop: '1rem' }}>
        <p style={{ 
          margin: '0 0 0.5rem 0', 
          fontSize: '0.85rem', 
          color: 'var(--color-kensan-light_gray)' 
        }}>
          System Status Overview
        </p>
        <PieChart
          series={[
            {
              data: [
                { 
                  id: 0, 
                  value: ovenRunning ? 1 : 0, 
                  label: 'Oven',
                  color: '#F89820'
                },
                { 
                  id: 1, 
                  value: craneRunning ? 1 : 0, 
                  label: 'Crane',
                  color: '#29AAE2'
                },
                { 
                  id: 2, 
                  value: conveyerRunning ? 1 : 0, 
                  label: 'Conveyor',
                  color: '#1BB14B'
                },
                { 
                  id: 3, 
                  value: warehouseRunning ? 1 : 0, 
                  label: 'Warehouse',
                  color: '#7C3AED'
                },
              ],
            },
          ]}
          height={160}
          sx={{
            '& .MuiChartsLegend-label': { fill: 'var(--color-kensan-white) !important', fontSize: '0.75rem' },
            '& .MuiChartsLegend-series text': { fill: 'var(--color-kensan-white) !important' },
          }}
        />
      </div>
    </div>
  </div>
);
