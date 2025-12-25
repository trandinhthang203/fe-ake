import apiClient from './apiClient';
import type { SessionResponse, SessionUpdate, SessionDetailResponse } from '../types/api';

export const sessionService = {
  /**
   * Get all sessions for current user
   */
  async getAllSessions(): Promise<SessionResponse[]> {
    const response = await apiClient.get<SessionResponse[]>('/session');
    return response.data;
  },

  /**
   * Get session details by ID
   */
  async getSessionDetails(sessionId: number): Promise<SessionDetailResponse> {
    const response = await apiClient.get<SessionDetailResponse>(`/session/${sessionId}`);
    return response.data;
  },

  /**
   * Create new session
   */
  async createSession(): Promise<SessionResponse> {
    const response = await apiClient.post<SessionResponse>('/session');
    return response.data;
  },

  /**
   * Update session
   */
  async updateSession(sessionId: number, sessionData: SessionUpdate): Promise<SessionResponse> {
    const response = await apiClient.patch<SessionResponse>(`/session/${sessionId}`, sessionData);
    return response.data;
  },

  /**
   * Delete session
   */
  async deleteSession(sessionId: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/session/${sessionId}`);
    return response.data;
  },
};
