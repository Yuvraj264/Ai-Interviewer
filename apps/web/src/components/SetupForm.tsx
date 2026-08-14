'use client';

import React, { useState } from 'react';
import { CreateSessionDto, createSessionSchema, InterviewType } from '@ai-interviewer/shared';

interface SetupFormProps {
  onSubmit: (dto: CreateSessionDto) => Promise<void>;
  isLoading?: boolean;
}

export const SetupForm: React.FC<SetupFormProps> = ({ onSubmit, isLoading = false }) => {
  const [candidateName, setCandidateName] = useState('');
  const [role, setRole] = useState('Software Engineer');
  const [type, setType] = useState<InterviewType>('technical');
  const [durationMinutes, setDurationMinutes] = useState<number>(20);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData: CreateSessionDto = {
      candidateName,
      role,
      type,
      durationMinutes,
    };

    const parseResult = createSessionSchema.safeParse(formData);

    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      const formatted = parseResult.error.flatten().fieldErrors;
      Object.entries(formatted).forEach(([key, val]) => {
        if (val && val.length > 0) fieldErrors[key] = val[0];
      });
      setErrors(fieldErrors);
      return;
    }

    await onSubmit(parseResult.data);
  };

  return (
    <div className="card-container">
      <h2>Interview Setup</h2>
      <p className="subtitle">Customize your interview parameters before proceeding.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="candidateName">Candidate Name</label>
          <input
            id="candidateName"
            type="text"
            placeholder="e.g. Alex Johnson"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />
          {errors.candidateName && <span className="error-text">{errors.candidateName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="role">Target Role</label>
          <input
            id="role"
            type="text"
            placeholder="e.g. Senior Backend Engineer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          {errors.role && <span className="error-text">{errors.role}</span>}
        </div>

        <div className="form-group">
          <label>Interview Focus</label>
          <div className="options-grid">
            {(['technical', 'behavioral', 'mixed'] as InterviewType[]).map((t) => (
              <button
                key={t}
                type="button"
                className={`option-btn ${type === t ? 'selected' : ''}`}
                onClick={() => setType(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          {errors.type && <span className="error-text">{errors.type}</span>}
        </div>

        <div className="form-group">
          <label>Duration (Minutes)</label>
          <div className="options-grid">
            {[10, 20, 30].map((d) => (
              <button
                key={d}
                type="button"
                className={`option-btn ${durationMinutes === d ? 'selected' : ''}`}
                onClick={() => setDurationMinutes(d)}
              >
                {d} mins
              </button>
            ))}
          </div>
          {errors.durationMinutes && <span className="error-text">{errors.durationMinutes}</span>}
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading} id="submit-setup-btn">
          {isLoading ? 'Creating Session...' : 'Create Interview Session'}
        </button>
      </form>
    </div>
  );
};
