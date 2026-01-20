import React from 'react';

interface ConnectionStatusBannerProps {
  isOnline: boolean;
  timeUntilRefresh: number;
}

export const ConnectionStatusBanner: React.FC<ConnectionStatusBannerProps> = ({ isOnline, timeUntilRefresh }) => (
  <div style={{
    padding: '0.75rem 1.5rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    backgroundColor: isOnline 
      ? 'rgba(50, 242, 29, 0.1)' 
      : 'rgba(242, 156, 29, 0.1)',
    border: `1px solid ${isOnline ? '#32F21D' : '#F29C1D'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span className="material-symbols-outlined" style={{ 
        color: isOnline ? '#32F21D' : '#F29C1D',
        fontSize: '20px'
      }}>
        {isOnline ? 'wifi' : 'wifi_off'}
      </span>
      <span style={{ color: 'var(--color-kensan-white)', fontSize: '0.9rem' }}>
        {isOnline ? 'Connected to API' : 'Using Test Data - API Offline'}
      </span>
    </div>
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: '4px 12px',
      borderRadius: '6px'
    }}>
      <span className="material-symbols-outlined" style={{ 
        color: 'var(--color-cyberdefense-orange)',
        fontSize: '18px'
      }}>
        refresh
      </span>
      <span style={{ 
        color: 'var(--color-kensan-white)', 
        fontSize: '0.85rem',
        fontWeight: 600
      }}>
        {timeUntilRefresh}s
      </span>
    </div>
  </div>
);
