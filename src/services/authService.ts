import apiClient from './apiClient';
import type { UserLogin, UserToken, UserRegister, UserResponse } from '../types/api';

export const authService = {
  /**
   * Login user with email and password
   */
  async login(credentials: UserLogin): Promise<UserToken> {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await apiClient.post<UserToken>('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Register new user
   */
  async register(userData: UserRegister): Promise<UserResponse> {
    const response = await apiClient.post<UserResponse>('/auth/register', userData);
    return response.data;
  },
};
