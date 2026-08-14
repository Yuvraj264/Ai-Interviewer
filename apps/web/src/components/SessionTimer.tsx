'use client';

import React, { useEffect, useState } from 'react';

interface SessionTimerProps {
  startedAt?: string;
  durationMinutes: number;
}

export const SessionTimer: React.FC<SessionTimerProps> = ({ startedAt, durationMinutes }) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(durationMinutes * 60);

  useEffect(() => {
    if (!startedAt) {
      setSecondsRemaining(durationMinutes * 60);
      return;
    }

    const calculateRemaining = () => {
      const startTime = new Date(startedAt).getTime();
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      const totalSeconds = durationMinutes * 60;
      const remaining = Math.max(0, totalSeconds - elapsedSeconds);
      setSecondsRemaining(remaining);
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [startedAt, durationMinutes]);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return <div className="timer-box">{formattedTime}</div>;
};
