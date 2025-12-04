export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    type: string;
    requiresPasswordReset: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  type: string;
  requiresPasswordReset: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

