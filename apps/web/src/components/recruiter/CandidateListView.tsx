'use client';

import React, { useState } from 'react';
import { CandidateProfile } from '@ai-interviewer/shared';

interface CandidateListViewProps {
  candidates: CandidateProfile[];
  onSelectCandidate?: (candidateId: string) => void;
}

export const CandidateListView: React.FC<CandidateListViewProps> = ({
  candidates,
  onSelectCandidate,
}) => {
  const [search, setSearch] = useState('');

  const filtered = candidates.filter((c) =>
    (c.name || 'Candidate').toLowerCase().includes(search.toLowerCase()) ||
    (c.headline || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card-container" style={{ textAlign: 'left', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#f8fafc', margin: 0 }}>Candidate Workspace</h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '2px 0 0' }}>
            Inspect candidate profiles, experience claims, and verification statuses.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search candidates by name or skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontSize: '13px',
            width: '260px',
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
          No candidate profiles found matching search criteria.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#cbd5e1' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Candidate Name</th>
                <th style={{ padding: '10px' }}>Headline</th>
                <th style={{ padding: '10px' }}>Skills & Claim Verification</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.candidateId} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '10px', fontWeight: 600, color: '#f8fafc' }}>{c.name || 'Candidate'}</td>
                  <td style={{ padding: '10px', color: '#94a3b8' }}>{c.headline || 'Software Engineer'}</td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {c.skills.slice(0, 4).map((s, idx) => (
                        <span
                          key={idx}
                          className="badge"
                          style={{
                            margin: 0,
                            padding: '2px 6px',
                            fontSize: '11px',
                            backgroundColor:
                              s.verificationStatus === 'SUPPORTED'
                                ? 'rgba(34, 197, 94, 0.15)'
                                : s.verificationStatus === 'UNVERIFIED'
                                ? 'rgba(234, 179, 8, 0.15)'
                                : 'rgba(59, 130, 246, 0.15)',
                            color:
                              s.verificationStatus === 'SUPPORTED'
                                ? '#4ade80'
                                : s.verificationStatus === 'UNVERIFIED'
                                ? '#facc15'
                                : '#60a5fa',
                          }}
                        >
                          {s.canonicalName}: {s.verificationStatus}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => onSelectCandidate && onSelectCandidate(c.candidateId)}
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                    >
                      View Intelligence
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
