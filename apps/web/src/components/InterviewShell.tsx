'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { InterviewSession, TranscriptItem, InterviewStage } from '@ai-interviewer/shared';
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
  const [localTranscript, setLocalTranscript] = useState<TranscriptItem[]>([]);

  const currentEngineStage: InterviewStage = useMemo(() => {
    if (interviewerState.isCompleted) return 'COMPLETED';
    const stages: InterviewStage[] = ['INTRO', 'BACKGROUND', 'TECHNICAL', 'BEHAVIORAL', 'CLOSING'];
    return stages[interviewerState.currentQuestionIndex] || 'TECHNICAL';
  }, [interviewerState.currentQuestionIndex, interviewerState.isCompleted]);

  const {
    connectionState,
    micState,
    aiConversationState,
    agentConnected,
    errorMessage: realtimeError,
    connectRealtime,
    disconnectRealtime,
  } = useRealtimeAudio(session.id);

  useEffect(() => {
    connectRealtime();
  }, [connectRealtime]);

  useEffect(() => {
    setLocalTranscript([
      {
        id: `tx_init_${Date.now()}`,
        speaker: 'ai',
        text: `Hi ${session.candidateName}, welcome to your interview for the ${session.role} position. To get started, could you briefly introduce yourself?`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, [session.candidateName, session.role]);

  useEffect(() => {
    interviewer.onStateChange((newState) => {
      setInterviewerState(newState);

      if (newState.currentQuestion && !newState.isCompleted) {
        setLocalTranscript((prev) => [
          ...prev,
          {
            id: `tx_ai_${Date.now()}`,
            speaker: 'ai',
            text: newState.currentQuestion,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }

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

    setLocalTranscript((prev) => [
      ...prev,
      {
        id: `tx_cand_${Date.now()}`,
        speaker: 'candidate',
        text: response,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

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
          <div className="shell-title">{session.role} Adaptive Voice Interview</div>
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

      {/* Realtime Transport & Adaptive Engine Dashboard */}
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

          {/* Engine Stage Badge */}
          <div
            className="badge"
            style={{
              margin: 0,
              padding: '4px 10px',
              fontSize: '11px',
              backgroundColor: 'rgba(168, 85, 247, 0.15)',
              borderColor: 'rgba(168, 85, 247, 0.3)',
              color: '#c084fc',
            }}
          >
            ⚙️ Stage: {currentEngineStage}
          </div>

          {/* Adaptive Questioning Badge */}
          <div
            className="badge"
            style={{
              margin: 0,
              padding: '4px 10px',
              fontSize: '11px',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              borderColor: 'rgba(34, 197, 94, 0.3)',
              color: '#4ade80',
            }}
          >
            ⚡ Adaptive: Active
          </div>

          {/* Intelligence Context Badge */}
          <div
            className="badge"
            style={{
              margin: 0,
              padding: '4px 10px',
              fontSize: '11px',
              backgroundColor: 'rgba(234, 179, 8, 0.15)',
              borderColor: 'rgba(234, 179, 8, 0.3)',
              color: '#facc15',
            }}
          >
            🎯 Resume + JD Context Active
          </div>

          {/* AI Voice State Badge */}
          <div
            className="badge"
            style={{
              margin: 0,
              padding: '4px 10px',
              fontSize: '11px',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              borderColor: 'rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
            }}
          >
            🤖 Voice AI: {aiConversationState}
          </div>

          {/* Microphone Status */}
          <div style={{ color: micState === 'ACTIVE' ? '#34d399' : '#94a3b8', fontWeight: 500 }}>
            🎤 Mic: {micState}
          </div>
        </div>

        {/* Agent Presence Indicator */}
        <div style={{ color: agentConnected ? '#38bdf8' : '#94a3b8', fontWeight: 500 }}>
          {agentConnected ? '🤖 Agent Participant Connected' : '⌛ Waiting for Agent...'}
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
            Voice Transport Warning
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '12px' }}>{realtimeError}</p>
          <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '12px' }} onClick={connectRealtime}>
            Retry Voice Connection
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-header">
          <span>ADAPTIVE ENGINE STAGE PROGRESS</span>
          <span>
            Question {interviewerState.currentQuestionIndex + 1} of {interviewerState.totalQuestions} ({interviewerState.progressPercentage}%)
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${interviewerState.progressPercentage}%` }}></div>
        </div>
      </div>

      {/* Interviewer Active Avatar Box */}
      <div className="interviewer-box">
        <div className="interviewer-avatar">
          <div className="avatar-icon">AI</div>
          <div>
            <div className="interviewer-name">AI Interviewer</div>
            <span style={{ fontSize: '11px', color: '#38bdf8' }}>
              Adaptive Questioning Engine • OpenAI Realtime (gpt-4o-realtime-preview)
            </span>
          </div>
        </div>

        <div className="question-text">{interviewerState.currentQuestion}</div>
      </div>

      {/* Realtime Speech Transcript Feed */}
      <div style={{ textAlign: 'left', marginTop: '24px' }}>
        <div style={{ fontWeight: 600, fontSize: '14px', color: '#f8fafc', marginBottom: '10px' }}>
          Live Adaptive Conversation Transcript:
        </div>
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '14px 16px',
            maxHeight: '180px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          {localTranscript.map((item) => (
            <div key={item.id} style={{ fontSize: '13px', lineHeight: '1.4' }}>
              <span style={{ color: item.speaker === 'ai' ? '#38bdf8' : '#34d399', fontWeight: 600 }}>
                {item.speaker === 'ai' ? 'AI Interviewer' : session.candidateName}:
              </span>{' '}
              <span style={{ color: '#cbd5e1' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Spoken & Text Response Actions */}
      <div style={{ textAlign: 'left', marginTop: '10px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>Simulated Candidate Spoken Response:</label>

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
            placeholder="Type your response or speak into your microphone..."
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
