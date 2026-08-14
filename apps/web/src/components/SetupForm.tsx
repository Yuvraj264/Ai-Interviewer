'use client';

import React, { useState } from 'react';
import { createSessionSchema, InterviewType } from '@ai-interviewer/shared';

interface SetupFormProps {
  onSubmit: (data: {
    candidateName: string;
    role: string;
    type: InterviewType;
    durationMinutes: number;
    resumeText?: string;
    jobDescriptionText?: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export const SetupForm: React.FC<SetupFormProps> = ({ onSubmit, isLoading }) => {
  const [candidateName, setCandidateName] = useState('');
  const [role, setRole] = useState('');
  const [type, setType] = useState<InterviewType>('technical');
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = createSessionSchema.safeParse({
      candidateName,
      role,
      type,
      durationMinutes,
    });

    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    await onSubmit({
      candidateName: candidateName.trim() || 'Alex Mercer',
      role: role.trim() || 'Senior Backend Engineer',
      type,
      durationMinutes,
      resumeText: resumeText.trim() || undefined,
      jobDescriptionText: jobDescriptionText.trim() || undefined,
    });
  };

  return (
    <div className="card-container">
      <h1 className="title" style={{ fontSize: '24px', marginBottom: '8px' }}>
        Configure Candidate Interview
      </h1>
      <p className="subtitle" style={{ marginBottom: '24px' }}>
        Set up candidate metadata, target role, resume, and job description.
      </p>

      <form onSubmit={handleSubmit} className="setup-form">
        {/* Candidate Name Input */}
        <div style={{ textAlign: 'left', marginBottom: '16px' }}>
          <label htmlFor="candidateName" style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>
            Candidate Full Name *
          </label>
          <input
            id="candidateName"
            type="text"
            placeholder="e.g. Alex Mercer"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            disabled={isLoading}
            style={{ width: '100%' }}
          />
          {errors.candidateName && (
            <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {errors.candidateName}
            </span>
          )}
        </div>

        {/* Target Role Input */}
        <div style={{ textAlign: 'left', marginBottom: '16px' }}>
          <label htmlFor="role" style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>
            Target Engineering Role *
          </label>
          <input
            id="role"
            type="text"
            placeholder="e.g. Senior Full Stack Engineer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isLoading}
            style={{ width: '100%' }}
          />
          {errors.role && (
            <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {errors.role}
            </span>
          )}
        </div>

        {/* Resume Text Input */}
        <div style={{ textAlign: 'left', marginBottom: '16px' }}>
          <label htmlFor="resumeText" style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>
            Candidate Resume (Optional)
          </label>
          <textarea
            id="resumeText"
            rows={3}
            placeholder="Paste candidate resume text or project claims..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            disabled={isLoading}
            style={{ width: '100%', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#f8fafc', padding: '10px' }}
          />
        </div>

        {/* Job Description Text Input */}
        <div style={{ textAlign: 'left', marginBottom: '16px' }}>
          <label htmlFor="jobDescriptionText" style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>
            Job Description (Optional)
          </label>
          <textarea
            id="jobDescriptionText"
            rows={3}
            placeholder="Paste job description requirements and responsibilities..."
            value={jobDescriptionText}
            onChange={(e) => setJobDescriptionText(e.target.value)}
            disabled={isLoading}
            style={{ width: '100%', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#f8fafc', padding: '10px' }}
          />
        </div>

        {/* Interview Type Selection */}
        <div style={{ textAlign: 'left', marginBottom: '16px' }}>
          <label htmlFor="type" style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>
            Interview Focus Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as InterviewType)}
            disabled={isLoading}
            style={{ width: '100%' }}
          >
            <option value="technical">Technical Focus (Architecture, System Design, Coding)</option>
            <option value="behavioral">Behavioral Focus (Leadership, Team Conflict, Growth)</option>
            <option value="mixed">Mixed Assessment (Technical + Behavioral)</option>
          </select>
        </div>

        {/* Duration Selector */}
        <div style={{ textAlign: 'left', marginBottom: '24px' }}>
          <label htmlFor="durationMinutes" style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>
            Session Duration
          </label>
          <select
            id="durationMinutes"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            disabled={isLoading}
            style={{ width: '100%' }}
          >
            <option value={15}>15 Minutes (Brief Screening)</option>
            <option value={20}>20 Minutes (Standard Technical Round)</option>
            <option value={30}>30 Minutes (Deep Dive Session)</option>
            <option value={45}>45 Minutes (Full Comprehensive Panel)</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-primary" disabled={isLoading} id="create-session-btn">
          {isLoading ? 'Preparing Session...' : 'Create & Enter Waiting Room'}
        </button>
      </form>
    </div>
  );
};
