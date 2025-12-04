import { recoveryApi } from '../api/recoveryApi';
import { RecoveryLog, SaveRecoveryLogInput } from '../types';

export class RecoveryService {
  async getAll(): Promise<RecoveryLog[]> {
    const response = await recoveryApi.getAll();

    if (response.error) {
      throw new Error(response.error.error);
    }

    return response.data?.logs || [];
  }

  async create(data: SaveRecoveryLogInput): Promise<RecoveryLog> {
    const response = await recoveryApi.create(data);

    if (response.error) {
      throw new Error(response.error.error);
    }

    if (!response.data) {
      throw new Error('Erro ao criar registro de recuperação');
    }

    return response.data;
  }

  async delete(logId: string): Promise<void> {
    const response = await recoveryApi.delete(logId);

    if (response.error) {
      throw new Error(response.error.error);
    }
  }
}

export const recoveryService = new RecoveryService();

