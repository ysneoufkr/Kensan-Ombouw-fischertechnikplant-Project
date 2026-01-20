import React from 'react';

interface SystemMetricsProps {
  ovenRunning: boolean;
  craneRunning: boolean;
  conveyerRunning: boolean;
  warehouseRunning: boolean;
}

export const SystemMetrics: React.FC<SystemMetricsProps> = ({
  ovenRunning,
  craneRunning,
  conveyerRunning,
  warehouseRunning,
}) => (
  <div className="kensan-card bot1" style={{ padding: '1.5rem' }}>
    <h3 style={{ 
      margin: '0 0 1rem 0', 
      color: 'var(--color-cyberdefense-orange)',
      fontSize: '1rem',
      fontWeight: 600 
    }}>
      System Metrics
    </h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{
        padding: '12px',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: '6px',
      }}>
        <p style={{ 
          margin: '0 0 4px 0', 
          fontSize: '0.75rem', 
          color: 'var(--color-kensan-light_gray)' 
        }}>
          Active Systems
        </p>
        <p style={{ 
          margin: 0, 
          fontSize: '1.8rem', 
          color: 'var(--color-kensan-white)',
          fontWeight: 700
        }}>
          {[ovenRunning, craneRunning, conveyerRunning, warehouseRunning]
            .filter(Boolean).length} / 4
        </p>
      </div>
    </div>
  </div>
);
