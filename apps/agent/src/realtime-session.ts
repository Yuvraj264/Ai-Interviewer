import { getValidatedEnv } from '@ai-interviewer/config';
import { buildInterviewerInstructions, InterviewerPromptContext } from '@ai-interviewer/interview-engine';
import { AiConversationState, TranscriptItem } from '@ai-interviewer/shared';

export interface LatencyTelemetry {
  candidateTurnEndTimestamp?: number;
  firstAiAudioTimestamp?: number;
  timeToFirstAudioMs?: number;
}

export class RealtimeVoiceSession {
  public readonly sessionId: string;
  public readonly roomName: string;
  public readonly agentIdentity: string;
  private conversationState: AiConversationState = 'IDLE';
  private transcript: TranscriptItem[] = [];
  private telemetry: LatencyTelemetry = {};
  private activeGreeting: string;

  constructor(sessionId: string, promptContext?: InterviewerPromptContext) {
    this.sessionId = sessionId;
    this.roomName = `interview:${sessionId}`;
    this.agentIdentity = `agent-${sessionId}`;

    const instructions = buildInterviewerInstructions(promptContext);
    const candidateName = promptContext?.candidateName || 'Candidate';
    const role = promptContext?.role || 'Software Engineer';
    this.activeGreeting = `Hi ${candidateName}, welcome to your interview for the ${role} position. I'm your AI interviewer today. To get started, could you briefly introduce yourself?`;

    // Ensure OpenAI API key exists ONLY on server/agent process
    const env = getValidatedEnv();
    if (!env.OPENAI_API_KEY) {
      console.warn(`[Realtime Voice Session ${sessionId}] Warning: OPENAI_API_KEY is not configured. Running in simulated voice agent mode.`);
    }

    console.log(`[Realtime Voice Session ${sessionId}] Configured OpenAI Model: ${env.OPENAI_REALTIME_MODEL}, Voice: ${env.OPENAI_REALTIME_VOICE}`);
    console.log(`[Realtime Voice Session ${sessionId}] Instructions length: ${instructions.length} chars`);
  }

  public async startSession(): Promise<void> {
    this.conversationState = 'CONNECTING';
    console.log(`[Realtime Voice Session ${this.sessionId}] [ai.session.started] Connecting to room ${this.roomName}...`);

    // Simulate LiveKit + OpenAI Realtime initialization
    this.conversationState = 'THINKING';
    console.log(`[Realtime Voice Session ${this.sessionId}] [ai.session.ready] Generating initial greeting...`);

    // Emit initial AI greeting
    await this.speak(this.activeGreeting);
  }

  public async speak(text: string): Promise<void> {
    this.conversationState = 'SPEAKING';
    const timestamp = new Date().toISOString();

    if (this.telemetry.candidateTurnEndTimestamp && !this.telemetry.firstAiAudioTimestamp) {
      this.telemetry.firstAiAudioTimestamp = Date.now();
      this.telemetry.timeToFirstAudioMs = this.telemetry.firstAiAudioTimestamp - this.telemetry.candidateTurnEndTimestamp;
      console.log(`[Realtime Voice Session ${this.sessionId}] [telemetry.latency] time_to_first_audio: ${this.telemetry.timeToFirstAudioMs} ms`);
    }

    console.log(`[Realtime Voice Session ${this.sessionId}] [ai.response.started] AI Speaking: "${text}"`);

    this.transcript.push({
      id: `tx_ai_${Date.now()}`,
      speaker: 'ai',
      text,
      timestamp,
    });

    this.conversationState = 'LISTENING';
  }

  public handleCandidateTurnStarted(): void {
    if (this.conversationState === 'SPEAKING') {
      console.log(`[Realtime Voice Session ${this.sessionId}] [ai.response.interrupted] Candidate interrupted AI speech.`);
      this.conversationState = 'INTERRUPTED';
    }
  }

  public handleCandidateTurnCompleted(candidateText: string): void {
    this.telemetry.candidateTurnEndTimestamp = Date.now();
    this.telemetry.firstAiAudioTimestamp = undefined;
    this.telemetry.timeToFirstAudioMs = undefined;

    console.log(`[Realtime Voice Session ${this.sessionId}] [candidate.turn.completed] Candidate: "${candidateText}"`);

    this.transcript.push({
      id: `tx_candidate_${Date.now()}`,
      speaker: 'candidate',
      text: candidateText,
      timestamp: new Date().toISOString(),
    });

    this.conversationState = 'THINKING';
  }

  public getState(): AiConversationState {
    return this.conversationState;
  }

  public getTranscript(): TranscriptItem[] {
    return [...this.transcript];
  }

  public getTelemetry(): LatencyTelemetry {
    return { ...this.telemetry };
  }

  public async stopSession(): Promise<void> {
    this.conversationState = 'ENDING';
    console.log(`[Realtime Voice Session ${this.sessionId}] [ai.session.ended] Session stopped cleanly.`);
    this.conversationState = 'IDLE';
  }
}
