import apiClient from './apiClient';
import type { ChatRequest, ChatResponse, HealthResponse, FeedbackRequest } from '../types/api';

export const chatService = {
  /**
   * Send a message to the chat API
   */
  async sendMessage(
    query: string,
    sessionId: number,
    useCache: boolean = false
  ): Promise<ChatResponse> {
    const payload: ChatRequest = {
      query,
      session_id: sessionId,
      use_cache: useCache,
    };

    const response = await apiClient.post<ChatResponse>('/chat', payload);
    return response.data;
  },

  /**
   * Send user feedback to continue conversation
   */
  async sendFeedback(
    sessionId: number,
    userFeedback?: string
  ): Promise<ChatResponse> {
    const payload: FeedbackRequest = {
      session_id: sessionId,
      user_feedback: userFeedback,
    };

    const response = await apiClient.post<ChatResponse>('/chat/feedback', payload);
    return response.data;
  },

  /**
   * Check API health status
   */
  async healthCheck(): Promise<HealthResponse> {
    const response = await apiClient.get<HealthResponse>('/chat');
    return response.data;
  },
};
