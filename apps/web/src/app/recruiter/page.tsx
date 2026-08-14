'use client';

import React, { useState, useEffect } from 'react';
import {
  DashboardOverviewMetrics,
  CandidateProfile,
  InterviewSession,
  AnalyticsData,
} from '@ai-interviewer/shared';
import { DashboardOverview } from '@/components/recruiter/DashboardOverview';
import { CandidateListView } from '@/components/recruiter/CandidateListView';
import { InterviewDetailWorkspace } from '@/components/recruiter/InterviewDetailWorkspace';
import { AnalyticsView } from '@/components/recruiter/AnalyticsView';

export default function RecruiterDashboardPage() {
  const [activeView, setActiveView] = useState<'overview' | 'candidates' | 'interviews' | 'analytics'>('overview');
  const [metrics, setMetrics] = useState<DashboardOverviewMetrics>({
    totalInterviews: 2,
    activeInterviews: 1,
    completedInterviews: 1,
    pendingEvaluations: 0,
    interviewsNeedingReview: 0,
    completionRatePercentage: 50.0,
    averageDurationMinutes: 20.0,
    averageRequirementCoveragePercentage: 85.0,
  });

  const [candidates] = useState<CandidateProfile[]>([
    {
      candidateId: 'cand_101',
      name: 'Alex Mercer',
      headline: 'Staff Full Stack Engineer',
      summary: 'Architected microservices using PostgreSQL, Redis, and Spring Boot.',
      education: [{ institution: 'State University', degree: 'B.S. Computer Science' }],
      experience: [],
      projects: [],
      skills: [
        { canonicalName: 'PostgreSQL', rawName: 'PostgreSQL', category: 'Database', source: 'resume', evidence: 'Claim', verificationStatus: 'SUPPORTED' },
        { canonicalName: 'Redis', rawName: 'Redis', category: 'Cache', source: 'resume', evidence: 'Claim', verificationStatus: 'SUPPORTED' },
        { canonicalName: 'Kubernetes', rawName: 'Kubernetes', category: 'DevOps', source: 'resume', evidence: 'Claim', verificationStatus: 'UNVERIFIED' },
      ],
    },
  ]);

  const [session] = useState<InterviewSession>({
    id: 'sess_recruiter_demo',
    candidateName: 'Alex Mercer',
    role: 'Staff Full Stack Engineer',
    type: 'technical',
    durationMinutes: 20,
    status: 'COMPLETED',
    currentStage: 'COMPLETED',
    createdAt: new Date().toISOString(),
  });

  const [analytics] = useState<AnalyticsData>({
    operational: { startedCount: 2, completedCount: 1, completionRate: 50.0, avgDurationMinutes: 20.0, avgQuestionCount: 5.0 },
    aiBehavior: { adaptiveFollowUpRate: 35.0, fallbackRate: 0.0, avgAdaptiveLatencyMs: 42, topicDistribution: { Technical: 60, SystemDesign: 40 } },
    evaluation: { evaluationCompletionRate: 100.0, insufficientEvidenceRate: 0.0, humanReviewRate: 20.0, avgProcessingTimeMs: 110 },
    requirementCoverage: { mostUntestedRequirements: ['Kubernetes'], coverageByJob: { 'Staff Full Stack Engineer': 85.0 } },
  });

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await fetch('http://localhost:3001/dashboard/overview');
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setMetrics(json.data);
          }
        }
      } catch {
        console.warn('Using initial dashboard state.');
      }
    };
    fetchOverview();
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
            Recruiter Intelligence Workspace
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>
            Evidence-based interview oversight, candidate claim verification, and operational analytics.
          </p>
        </div>

        <div className="badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
          🏢 Organization: Scaler Labs
        </div>
      </div>

      {/* Recruiter Top Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        {(['overview', 'candidates', 'interviews', 'analytics'] as const).map((view) => (
          <button
            key={view}
            type="button"
            onClick={() => setActiveView(view)}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 500,
              border: 'none',
              background: 'transparent',
              color: activeView === view ? '#38bdf8' : '#94a3b8',
              borderBottom: activeView === view ? '2px solid #38bdf8' : '2px solid transparent',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {view === 'interviews' ? 'Interview Detail Workspace' : view}
          </button>
        ))}
      </div>

      {/* View Content */}
      {activeView === 'overview' && (
        <div>
          <DashboardOverview metrics={metrics} />
          <CandidateListView candidates={candidates} />
        </div>
      )}

      {activeView === 'candidates' && (
        <CandidateListView candidates={candidates} />
      )}

      {activeView === 'interviews' && (
        <InterviewDetailWorkspace session={session} profile={candidates[0]} />
      )}

      {activeView === 'analytics' && (
        <AnalyticsView analytics={analytics} />
      )}
    </div>
  );
}
