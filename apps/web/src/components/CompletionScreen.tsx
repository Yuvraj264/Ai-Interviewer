'use client';

import React, { useState, useEffect } from 'react';
import { InterviewSession, InterviewEvaluation, HumanReviewOverride } from '@ai-interviewer/shared';
import { EvaluationReviewView } from './EvaluationReviewView';

interface CompletionScreenProps {
  session?: InterviewSession;
  sessionId?: string;
  candidateName?: string;
  role?: string;
  type?: string;
  durationMinutes?: number;
  completedAt?: string;
  onReturnHome: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  session,
  sessionId = session?.id || 'sess_demo',
  candidateName = session?.candidateName || 'Candidate',
  role = session?.role || 'Software Engineer',
  type = session?.type || 'technical',
  durationMinutes = session?.durationMinutes || 20,
  completedAt = session?.completedAt,
  onReturnHome,
}) => {
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [isLoadingEval, setIsLoadingEval] = useState(false);
  const [showReviewView, setShowReviewView] = useState(false);

  useEffect(() => {
    const fetchEvaluation = async () => {
      setIsLoadingEval(true);
      try {
        const res = await fetch(`http://localhost:3001/interviews/${sessionId}/evaluation`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setEvaluation(json.data);
          }
        }
      } catch {
        console.warn(`Could not fetch live evaluation from API. Fallback evaluation will be generated.`);
      } finally {
        setIsLoadingEval(false);
      }
    };
    fetchEvaluation();
  }, [sessionId]);

  const handleReviewSubmitted = async (
    overrides: Record<string, HumanReviewOverride>,
    note: string
  ) => {
    try {
      const res = await fetch(`http://localhost:3001/interviews/${sessionId}/evaluation/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewerId: 'usr_human_lead',
          reviewerName: 'Lead Reviewer',
          humanOverrides: overrides,
          overallDecisionNote: note,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setEvaluation(json.data.evaluation);
        }
      }
    } catch {
      console.error('Failed to submit human review');
    }
  };

  return (
    <div className="card-container" style={{ textAlign: 'center', maxWidth: '850px' }}>
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(34, 197, 94, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 className="title" style={{ fontSize: '24px', marginBottom: '8px' }}>
        Interview Completed
      </h1>

      <p className="subtitle" style={{ marginBottom: '24px' }}>
        Thank you, {candidateName}! Your interview session for the <strong>{role}</strong> position has been concluded cleanly.
      </p>

      {/* Summary Metadata Card */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'left',
        }}
      >
        <div>
          <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block' }}>Session ID</span>
          <strong style={{ fontSize: '13px', color: '#f8fafc' }}>{sessionId}</strong>
        </div>
        <div>
          <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block' }}>Focus Type</span>
          <strong style={{ fontSize: '13px', color: '#f8fafc', textTransform: 'capitalize' }}>{type}</strong>
        </div>
        <div>
          <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block' }}>Target Duration</span>
          <strong style={{ fontSize: '13px', color: '#f8fafc' }}>{durationMinutes} min</strong>
        </div>
        <div>
          <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block' }}>Completion Time</span>
          <strong style={{ fontSize: '13px', color: '#f8fafc' }}>{completedAt ? new Date(completedAt).toLocaleTimeString() : 'Just now'}</strong>
        </div>
      </div>

      {/* Evaluation Review Toggle */}
      {evaluation && (
        <div style={{ marginBottom: '24px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowReviewView(!showReviewView)}
            style={{ marginBottom: '16px' }}
          >
            {showReviewView ? 'Hide Evaluation Report' : '📊 View Evidence Evaluation Report'}
          </button>

          {showReviewView && (
            <EvaluationReviewView
              evaluation={evaluation}
              onReviewSubmitted={handleReviewSubmitted}
              isLoading={isLoadingEval}
            />
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button type="button" className="btn-primary" onClick={onReturnHome} style={{ width: 'auto', padding: '10px 24px' }}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};
