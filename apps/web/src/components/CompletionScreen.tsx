'use client';

import React from 'react';
import { InterviewSession } from '@ai-interviewer/shared';

interface CompletionScreenProps {
  session: InterviewSession;
  onReturnHome: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({ session, onReturnHome }) => {
  return (
    <div className="card-container">
      <div className="badge badge-green">
        <span className="badge-dot"></span>
        <span>Interview Completed</span>
      </div>

      <h1>Interview Complete</h1>
      <p className="subtitle">
        Thank you, <strong>{session.candidateName}</strong>! Your practice interview session for{' '}
        <strong>{session.role}</strong> has been concluded.
      </p>

      <div
        style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'left',
          marginBottom: '28px',
          fontSize: '14px',
          color: '#cbd5e1',
          lineHeight: 1.6,
        }}
      >
        <div style={{ marginBottom: '8px', color: '#f8fafc', fontWeight: 600 }}>
          Session Summary:
        </div>
        <div>• <strong>Session ID:</strong> {session.id}</div>
        <div>• <strong>Focus:</strong> <span style={{ textTransform: 'capitalize' }}>{session.type}</span></div>
        <div>• <strong>Completed At:</strong> {session.completedAt ? new Date(session.completedAt).toLocaleTimeString() : 'Just now'}</div>
      </div>

      <button className="btn-primary" onClick={onReturnHome} id="return-home-btn">
        Return Home
      </button>
    </div>
  );
};
