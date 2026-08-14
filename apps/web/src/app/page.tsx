import { PROJECT_PHASE } from '@ai-interviewer/shared';

export default function Home() {
  return (
    <main className="glass-card">
      <div className="badge">
        <span className="badge-dot"></span>
        <span>Repository Foundation Ready</span>
      </div>
      
      <h1>AI Interviewer</h1>
      <p className="subtitle">{PROJECT_PHASE}</p>

      <div className="status-grid">
        <div className="status-item">
          <div className="status-label">Architecture</div>
          <div className="status-value">Turborepo + pnpm</div>
        </div>
        <div className="status-item">
          <div className="status-label">Framework</div>
          <div className="status-value">Next.js 14 App Router</div>
        </div>
        <div className="status-item">
          <div className="status-label">Backend API</div>
          <div className="status-value">NestJS (GET /health)</div>
        </div>
        <div className="status-item">
          <div className="status-label">Infrastructure</div>
          <div className="status-value">PostgreSQL + Valkey</div>
        </div>
      </div>
    </main>
  );
}
