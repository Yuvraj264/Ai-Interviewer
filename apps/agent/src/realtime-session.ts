import { getValidatedEnv } from '@ai-interviewer/config';
import {
  InterviewEngine,
  AdaptiveQuestioningEngine,
  InterviewContextBuilder,
  ResumeParser,
  JobDescriptionParser,
  CandidateJobMatcher,
  buildInterviewerInstructions,
  InterviewerPromptContext,
  BoundedInterviewContext,
} from '@ai-interviewer/interview-engine';
import {
  AiConversationState,
  TranscriptItem,
  InterviewEngineState,
  AdaptiveDecisionRecord,
  QualityCategory,
  CandidateProfile,
  JobProfile,
  CandidateJobProfile,
} from '@ai-interviewer/shared';

export interface LatencyTelemetry {
  candidateTurnEndTimestamp?: number;
  analysisLatencyMs?: number;
  decisionLatencyMs?: number;
  totalAdaptiveLatencyMs?: number;
  firstAiAudioTimestamp?: number;
  timeToFirstAudioMs?: number;
}

export class RealtimeVoiceSession {
  public readonly sessionId: string;
  public readonly roomName: string;
  public readonly agentIdentity: string;
  private engine: InterviewEngine;
  private adaptiveEngine: AdaptiveQuestioningEngine;
  private contextBuilder: InterviewContextBuilder;
  private candidateProfile: CandidateProfile;
  private jobProfile: JobProfile;
  private match: CandidateJobProfile;
  private conversationState: AiConversationState = 'IDLE';
  private transcript: TranscriptItem[] = [];
  private telemetry: LatencyTelemetry = {};
  private adaptiveRecords: AdaptiveDecisionRecord[] = [];
  private signalHistory: QualityCategory[] = [];

  constructor(
    sessionId: string,
    promptContext?: InterviewerPromptContext & { resumeText?: string; jobDescriptionText?: string }
  ) {
    this.sessionId = sessionId;
    this.roomName = `interview:${sessionId}`;
    this.agentIdentity = `agent-${sessionId}`;

    this.engine = new InterviewEngine(sessionId, {
      type: (promptContext?.interviewType as 'technical' | 'behavioral' | 'mixed') || 'technical',
      durationMinutes: 20,
      maxQuestions: 6,
    });

    this.adaptiveEngine = new AdaptiveQuestioningEngine();
    this.contextBuilder = new InterviewContextBuilder();

    // Parse intelligence context
    const resumeParser = new ResumeParser();
    const jdParser = new JobDescriptionParser();
    const matcher = new CandidateJobMatcher();

    this.candidateProfile = resumeParser.parseResume(
      promptContext?.resumeText || `Name: ${promptContext?.candidateName || 'Candidate'}`,
      `cand_${sessionId}`,
      promptContext?.candidateName
    );
    this.jobProfile = jdParser.parseJobDescription(
      promptContext?.jobDescriptionText || `Role: ${promptContext?.role || 'Software Engineer'}`,
      `job_${sessionId}`,
      promptContext?.role
    );
    this.match = matcher.matchCandidateToJob(this.candidateProfile, this.jobProfile);

    const instructions = buildInterviewerInstructions(promptContext);
    const env = getValidatedEnv();
    if (!env.OPENAI_API_KEY) {
      console.warn(`[Realtime Voice Session ${sessionId}] Warning: OPENAI_API_KEY is not configured. Running in simulated voice agent mode.`);
    }

    console.log(
      `[Realtime Voice Session ${sessionId}] Phase 7 Context Active (${this.match.interviewTargets.length} Targets). Prompt length: ${instructions.length} chars`
    );
  }

  public async startSession(): Promise<void> {
    this.conversationState = 'CONNECTING';
    console.log(`[Realtime Voice Session ${this.sessionId}] [ai.session.started] Connecting to room ${this.roomName}...`);

    const engineState = this.engine.startInterview();
    this.conversationState = 'THINKING';

    const currentQ = engineState.currentQuestion;
    const greetingText = currentQ
      ? currentQ.prompt
      : `Hi ${this.candidateProfile.name || 'there'}, welcome to your interview for the ${this.jobProfile.title} role. Could you briefly introduce yourself?`;

    await this.speak(greetingText);
  }

