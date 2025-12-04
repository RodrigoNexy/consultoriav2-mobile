import { apiClient } from '../../../shared/api/client';
import { LoginCredentials, LoginResponse, User } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  getMe: async () => {
    return apiClient.get<User>('/auth/me');
  },
};

