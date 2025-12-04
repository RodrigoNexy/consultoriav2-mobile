import { checkinsApi } from '../api/checkinsApi';
import { CheckIn, CreateCheckInInput } from '../types';

export class CheckInsService {
  async getAll(limit?: number, offset?: number): Promise<CheckIn[]> {
    const response = await checkinsApi.getAll(limit, offset);

    if (response.error) {
      throw new Error(response.error.error);
    }

    return response.data?.checkIns || [];
  }

  async create(input: CreateCheckInInput): Promise<CheckIn> {
    const response = await checkinsApi.create(input);

    if (response.error) {
      throw new Error(response.error.error);
    }

    if (!response.data) {
      throw new Error('Resposta inválida do servidor');
    }

    return response.data;
  }
}

export const checkinsService = new CheckInsService();

