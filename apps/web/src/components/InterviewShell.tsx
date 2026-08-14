'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { InterviewSession } from '@ai-interviewer/shared';
import { MockInterviewer, MockInterviewerState } from '@ai-interviewer/interview-engine';
import { useRealtimeAudio } from '@/hooks/useRealtimeAudio';
import { SessionTimer } from './SessionTimer';
import { EndInterviewDialog } from './EndInterviewDialog';

interface InterviewShellProps {
  session: InterviewSession;
  onComplete: () => Promise<void>;
}

export const InterviewShell: React.FC<InterviewShellProps> = ({ session, onComplete }) => {
  const interviewer = useMemo(() => new MockInterviewer(session.type), [session.type]);
  const [interviewerState, setInterviewerState] = useState<MockInterviewerState>(interviewer.getState());
  const [customResponse, setCustomResponse] = useState('');
  const [showEndModal, setShowEndModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    connectionState,
    micState,
    agentConnected,
    errorMessage: realtimeError,
    connectRealtime,
    disconnectRealtime,
  } = useRealtimeAudio(session.id);

  useEffect(() => {
    connectRealtime();
  }, [connectRealtime]);

  useEffect(() => {
    interviewer.onStateChange((newState) => {
      setInterviewerState(newState);
      if (newState.isCompleted) {
        disconnectRealtime();
        onComplete();
      }
    });

    interviewer.start();
  }, [interviewer, onComplete, disconnectRealtime]);

  const handleResponseSubmit = async (response: string) => {
    if (!response.trim() || isSubmitting) return;
    setIsSubmitting(true);
    await interviewer.submitCandidateResponse(response);
    setCustomResponse('');
    setIsSubmitting(false);
  };

  const handleConfirmEnd = async () => {
    setShowEndModal(false);
    await disconnectRealtime();
    await interviewer.end();
    await onComplete();
  };

  const currentStep = interviewer.getCurrentStep();

  return (
    <div className="card-container card-wide">
      {/* Shell Header */}
      <div className="shell-header">
        <div>
          <div className="shell-title">{session.role} Interview</div>
          <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'capitalize' }}>
            {session.type} Mode • Candidate: {session.candidateName}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <SessionTimer startedAt={session.startedAt} durationMinutes={session.durationMinutes} />
          <button className="btn-secondary" onClick={() => setShowEndModal(true)} id="open-end-dialog-btn">
            End Interview
          </button>
        </div>
      </div>

      {/* Realtime Connection & Microphone Status Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '10px 16px',
          marginBottom: '20px',
          fontSize: '13px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Connection Status Badge */}
          <div
            className={`badge ${connectionState === 'CONNECTED' ? 'badge-green' : ''}`}
            style={{ margin: 0, padding: '4px 10px', fontSize: '11px' }}
          >
            <span
              className="badge-dot"
              style={{
                backgroundColor:
                  connectionState === 'CONNECTED'
                    ? '#10b981'
                    : connectionState === 'CONNECTING' || connectionState === 'RECONNECTING'
                    ? '#f59e0b'
                    : '#ef4444',
              }}
            ></span>
            <span>WebRTC: {connectionState}</span>
          </div>

          {/* Microphone Status */}
          <div style={{ color: micState === 'ACTIVE' ? '#34d399' : '#94a3b8', fontWeight: 500 }}>
            🎤 Mic: {micState}
          </div>
        </div>

        {/* Agent Presence Indicator */}
        <div style={{ color: agentConnected ? '#38bdf8' : '#94a3b8', fontWeight: 500 }}>
          {agentConnected ? '🤖 Agent Connected' : '⌛ Waiting for Agent...'}
        </div>
      </div>

      {/* Realtime Error Fallback Alert */}
      {realtimeError && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '20px',
            textAlign: 'left',
          }}
        >
          <div style={{ color: '#fca5a5', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
            Realtime Transport Warning
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '12px' }}>{realtimeError}</p>
          <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '12px' }} onClick={connectRealtime}>
            Retry Realtime Connection
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-header">
          <span>INTERVIEW PROGRESS</span>
          <span>
            Question {interviewerState.currentQuestionIndex + 1} of {interviewerState.totalQuestions} ({interviewerState.progressPercentage}%)
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${interviewerState.progressPercentage}%` }}></div>
        </div>
      </div>

      {/* Interviewer Panel */}
      <div className="interviewer-box">
        <div className="interviewer-avatar">
          <div className="avatar-icon">AI</div>
          <div>
            <div className="interviewer-name">AI Interviewer</div>
            <span style={{ fontSize: '11px', color: '#38bdf8' }}>
              {agentConnected ? 'LiveKit Participant Active' : 'Deterministic Mock Engine'}
            </span>
          </div>
        </div>

        <div className="question-text">{interviewerState.currentQuestion}</div>
      </div>

      {/* Candidate Response Section */}
      <div style={{ textAlign: 'left', marginTop: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>Simulated Candidate Response:</label>

        {/* Quick Suggested Answers */}
        {currentStep?.suggestedAnswers && currentStep.suggestedAnswers.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {currentStep.suggestedAnswers.map((answer, idx) => (
              <button
                key={idx}
                className="option-btn"
                style={{ textAlign: 'left', lineHeight: '1.4' }}
                onClick={() => handleResponseSubmit(answer)}
                disabled={isSubmitting}
              >
                💬 "{answer}"
              </button>
            ))}
          </div>
        )}

        {/* Custom Answer Input */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Type your custom response..."
            value={customResponse}
            onChange={(e) => setCustomResponse(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleResponseSubmit(customResponse);
            }}
          />
          <button
            className="btn-primary"
            style={{ width: 'auto', padding: '0 20px', whiteSpace: 'nowrap' }}
            onClick={() => handleResponseSubmit(customResponse)}
            disabled={!customResponse.trim() || isSubmitting}
            id="send-response-btn"
          >
            Submit Response
          </button>
        </div>
      </div>

      {/* End Modal Confirmation */}
      <EndInterviewDialog
        isOpen={showEndModal}
        onCancel={() => setShowEndModal(false)}
        onConfirm={handleConfirmEnd}
      />
    </div>
  );
};
