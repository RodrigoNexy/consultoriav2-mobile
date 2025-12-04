import { changePasswordApi } from '../api/changePasswordApi';
import { ChangePasswordInput } from '../types';

export class ChangePasswordService {
  async changePassword(input: ChangePasswordInput): Promise<void> {
    const response = await changePasswordApi.changePassword(input);

    if (response.error) {
      throw new Error(response.error.error);
    }

    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Erro ao alterar senha');
    }
  }
}

export const changePasswordService = new ChangePasswordService();

