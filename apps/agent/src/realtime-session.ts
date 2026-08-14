import { getValidatedEnv } from '@ai-interviewer/config';
import {
  InterviewEngine,
  buildInterviewerInstructions,
  InterviewerPromptContext,
} from '@ai-interviewer/interview-engine';
import { AiConversationState, TranscriptItem, InterviewEngineState } from '@ai-interviewer/shared';

export interface LatencyTelemetry {
  candidateTurnEndTimestamp?: number;
  firstAiAudioTimestamp?: number;
  timeToFirstAudioMs?: number;
}

export class RealtimeVoiceSession {
  public readonly sessionId: string;
  public readonly roomName: string;
  public readonly agentIdentity: string;
  private engine: InterviewEngine;
  private conversationState: AiConversationState = 'IDLE';
  private transcript: TranscriptItem[] = [];
  private telemetry: LatencyTelemetry = {};

  constructor(sessionId: string, promptContext?: InterviewerPromptContext) {
    this.sessionId = sessionId;
    this.roomName = `interview:${sessionId}`;
    this.agentIdentity = `agent-${sessionId}`;

    this.engine = new InterviewEngine(sessionId, {
      type: (promptContext?.interviewType as 'technical' | 'behavioral' | 'mixed') || 'technical',
      durationMinutes: 20,
      maxQuestions: 6,
    });

    const instructions = buildInterviewerInstructions(promptContext);
    const env = getValidatedEnv();
    if (!env.OPENAI_API_KEY) {
      console.warn(`[Realtime Voice Session ${sessionId}] Warning: OPENAI_API_KEY is not configured. Running in simulated voice agent mode.`);
    }

    console.log(`[Realtime Voice Session ${sessionId}] Engine initialized. Prompt length: ${instructions.length} chars`);
  }

  public async startSession(): Promise<void> {
    this.conversationState = 'CONNECTING';
    console.log(`[Realtime Voice Session ${this.sessionId}] [ai.session.started] Connecting to room ${this.roomName}...`);

    const engineState = this.engine.startInterview();
    this.conversationState = 'THINKING';

    const currentQ = engineState.currentQuestion;
    const greetingText = currentQ
      ? currentQ.prompt
      : `Hi, welcome to your interview. I'm your AI interviewer today. To get started, could you briefly introduce yourself?`;

    await this.speak(greetingText);
  }

  public async speak(text: string): Promise<void> {
    this.conversationState = 'SPEAKING';
    const timestamp = new Date().toISOString();

    if (this.telemetry.candidateTurnEndTimestamp && !this.telemetry.firstAiAudioTimestamp) {
      this.telemetry.firstAiAudioTimestamp = Date.now();
      this.telemetry.timeToFirstAudioMs = this.telemetry.firstAiAudioTimestamp - this.telemetry.candidateTurnEndTimestamp;
      console.log(`[Realtime Voice Session ${this.sessionId}] [telemetry.latency] time_to_first_audio: ${this.telemetry.timeToFirstAudioMs} ms`);
    }

    console.log(`[Realtime Voice Session ${this.sessionId}] [ai.response.started] AI Speaking (Stage: ${this.engine.getState().stage}): "${text}"`);

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

    // Submit answer to Engine (Engine owns state transition)
    const currentQ = this.engine.getState().currentQuestion;
    if (currentQ) {
      this.engine.submitAnswer(currentQ.id, candidateText);
    }

    const nextQ = this.engine.nextQuestion();
    if (nextQ) {
      this.speak(nextQ.prompt);
    } else {
      this.speak('Thank you for completing all questions. The interview session is now complete.');
      this.stopSession();
    }
  }

  public getState(): AiConversationState {
    return this.conversationState;
  }

  public getEngineState(): InterviewEngineState {
    return this.engine.getState();
  }

  public getTranscript(): TranscriptItem[] {
    return [...this.transcript];
  }

  public getTelemetry(): LatencyTelemetry {
    return { ...this.telemetry };
  }

  public async stopSession(): Promise<void> {
    this.conversationState = 'ENDING';
    this.engine.completeInterview();
    console.log(`[Realtime Voice Session ${this.sessionId}] [ai.session.ended] Session stopped cleanly.`);
    this.conversationState = 'IDLE';
  }
}
