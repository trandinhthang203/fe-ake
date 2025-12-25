import apiClient from './apiClient';
import type { UserResponse, UserUpdate } from '../types/api';

export const userService = {
  /**
   * Get current user profile
   */
  async getMyProfile(): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>('/user/me');
    return response.data;
  },

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>(`/user/${email}`);
    return response.data;
  },

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<UserResponse[]> {
    const response = await apiClient.get<UserResponse[]>('/user');
    return response.data;
  },

  /**
   * Update current user profile
   */
  async updateProfile(userData: UserUpdate): Promise<UserResponse> {
    const response = await apiClient.patch<UserResponse>('/user', userData);
    return response.data;
  },

  /**
   * Delete user by email (admin only)
   */
  async deleteUser(email: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/user/${email}`);
    return response.data;
  },
};
