import { User } from '@/app/lib/types';

const API_BASE = 'https://www.hulio88.xyz/user-service/api/v1/user';

export interface LoginRequest {
  username: string;
  password: string;
}



export interface LoginResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

export class UserService {
  // 用户登录
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result: LoginResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Login failed');
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }



  // 获取用户信息
  static async getUserInfo(): Promise<ApiResponse<{ token: string; user: User }>> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result: ApiResponse<{ token: string; user: User }> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to get user info');
      }
      
      return result;
    } catch (error) {
      console.error('Get user info error:', error);
      throw error;
    }
  }

  // 更新用户信息
  static async updateUserInfo(userData: Partial<User>): Promise<ApiResponse<{ token: string; user: User }>> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const result: ApiResponse<{ token: string; user: User }> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to update user info');
      }
      
      return result;
    } catch (error) {
      console.error('Update user info error:', error);
      throw error;
    }
  }

  // 删除用户
  static async deleteUser(): Promise<ApiResponse<null>> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result: ApiResponse<null> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete user');
      }
      
      return result;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  // 检查用户是否已登录
  static isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // 获取当前用户信息
  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  // 获取当前token
  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 登出
  static logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
