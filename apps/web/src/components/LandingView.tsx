'use client';

import React from 'react';

interface LandingViewProps {
  onStart: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onStart }) => {
  return (
    <div className="card-container">
      <div className="badge">
        <span className="badge-dot"></span>
        <span>AI Interview Platform</span>
      </div>

      <h1>Software Engineer Interview</h1>
      <p className="subtitle">
        You are about to begin an interactive AI-guided practice interview.
      </p>

      <div style={{ textAlign: 'left', marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '12px', fontSize: '14px', color: '#cbd5e1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#6366f1', fontWeight: 'bold' }}>•</span>
            <span><strong>Duration:</strong> 10 to 30 minutes</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#6366f1', fontWeight: 'bold' }}>•</span>
            <span><strong>Format:</strong> Interactive Q&A Session</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#6366f1', fontWeight: 'bold' }}>•</span>
            <span><strong>Topics:</strong> Technical & Behavioral Evaluation</span>
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={onStart} id="start-interview-btn">
        Start Interview
      </button>
    </div>
  );
};
