import React from 'react';
import { StatusIndicator } from './StatusIndicator';

interface ConveyorStatusCardProps {
  conveyerRunning: boolean;
}

export const ConveyorStatusCard: React.FC<ConveyorStatusCardProps> = ({ conveyerRunning }) => (
  <div className="kensan-card top3" style={{ padding: '1.5rem' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3 style={{ 
        margin: 0, 
        color: 'var(--color-cyberdefense-orange)',
        fontSize: '1rem',
        fontWeight: 600 
      }}>
        Conveyor Belt
      </h3>
      <StatusIndicator running={conveyerRunning} label="Conveyor" />
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
          Status: {conveyerRunning ? 'Running' : 'Stopped'}
        </p>
      </div>
    </div>
  </div>
);
