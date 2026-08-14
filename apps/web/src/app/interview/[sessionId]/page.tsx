'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { InterviewSession } from '@ai-interviewer/shared';
import { InterviewApiClient } from '@/lib/api-client';
import { WaitingRoom } from '@/components/WaitingRoom';
import { InterviewShell } from '@/components/InterviewShell';
import { CompletionScreen } from '@/components/CompletionScreen';
import { ErrorMessage } from '@/components/ErrorMessage';

export default function InterviewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.sessionId as string;

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    if (!sessionId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await InterviewApiClient.getSession(sessionId);
      setSession(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to retrieve interview session.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const handleStartSession = async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      const updated = await InterviewApiClient.startSession(session.id);
      setSession(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to start interview session.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!session) return;
    try {
      const updated = await InterviewApiClient.endSession(session.id);
      setSession(updated);
    } catch {
      setSession({
        ...session,
        status: 'COMPLETED',
        completedAt: new Date().toISOString(),
      });
    }
  };

  if (isLoading && !session) {
    return (
      <div className="card-container">
        <h2>Loading Session...</h2>
        <p className="subtitle">Retrieving session state from server...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <ErrorMessage
        title="Session Unavailable"
        message={error || 'The requested interview session could not be found.'}
        onRetry={() => router.push('/')}
        actionText="Return to Home"
      />
    );
  }

  if (session.status === 'CREATED' || session.status === 'WAITING') {
    return <WaitingRoom session={session} onContinue={handleStartSession} isLoading={isLoading} />;
  }

  if (session.status === 'IN_PROGRESS') {
    return <InterviewShell session={session} onComplete={handleEndSession} />;
  }

  if (session.status === 'COMPLETED') {
    return <CompletionScreen session={session} onReturnHome={() => router.push('/')} />;
  }

  return (
    <ErrorMessage
      title="Session Status Invalid"
      message={`Interview session is in state '${session.status}'.`}
      onRetry={() => router.push('/')}
      actionText="Return to Home"
    />
  );
}
