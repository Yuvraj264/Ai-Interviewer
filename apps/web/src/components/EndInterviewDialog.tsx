'use client';

import React from 'react';

interface EndInterviewDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const EndInterviewDialog: React.FC<EndInterviewDialogProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="end-dialog-title">
      <div className="modal-card">
        <h2 id="end-dialog-title">End Interview Early?</h2>
        <p className="subtitle" style={{ marginBottom: '20px' }}>
          Your responses recorded so far will be saved for evaluation. Are you sure you want to finish now?
        </p>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel} id="cancel-end-btn">
            Continue Interview
          </button>
          <button className="btn-danger" onClick={onConfirm} id="confirm-end-btn">
            End Interview
          </button>
        </div>
      </div>
    </div>
  );
};
