import React from 'react';

interface DataSourceCardProps {
  isOnline: boolean;
}

export const DataSourceCard: React.FC<DataSourceCardProps> = ({ isOnline }) => (
  <div className="kensan-card bot2" style={{ padding: '1.5rem' }}>
    <h3 style={{ 
      margin: '0 0 1rem 0', 
      color: 'var(--color-cyberdefense-orange)',
      fontSize: '1rem',
      fontWeight: 600 
    }}>
      Data Source
    </h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{
        padding: '12px',
        backgroundColor: isOnline 
          ? 'rgba(50, 242, 29, 0.1)' 
          : 'rgba(242, 156, 29, 0.1)',
        borderRadius: '6px',
        border: `1px solid ${isOnline ? '#32F21D' : '#F29C1D'}`,
      }}>
        <p style={{ 
          margin: '0 0 4px 0', 
          fontSize: '0.75rem', 
          color: 'var(--color-kensan-light_gray)' 
        }}>
          Connection Status
        </p>
        <p style={{ 
          margin: 0, 
          fontSize: '1rem', 
          color: 'var(--color-kensan-white)',
          fontWeight: 600
        }}>
          {isOnline ? 'Live API' : 'Test Data'}
        </p>
      </div>
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
          Data Origin
        </p>
        <p style={{ 
          margin: 0, 
          fontSize: '0.85rem', 
          color: 'var(--color-kensan-white)' 
        }}>
          {isOnline ? 'OPC UA Client' : 'Local Test Server'}
        </p>
      </div>
    </div>
  </div>
);
