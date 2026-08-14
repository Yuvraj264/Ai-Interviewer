"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  INTERVIEW_ENGINE_VERSION: () => INTERVIEW_ENGINE_VERSION,
  MockInterviewer: () => MockInterviewer
});
module.exports = __toCommonJS(index_exports);
var DEFAULT_QUESTIONS = {
  technical: [
    {
      id: "tech_1",
      question: "Welcome! To start off, please describe your experience with modern TypeScript and distributed architectures.",
      category: "intro",
      suggestedAnswers: [
        "I have 4+ years of experience building TypeScript microservices with Node.js and REST/gRPC APIs.",
        "I specialize in frontend React and Next.js applications with state management."
      ]
    },
    {
      id: "tech_2",
      question: "Walk me through a challenging technical problem you recently solved. What trade-offs did you evaluate?",
      category: "technical",
      suggestedAnswers: [
        "We faced high latency in DB queries, so I introduced Redis caching and query indexing.",
        "We decoupled our monodb into microservices, improving deployment speed and fault tolerance."
      ]
    },
    {
      id: "tech_3",
      question: "How do you ensure system scalability, performance, and fault tolerance when building production APIs?",
      category: "technical",
      suggestedAnswers: [
        "Using horizontal auto-scaling, asynchronous queues, rate limiting, and structured logging.",
        "Enforcing strict API contracts, circuit breakers, and comprehensive automated test suites."
      ]
    },
    {
      id: "tech_4",
      question: "Thank you! That completes our technical assessment. Do you have any final remarks on your implementation strategy?",
      category: "completion",
      suggestedAnswers: ["I focus on clean, testable, and maintainable architecture."]
    }
  ],
  behavioral: [
    {
      id: "beh_1",
      question: "Welcome! Tell me about a time you had to navigate ambiguity or conflicting priorities on a critical project.",
      category: "intro",
      suggestedAnswers: [
        "I aligned stakeholders by presenting a phased roadmap and prioritizing high-impact MVP features."
      ]
    },
    {
      id: "beh_2",
      question: "Describe a situation where a project or release failed to meet expectations. What did you learn?",
      category: "behavioral",
      suggestedAnswers: [
        "We missed a edge-case scenario; I introduced automated integration testing to prevent recurrence."
      ]
    },
    {
      id: "beh_3",
      question: "How do you collaborate with non-technical team members, product managers, and designers?",
      category: "behavioral",
      suggestedAnswers: [
        "By translating technical constraints into business impact and maintaining open feedback channels."
      ]
    },
    {
      id: "beh_4",
      question: "Thank you! That concludes our behavioral questions. We appreciate your insights.",
      category: "completion",
      suggestedAnswers: ["Thank you for the thoughtful discussion!"]
    }
  ],
  mixed: [
    {
      id: "mix_1",
      question: "Welcome! Please introduce yourself and highlight your core technical and leadership strengths.",
      category: "intro",
      suggestedAnswers: [
        "I am a Senior Software Engineer passionate about backend architecture and engineering mentorship."
      ]
    },
    {
      id: "mix_2",
      question: "Technical Question: Explain how you design RESTful APIs for consistency, versioning, and client safety.",
      category: "technical",
      suggestedAnswers: [
        "I use clear URL resources, standard HTTP verbs, semantic status codes, and URI versioning."
      ]
    },
    {
      id: "mix_3",
      question: "Behavioral Question: How do you handle code reviews when you disagree with a peer architectural choice?",
      category: "behavioral",
      suggestedAnswers: [
        "I focus on objective trade-offs, performance metrics, and team coding guidelines."
      ]
    },
    {
      id: "mix_4",
      question: "Thank you! That concludes our mixed interview session. Your responses have been recorded.",
      category: "completion",
      suggestedAnswers: ["Thank you!"]
    }
  ]
};
var MockInterviewer = class {
  questions;
  currentIndex = 0;
  isCompleted = false;
  questionCallbacks = [];
  stateCallbacks = [];
  constructor(interviewType = "technical") {
    this.questions = DEFAULT_QUESTIONS[interviewType] || DEFAULT_QUESTIONS.technical;
  }
  async start() {
    this.currentIndex = 0;
    this.isCompleted = false;
    this.notifyListeners();
  }
  async submitCandidateResponse(_response) {
    if (this.isCompleted) return;
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.notifyListeners();
    } else {
      this.isCompleted = true;
      this.notifyListeners();
    }
  }
  async end() {
    this.isCompleted = true;
    this.notifyListeners();
  }
  onQuestionChange(callback) {
    this.questionCallbacks.push(callback);
  }
  onStateChange(callback) {
    this.stateCallbacks.push(callback);
  }
  getCurrentStep() {
    return this.questions[this.currentIndex];
  }
  getState() {
    const total = this.questions.length;
    const currentStepNum = Math.min(this.currentIndex + 1, total);
    const progressPercentage = Math.round(currentStepNum / total * 100);
    return {
      currentQuestionIndex: this.currentIndex,
      totalQuestions: total,
      currentQuestion: this.questions[this.currentIndex]?.question || "",
      progressPercentage: this.isCompleted ? 100 : progressPercentage,
      isCompleted: this.isCompleted
    };
  }
  notifyListeners() {
    const state = this.getState();
    this.questionCallbacks.forEach(
      (cb) => cb(state.currentQuestion, state.currentQuestionIndex, state.totalQuestions)
    );
    this.stateCallbacks.forEach((cb) => cb(state));
  }
};
var INTERVIEW_ENGINE_VERSION = "0.2.0-phase2";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  INTERVIEW_ENGINE_VERSION,
  MockInterviewer
});
