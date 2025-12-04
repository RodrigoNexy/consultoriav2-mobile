import { authApi } from '../api/authApi';
import { StorageService } from '../../../shared/libs/StorageService';
import { LoginCredentials, User } from '../types';

export class AuthService {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string } | null> {
    const response = await authApi.login(credentials);

    if (response.error) {
      throw new Error(response.error.error);
    }

    if (!response.data) {
      throw new Error('Resposta inválida do servidor');
    }

    const { token, user: userData } = response.data;

    // Salvar token
    await StorageService.setToken(token);
    await StorageService.setUser(userData);

    // Buscar dados completos do usuário
    const meResponse = await authApi.getMe();
    if (meResponse.error || !meResponse.data) {
      // Se falhar, usar dados básicos do login
      return { user: userData as User, token };
    }

    await StorageService.setUser(meResponse.data);

    return {
      user: meResponse.data,
      token,
    };
  }

  async getCurrentUser(): Promise<User | null> {
    const response = await authApi.getMe();

    if (response.error) {
      return null;
    }

    if (response.data) {
      await StorageService.setUser(response.data);
      return response.data;
    }

    return null;
  }

  async logout(): Promise<void> {
    await StorageService.clear();
  }

  async checkAuth(): Promise<{ user: User | null; token: string | null }> {
    const token = await StorageService.getToken();
    const user = await StorageService.getUser<User>();

    if (!token || !user) {
      return { user: null, token: null };
    }

    // Validar token buscando dados atualizados
    const currentUser = await this.getCurrentUser();
    return {
      user: currentUser,
      token,
    };
  }
}

export const authService = new AuthService();

