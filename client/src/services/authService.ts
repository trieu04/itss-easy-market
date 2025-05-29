import apiService from './api';

export interface LoginRequest {
  username: string; // email hoặc username
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    roles: string[];
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  avatar?: string;
  roles: string[];
  preferences?: {
    language: string;
    theme: string;
    notifications: boolean;
  };
}

class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/sign-in', data);
    
    // Lưu token và user info
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/sign-up', data);
    
    // Lưu token và user info
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return apiService.get<User>('/auth/me');
  }

  async changePassword(data: { oldPassword?: string; newPassword: string }): Promise<void> {
    await apiService.post('/auth/change-password', {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  }

  async requestPasswordReset(email: string): Promise<void> {
    await apiService.post('/auth/request-password-reset', { email });
  }

  async resetPasswordWithCode(data: { email: string; code: string; newPassword: string }): Promise<void> {
    await apiService.post('/auth/reset-password-with-code', data);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getStoredToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}

export const authService = new AuthService();
export default authService; 