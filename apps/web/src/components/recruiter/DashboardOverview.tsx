'use client';

import React from 'react';
import { DashboardOverviewMetrics } from '@ai-interviewer/shared';

interface DashboardOverviewProps {
  metrics: DashboardOverviewMetrics;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ metrics }) => {
  return (
    <div style={{ marginBottom: '32px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Total Interviews */}
        <div
          style={{
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Total Interviews
          </span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#f8fafc', marginTop: '4px' }}>
            {metrics.totalInterviews}
          </div>
        </div>

        {/* Active Interviews */}
        <div
          style={{
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Active Interviews
          </span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#38bdf8', marginTop: '4px' }}>
            {metrics.activeInterviews}
          </div>
        </div>

        {/* Completed Interviews */}
        <div
          style={{
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Completed Interviews
          </span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#4ade80', marginTop: '4px' }}>
            {metrics.completedInterviews}
          </div>
        </div>

        {/* Completion Rate */}
        <div
          style={{
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Completion Rate
          </span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#facc15', marginTop: '4px' }}>
            {metrics.completionRatePercentage}%
          </div>
        </div>

        {/* Average Duration */}
        <div
          style={{
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Avg Duration
          </span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#c084fc', marginTop: '4px' }}>
            {metrics.averageDurationMinutes} min
          </div>
        </div>

        {/* Requirement Coverage */}
        <div
          style={{
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Avg Req Coverage
          </span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>
            {metrics.averageRequirementCoveragePercentage}%
          </div>
        </div>
      </div>
    </div>
  );
};
