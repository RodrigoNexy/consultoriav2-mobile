import { apiClient } from '../../../shared/api/client';
import { ChangePasswordInput, ChangePasswordResponse } from '../types';

export const changePasswordApi = {
  changePassword: async (data: ChangePasswordInput) => {
    return apiClient.post<ChangePasswordResponse>('/auth/change-password', data);
  },
};

