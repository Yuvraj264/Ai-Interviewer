'use client';

import React from 'react';
import { InterviewSession } from '@ai-interviewer/shared';

interface WaitingRoomProps {
  session: InterviewSession;
  onContinue: () => void;
  isLoading?: boolean;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({ session, onContinue, isLoading = false }) => {
  return (
    <div className="card-container">
      <div className="badge badge-green">
        <span className="badge-dot"></span>
        <span>Session Created</span>
      </div>

      <h1>Your Interview Room</h1>
      <p className="subtitle">Everything is configured. Review details below and begin when ready.</p>

      <div style={{ textAlign: 'left', background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '12px', marginBottom: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
          <div>
            <span style={{ color: '#94a3b8', fontSize: '12px', display: 'block' }}>CANDIDATE</span>
            <strong style={{ color: '#f8fafc' }}>{session.candidateName}</strong>
          </div>
          <div>
            <span style={{ color: '#94a3b8', fontSize: '12px', display: 'block' }}>TARGET ROLE</span>
            <strong style={{ color: '#f8fafc' }}>{session.role}</strong>
          </div>
          <div>
            <span style={{ color: '#94a3b8', fontSize: '12px', display: 'block' }}>FOCUS</span>
            <strong style={{ color: '#38bdf8', textTransform: 'capitalize' }}>{session.type}</strong>
          </div>
          <div>
            <span style={{ color: '#94a3b8', fontSize: '12px', display: 'block' }}>DURATION</span>
            <strong style={{ color: '#38bdf8' }}>{session.durationMinutes} Minutes</strong>
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={onContinue} disabled={isLoading} id="continue-interview-btn">
        {isLoading ? 'Starting Session...' : 'Enter Interview'}
      </button>
    </div>
  );
};
