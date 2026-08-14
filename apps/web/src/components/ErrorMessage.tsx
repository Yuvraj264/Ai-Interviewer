'use client';

import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  actionText?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  actionText = 'Try Again',
}) => {
  return (
    <div className="card-container">
      <div className="badge" style={{ background: 'rgba(239, 68, 68, 0.12)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}>
        <span className="badge-dot" style={{ backgroundColor: '#ef4444' }}></span>
        <span>Service Alert</span>
      </div>

      <h2>{title}</h2>
      <p className="subtitle" style={{ marginBottom: '24px' }}>
        {message}
      </p>

      {onRetry && (
        <button className="btn-secondary" onClick={onRetry} id="error-retry-btn">
          {actionText}
        </button>
      )}
    </div>
  );
};
