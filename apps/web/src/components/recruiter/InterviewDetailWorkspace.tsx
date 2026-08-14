'use client';

import React, { useState } from 'react';
import {
  InterviewSession,
  CandidateProfile,
  JobProfile,
  InterviewEvaluation,
  TranscriptItem,
} from '@ai-interviewer/shared';
import { EvaluationReviewView } from '../EvaluationReviewView';

interface InterviewDetailWorkspaceProps {
  session: InterviewSession;
  profile?: CandidateProfile;
  _job?: JobProfile;
  evaluation?: InterviewEvaluation;
  transcript?: TranscriptItem[];
}

export const InterviewDetailWorkspace: React.FC<InterviewDetailWorkspaceProps> = ({
  session,
  profile,
  _job,
  evaluation,
  transcript = [
    { id: 't1', speaker: 'ai', text: 'Welcome! Could you give a brief overview of your technical background?', timestamp: '00:00:00' },
    { id: 't2', speaker: 'candidate', text: 'I built PrimeBank microservices using Spring Boot, PostgreSQL indexing, and Redis caching for scalability.', timestamp: '00:00:05' },
    { id: 't3', speaker: 'ai', text: 'You mentioned Redis caching. How did you manage cache invalidation?', timestamp: '00:00:10' },
    { id: 't4', speaker: 'candidate', text: 'I used write-through caching with TTL eviction rules for volatile session state.', timestamp: '00:00:15' },
  ],
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transcript' | 'adaptive' | 'evidence' | 'evaluation'>('overview');
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [selectedTranscriptRef, setSelectedTranscriptRef] = useState<string | null>(null);

  const filteredTranscript = transcript.filter((t) =>
    t.text.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  const handleEvidenceClick = (transcriptRef?: string) => {
    if (transcriptRef) {
      setSelectedTranscriptRef(transcriptRef);
      setActiveTab('transcript');
    }
  };

  return (
    <div className="card-container" style={{ textAlign: 'left', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Workspace Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
            Interview Intelligence Workspace — {session.candidateName}
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '2px 0 0' }}>
            Target Role: <strong>{session.role}</strong> | Session ID: <code>{session.id}</code>
          </p>
        </div>

        <span className="badge badge-success" style={{ margin: 0 }}>
          {session.status}
        </span>
      </div>

      {/* Workspace Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '20px' }}>
        {(['overview', 'transcript', 'adaptive', 'evidence', 'evaluation'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 500,
              border: 'none',
              background: 'transparent',
              color: activeTab === tab ? '#38bdf8' : '#94a3b8',
              borderBottom: activeTab === tab ? '2px solid #38bdf8' : '2px solid transparent',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {tab === 'adaptive' ? 'Adaptive Flow' : tab === 'evidence' ? 'Evidence Explorer' : tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Focus Type</span>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#f8fafc', marginTop: '2px', textTransform: 'capitalize' }}>{session.type}</div>
            </div>

            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Target Duration</span>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>{session.durationMinutes} min</div>
            </div>

            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Evaluation Status</span>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#4ade80', marginTop: '2px' }}>{evaluation?.status || 'COMPLETED'}</div>
            </div>
          </div>

          {profile && (
            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#f8fafc' }}>Parsed Candidate Intelligence Profile</h4>
              <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '0 0 8px' }}>{profile.summary || 'Experience in backend system architecture, API optimization, and database indexing.'}</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {profile.skills.map((s, idx) => (
                  <span key={idx} className="badge" style={{ margin: 0, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontSize: '11px' }}>
                    {s.canonicalName} ({s.verificationStatus})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Transcript */}
      {activeTab === 'transcript' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>Complete Turn Transcript ({filteredTranscript.length} Turns)</span>
            <input
              type="text"
              placeholder="Search transcript content..."
              value={transcriptSearch}
              onChange={(e) => setTranscriptSearch(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '4px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '12px', width: '220px' }}
            />
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {filteredTranscript.map((turn) => {
              const isSelected = selectedTranscriptRef === turn.id;
              return (
                <div
                  key={turn.id}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: turn.speaker === 'ai' ? 'rgba(30, 41, 59, 0.6)' : 'rgba(15, 23, 42, 0.8)',
                    borderLeft: isSelected ? '4px solid #38bdf8' : turn.speaker === 'ai' ? '4px solid #6366f1' : '4px solid #22c55e',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '12px', color: turn.speaker === 'ai' ? '#818cf8' : '#4ade80', textTransform: 'uppercase' }}>
                      {turn.speaker === 'ai' ? '🤖 AI Interviewer' : `👤 ${session.candidateName}`}
                    </strong>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{turn.timestamp}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>{turn.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Adaptive Flow */}
      {activeTab === 'adaptive' && (
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#f8fafc', marginBottom: '12px' }}>Adaptive Decision Graph & Validation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', fontWeight: 600, fontSize: '13px' }}>Q1: INTRO</div>
              <div style={{ fontSize: '18px', color: '#94a3b8' }}>➔</div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 600 }}>Candidate Answer: STRONG</span>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#cbd5e1' }}>Discussed Spring Boot and Redis caching claims.</p>
              </div>
              <div style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', fontSize: '12px', fontWeight: 600 }}>Action: FOLLOW_UP (Redis)</div>
            </div>

            <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', fontWeight: 600, fontSize: '13px' }}>Q2: REDIS</div>
              <div style={{ fontSize: '18px', color: '#94a3b8' }}>➔</div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 600 }}>Candidate Answer: STRONG</span>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#cbd5e1' }}>Explained write-through cache eviction rules.</p>
              </div>
              <div style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#facc15', fontSize: '12px', fontWeight: 600 }}>Action: NEW_TOPIC (System Design)</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Evidence Explorer */}
      {activeTab === 'evidence' && (
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#f8fafc', marginBottom: '12px' }}>Observable Evidence Explorer</h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>Click any evidence item to navigate directly to its supporting transcript reference turn.</p>

          <div style={{ display: 'grid', gap: '12px' }}>
            {evaluation?.evaluatedDimensions.flatMap((d) => d.evidence).map((ev) => (
              <div
                key={ev.id}
                onClick={() => handleEvidenceClick(ev.transcriptReference)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#60a5fa' }}>{ev.dimensionId.toUpperCase()}</span>
                  <span className="badge" style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', fontSize: '11px', margin: 0 }}>
                    {ev.evidenceType} EVIDENCE
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#f8fafc' }}>{ev.summary}</p>
                <span style={{ fontSize: '11px', color: '#38bdf8', marginTop: '6px', display: 'inline-block' }}>
                  🔍 Click to view transcript turn `{ev.transcriptReference}` ➔
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Evaluation */}
      {activeTab === 'evaluation' && evaluation && (
        <EvaluationReviewView evaluation={evaluation} />
      )}
    </div>
  );
};
