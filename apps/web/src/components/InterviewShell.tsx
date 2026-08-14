'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { InterviewSession } from '@ai-interviewer/shared';
import { MockInterviewer, MockInterviewerState } from '@ai-interviewer/interview-engine';
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

  useEffect(() => {
    interviewer.onStateChange((newState) => {
      setInterviewerState(newState);
      if (newState.isCompleted) {
        onComplete();
      }
    });

    interviewer.start();
  }, [interviewer, onComplete]);

  const handleResponseSubmit = async (response: string) => {
    if (!response.trim() || isSubmitting) return;
    setIsSubmitting(true);
    await interviewer.submitCandidateResponse(response);
    setCustomResponse('');
    setIsSubmitting(false);
  };

  const handleConfirmEnd = async () => {
    setShowEndModal(false);
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
            <span style={{ fontSize: '11px', color: '#38bdf8' }}>Deterministic Mock Engine</span>
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
