import React from 'react';
import { StatusIndicator } from './StatusIndicator';

interface CraneStatusCardProps {
  craneRunning: boolean;
  cranePosition: string;
  craneMove: boolean;
}

export const CraneStatusCard: React.FC<CraneStatusCardProps> = ({ craneRunning, cranePosition, craneMove }) => (
  <div className="kensan-card top2" style={{ padding: '1.5rem' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3 style={{ 
        margin: 0, 
        color: 'var(--color-cyberdefense-orange)',
        fontSize: '1rem',
        fontWeight: 600 
      }}>
        Crane Status
      </h3>
      <StatusIndicator running={craneRunning} label={cranePosition} />
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
          Moving: {craneMove ? 'Yes' : 'No'}
        </p>
      </div>
    </div>
  </div>
);
