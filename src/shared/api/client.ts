import { API_CONFIG } from '../config/api';
import { StorageService } from '../libs/StorageService';
import { ApiError, ApiResponse } from '../types';

class ApiClient {
  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await StorageService.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

      const fetchOptions: RequestInit = {
        ...options,
        method: options.method || 'GET',
        headers,
        signal: controller.signal,
      };

      const response = await fetch(`${API_CONFIG.baseURL}${url}`, fetchOptions);

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          await StorageService.clear();
        }

        const errorData = await response.json().catch(() => ({}));
        return {
          error: {
            error: errorData.error || 'Erro na requisição',
            status: response.status,
          },
        };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
          return {
            error: {
              error: 'Tempo de requisição excedido. Verifique se o servidor está rodando.',
            },
          };
        }

        // Erros de rede
        if (
          error.message.includes('Network') ||
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError')
        ) {
          return {
            error: {
              error: `Erro de conexão. Verifique se o servidor está rodando em ${API_CONFIG.baseURL}`,
            },
          };
        }

        return {
          error: {
            error: error.message || 'Erro desconhecido',
          },
        };
      }
      return {
        error: {
          error: 'Erro desconhecido',
        },
      };
    }
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
