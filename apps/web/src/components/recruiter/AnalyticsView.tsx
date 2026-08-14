'use client';

import React from 'react';
import { AnalyticsData } from '@ai-interviewer/shared';

interface AnalyticsViewProps {
  analytics: AnalyticsData;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics }) => {
  return (
    <div className="card-container" style={{ textAlign: 'left', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#f8fafc', marginBottom: '16px' }}>
        Interview Intelligence Operational Analytics
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {/* Operational Analytics */}
        <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '15px', color: '#38bdf8' }}>Operational Performance</h3>
          <div style={{ display: 'grid', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Started Interviews:</span>
              <strong style={{ color: '#fff' }}>{analytics.operational.startedCount}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Completed Interviews:</span>
              <strong style={{ color: '#fff' }}>{analytics.operational.completedCount}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Completion Rate:</span>
              <strong style={{ color: '#4ade80' }}>{analytics.operational.completionRate}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Average Duration:</span>
              <strong style={{ color: '#fff' }}>{analytics.operational.avgDurationMinutes} min</strong>
            </div>
          </div>
        </div>

        {/* AI Behavior Analytics */}
        <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '15px', color: '#c084fc' }}>AI Behavior & Adaptation</h3>
          <div style={{ display: 'grid', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Adaptive Follow-up Rate:</span>
              <strong style={{ color: '#c084fc' }}>{analytics.aiBehavior.adaptiveFollowUpRate}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Deterministic Fallback Rate:</span>
              <strong style={{ color: '#facc15' }}>{analytics.aiBehavior.fallbackRate}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Avg Adaptive Decision Latency:</span>
              <strong style={{ color: '#fff' }}>{analytics.aiBehavior.avgAdaptiveLatencyMs} ms</strong>
            </div>
          </div>
        </div>

        {/* Requirement Coverage Analytics */}
        <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '15px', color: '#34d399' }}>Requirement Coverage</h3>
          <div style={{ display: 'grid', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
            <div>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Most Untested Requirements:</span>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                {analytics.requirementCoverage.mostUntestedRequirements.map((req, idx) => (
                  <span key={idx} className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', fontSize: '11px', margin: 0 }}>
                    {req}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
