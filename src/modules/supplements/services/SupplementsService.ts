import { supplementsApi } from '../api/supplementsApi';
import { SupplementPlan } from '../types';

export class SupplementsService {
  async getAll(): Promise<SupplementPlan[]> {
    const response = await supplementsApi.getAll();

    if (response.error) {
      throw new Error(response.error.error);
    }

    return response.data?.plans || [];
  }
}

export const supplementsService = new SupplementsService();

