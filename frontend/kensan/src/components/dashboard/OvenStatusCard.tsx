import React from 'react';
import { StatusIndicator } from './StatusIndicator';

interface OvenStatusCardProps {
  ovenRunning: boolean;
  ovenStatus: string;
}

export const OvenStatusCard: React.FC<OvenStatusCardProps> = ({ ovenRunning, ovenStatus }) => (
  <div className="kensan-card top1" style={{ padding: '1.5rem' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3 style={{ 
        margin: 0, 
        color: 'var(--color-cyberdefense-orange)',
        fontSize: '1rem',
        fontWeight: 600 
      }}>
        Oven Status
      </h3>
      <StatusIndicator running={ovenRunning} label={ovenStatus} />
      <div style={{ 
        marginTop: '8px',
        padding: '8px',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: '6px',
      }}>
        <p style={{ 
          margin: 0, 
          fontSize: '0.8rem', 
          color: 'var(--color-kensan-light_gray)' 
        }}>
          Temperature: {ovenRunning ? 'Active' : 'Standby'}
        </p>
      </div>
    </div>
  </div>
);
