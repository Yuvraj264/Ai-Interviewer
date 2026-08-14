'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateSessionDto } from '@ai-interviewer/shared';
import { InterviewApiClient } from '@/lib/api-client';
import { LandingView } from '@/components/LandingView';
import { SetupForm } from '@/components/SetupForm';
import { ErrorMessage } from '@/components/ErrorMessage';

export default function HomePage() {
  const router = useRouter();
  const [step, setStep] = useState<'landing' | 'setup'>('landing');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCreateSession = async (dto: CreateSessionDto) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const session = await InterviewApiClient.createSession(dto);
      router.push(`/interview/${session.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create interview session.';
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  if (errorMessage) {
    return (
      <ErrorMessage
        title="Session Creation Failed"
        message={errorMessage}
        onRetry={() => {
          setErrorMessage(null);
          setStep('setup');
        }}
      />
    );
  }

  if (step === 'setup') {
    return <SetupForm onSubmit={handleCreateSession} isLoading={isLoading} />;
  }

  return <LandingView onStart={() => setStep('setup')} />;
}
