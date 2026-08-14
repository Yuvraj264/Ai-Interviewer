'use client';

import React, { useState } from 'react';
import { InterviewEvaluation, HumanReviewOverride } from '@ai-interviewer/shared';

interface EvaluationReviewViewProps {
  evaluation: InterviewEvaluation;
  onReviewSubmitted?: (humanOverrides: Record<string, HumanReviewOverride>, note: string) => Promise<void>;
  isLoading?: boolean;
}

export const EvaluationReviewView: React.FC<EvaluationReviewViewProps> = ({
  evaluation,
  onReviewSubmitted,
  isLoading = false,
}) => {
  const [overrides, setOverrides] = useState<Record<string, { score: number; note: string }>>({});
  const [generalNote, setGeneralNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleScoreChange = (dimensionId: string, score: number) => {
    setOverrides((prev) => ({
      ...prev,
      [dimensionId]: { score, note: prev[dimensionId]?.note || 'Score adjusted during review.' },
    }));
  };

  const handleNoteChange = (dimensionId: string, note: string) => {
    setOverrides((prev) => ({
      ...prev,
      [dimensionId]: { score: prev[dimensionId]?.score || 4, note },
    }));
  };

  const handleSubmitReview = async () => {
    if (!onReviewSubmitted) return;
    setIsSubmitting(true);
    try {
      await onReviewSubmitted(overrides, generalNote);
      setSubmittedMessage('Human review overrides submitted cleanly.');
    } catch {
      setSubmittedMessage('Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-container" style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
            Structured Interview Evidence Evaluation
          </h2>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            Rubric: {evaluation.rubricVersion} | Model: {evaluation.modelVersion}
          </span>
        </div>

        <div
          className="badge"
          style={{
            margin: 0,
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            borderColor: 'rgba(59, 130, 246, 0.3)',
            color: '#60a5fa',
          }}
        >
          📊 Evidence Assistant
        </div>
      </div>

      <div
        style={{
          padding: '12px 16px',
          backgroundColor: 'rgba(234, 179, 8, 0.1)',
          borderLeft: '4px solid #eab308',
          borderRadius: '6px',
          marginBottom: '24px',
          fontSize: '13px',
          color: '#fef08a',
        }}
      >
        <strong>Human Reviewer Notice:</strong> This report provides observable interview evidence strength assessments. It is an <em>Interview Evaluation Assistant</em> and does not issue autonomous hiring decisions.
      </div>

      {/* Competency Dimensions Section */}
      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#e2e8f0' }}>
        Competency Evidence Strengths (Scale 1–5)
      </h3>

      <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
        {evaluation.evaluatedDimensions.map((dim) => (
          <div
            key={dim.dimensionId}
            style={{
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', color: '#f8fafc' }}>{dim.name}</h4>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>{dim.description}</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                {dim.status === 'INSUFFICIENT_EVIDENCE' ? (
                  <span className="badge" style={{ backgroundColor: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8' }}>
                    INSUFFICIENT EVIDENCE
                  </span>
                ) : (
                  <span
                    className="badge"
                    style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.15)',
                      color: '#4ade80',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    Score: {overrides[dim.dimensionId]?.score || dim.score} / 5
                  </span>
                )}
              </div>
            </div>

            {/* Evidence List */}
            {dim.evidence.length > 0 && (
              <div style={{ marginTop: '12px', paddingLeft: '12px', borderLeft: '2px solid rgba(59, 130, 246, 0.5)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#93c5fd' }}>Observable Evidence Citations:</span>
                <ul style={{ margin: '4px 0 0', paddingLeft: '16px', fontSize: '13px', color: '#cbd5e1' }}>
                  {dim.evidence.map((ev) => (
                    <li key={ev.id} style={{ marginBottom: '4px' }}>
                      {ev.summary} <span style={{ fontSize: '11px', color: '#64748b' }}>(Ref: {ev.transcriptReference})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Limitations or Flags */}
            {dim.limitations.length > 0 && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#fca5a5' }}>
                ⚠️ Note: {dim.limitations.join(', ')}
              </div>
            )}

            {/* Human Override Controls */}
            {onReviewSubmitted && (
              <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Human Reviewer Override Score:
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleScoreChange(dim.dimensionId, val)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backgroundColor: (overrides[dim.dimensionId]?.score || dim.score) === val ? '#3b82f6' : 'transparent',
                        color: '#fff',
                        cursor: 'pointer',
                      }}
                    >
                      {val}
                    </button>
                  ))}
                  <input
                    type="text"
                    placeholder="Reviewer override note..."
                    value={overrides[dim.dimensionId]?.note || ''}
                    onChange={(e) => handleNoteChange(dim.dimensionId, e.target.value)}
                    style={{ flex: 1, padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Requirement Coverage Table */}
      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#e2e8f0' }}>
        Job Requirement Evidence Coverage
      </h3>

      <div style={{ overflowX: 'auto', marginBottom: '32px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#cbd5e1' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Requirement</th>
              <th style={{ padding: '8px' }}>Evidence Status</th>
              <th style={{ padding: '8px' }}>Evidence Summary</th>
            </tr>
          </thead>
          <tbody>
            {evaluation.requirementEvaluations.map((req, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '8px', fontWeight: 500, color: '#f8fafc' }}>{req.skillOrRequirement}</td>
                <td style={{ padding: '8px' }}>
                  <span
                    className="badge"
                    style={{
                      margin: 0,
                      padding: '2px 8px',
                      fontSize: '11px',
                      backgroundColor:
                        req.status === 'SUPPORTED' || req.status === 'STRONGLY_SUPPORTED'
                          ? 'rgba(34, 197, 94, 0.15)'
                          : req.status === 'NOT_TESTED'
                          ? 'rgba(148, 163, 184, 0.15)'
                          : 'rgba(234, 179, 8, 0.15)',
                      color:
                        req.status === 'SUPPORTED' || req.status === 'STRONGLY_SUPPORTED'
                          ? '#4ade80'
                          : req.status === 'NOT_TESTED'
                          ? '#94a3b8'
                          : '#facc15',
                    }}
                  >
                    {req.status}
                  </span>
                </td>
                <td style={{ padding: '8px', color: '#94a3b8' }}>{req.evidenceSummary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Human Review Submission Form */}
      {onReviewSubmitted && (
        <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#f8fafc' }}>Authorized Human Reviewer Sign-off</h4>
          <textarea
            rows={2}
            placeholder="Add general hiring team notes or summary evaluation comments..."
            value={generalNote}
            onChange={(e) => setGeneralNote(e.target.value)}
            style={{ width: '100%', borderRadius: '6px', padding: '8px', fontSize: '13px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', marginBottom: '12px' }}
          />

          <button
            type="button"
            className="btn-primary"
            onClick={handleSubmitReview}
            disabled={isSubmitting || isLoading}
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            {isSubmitting ? 'Submitting Review...' : 'Submit Human Review Overrides'}
          </button>

          {submittedMessage && (
            <div style={{ marginTop: '8px', color: '#4ade80', fontSize: '12px' }}>{submittedMessage}</div>
          )}
        </div>
      )}
    </div>
  );
};
