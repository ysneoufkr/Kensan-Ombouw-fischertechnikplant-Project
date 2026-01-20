import React from 'react';

interface StatusIndicatorProps {
  running: boolean;
  label: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ running, label }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '6px',
  }}>
    <div style={{
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: running ? '#32F21D' : '#F21D1D',
      boxShadow: running 
        ? '0 0 8px rgba(50, 242, 29, 0.6)' 
        : '0 0 8px rgba(242, 29, 29, 0.6)',
    }} />
    <span style={{ fontSize: '0.85rem', color: 'var(--color-kensan-light_gray)' }}>
      {label}
    </span>
  </div>
);