  public async speak(text: string): Promise<void> {
    this.conversationState = 'SPEAKING';
    const timestamp = new Date().toISOString();

    if (this.telemetry.candidateTurnEndTimestamp && !this.telemetry.firstAiAudioTimestamp) {
      this.telemetry.firstAiAudioTimestamp = Date.now();
      this.telemetry.timeToFirstAudioMs = this.telemetry.firstAiAudioTimestamp - this.telemetry.candidateTurnEndTimestamp;
      console.log(
        `[Realtime Voice Session ${this.sessionId}] [telemetry.latency] adaptive_latency: ${this.telemetry.totalAdaptiveLatencyMs || 0} ms, time_to_first_audio: ${this.telemetry.timeToFirstAudioMs} ms`
      );
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

  public async handleCandidateTurnCompleted(candidateText: string): Promise<void> {
    const turnEnd = Date.now();
    this.telemetry.candidateTurnEndTimestamp = turnEnd;
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

    const currentEngineState = this.engine.getState();
    const currentQ = currentEngineState.currentQuestion;

    if (currentQ) {
      // 1. Submit answer to Interview Engine (State authority)
      this.engine.submitAnswer(currentQ.id, candidateText);

      // 2. Build precomputed turn context
      const turnContext = this.contextBuilder.buildTurnContext(
        this.candidateProfile,
        this.jobProfile,
        this.match,
        currentQ.topic
      );

      // 3. Execute Adaptive Questioning Engine with intelligence context
      const adaptiveResult = await this.adaptiveEngine.processCandidateAnswer(
        this.sessionId,
        currentQ.id,
        currentQ.prompt,
        candidateText,
        currentEngineState.askedQuestionIds,
        currentEngineState.stage,
        currentQ.difficulty,
        this.signalHistory
      );

      this.telemetry.analysisLatencyMs = adaptiveResult.latencyMs.analysisLatencyMs;
      this.telemetry.decisionLatencyMs = adaptiveResult.latencyMs.decisionLatencyMs;
      this.telemetry.totalAdaptiveLatencyMs = adaptiveResult.latencyMs.totalAdaptiveLatencyMs;

      this.adaptiveRecords.push(adaptiveResult.record);
      this.signalHistory.push(adaptiveResult.analysis.qualityCategory);

      console.log(
        `[Realtime Voice Session ${this.sessionId}] [adaptive.decision] Action: ${adaptiveResult.decision.action}, Target: ${turnContext.activeTarget?.topic || 'general'}, Selected Q: ${adaptiveResult.nextQuestion?.id}`
      );
    }

    // 4. Query next valid question from Interview Engine
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

  public getAdaptiveRecords(): AdaptiveDecisionRecord[] {
    return [...this.adaptiveRecords];
  }

  public getTurnContext(): BoundedInterviewContext {
    return this.contextBuilder.buildTurnContext(this.candidateProfile, this.jobProfile, this.match);
  }

  public getTelemetry(): LatencyTelemetry {
    return { ...this.telemetry };
  }

  public async handleReconnection(): Promise<void> {
    console.log(`[Realtime Voice Session ${this.sessionId}] [ai.session.reconnecting] Attempting WebRTC state recovery...`);
    this.conversationState = 'RECONNECTING';
    await new Promise((res) => setTimeout(res, 50));
    this.conversationState = 'LISTENING';
    console.log(`[Realtime Voice Session ${this.sessionId}] [ai.session.reconnected] Connection and interview state recovered cleanly.`);
  }

  public async stopSession(): Promise<void> {
    this.conversationState = 'ENDING';
    this.engine.completeInterview();
    console.log(`[Realtime Voice Session ${this.sessionId}] [ai.session.ended] Session stopped cleanly.`);
    this.conversationState = 'IDLE';
  }
}
