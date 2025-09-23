import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/user/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/user/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/user/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  async getCurrentUser() {
    const response = await api.get('/user/current-user');
    return response.data;
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/user/refresh-token', { refreshToken });
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },
};