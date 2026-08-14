import { CreateSessionDto, InterviewSession, RealtimeTokenResponse, ApiResponse } from '@ai-interviewer/shared';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class InterviewApiClient {
  private static async request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data: ApiResponse<T> = await res.json();

    if (!res.ok || !data.success) {
      const message = data.error?.message || `HTTP Request failed with status ${res.status}`;
      throw new Error(message);
    }

    return data.data as T;
  }

  public static async createSession(dto: CreateSessionDto): Promise<InterviewSession> {
    const response = await this.request<InterviewSession | { session: InterviewSession }>('/interviews', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return (response as { session?: InterviewSession }).session || (response as InterviewSession);
  }

  public static async getSession(id: string): Promise<InterviewSession> {
    const response = await this.request<InterviewSession | { session: InterviewSession }>(`/interviews/${id}`);
    return (response as { session?: InterviewSession }).session || (response as InterviewSession);
  }

  public static async startSession(id: string): Promise<InterviewSession> {
    const response = await this.request<InterviewSession | { session: InterviewSession }>(`/interviews/${id}/start`, {
      method: 'POST',
    });
    return (response as { session?: InterviewSession }).session || (response as InterviewSession);
  }

  public static async endSession(id: string): Promise<InterviewSession> {
    const response = await this.request<InterviewSession | { session: InterviewSession }>(`/interviews/${id}/end`, {
      method: 'POST',
    });
    return (response as { session?: InterviewSession }).session || (response as InterviewSession);
  }

  public static async getRealtimeToken(id: string): Promise<RealtimeTokenResponse> {
    return this.request<RealtimeTokenResponse>(`/interviews/${id}/realtime/token`, {
      method: 'POST',
    });
  }
}
