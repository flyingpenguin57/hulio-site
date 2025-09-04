import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/app/lib/types';
import { UserService, LoginRequest } from '@/services/userService';

interface UserState {
  // 状态
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 操作
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearError: () => void;
  updateUserInfo: (userData: Partial<User>) => Promise<void>;
  refreshUserInfo: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 登录
      login: async (credentials: LoginRequest) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await UserService.login(credentials);
          
          // 保存到 localStorage（UserService 已经处理了）
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // 更新状态
          set({
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : '登录失败',
          });
          throw error;
        }
      },

      // 登出
      logout: () => {
        UserService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // 设置用户信息
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      // 设置 token
      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
      },

      // 清除错误
      clearError: () => {
        set({ error: null });
      },

      // 更新用户信息
      updateUserInfo: async (userData: Partial<User>) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await UserService.updateUserInfo(userData);
          
          // 更新 localStorage
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // 更新状态
          set({
            user: response.data.user,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : '更新用户信息失败',
          });
          throw error;
        }
      },

      // 刷新用户信息
      refreshUserInfo: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await UserService.getUserInfo();
          
          // 更新 localStorage
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('token', response.data.token);
          
          // 更新状态
          set({
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : '获取用户信息失败',
          });
          // 如果获取用户信息失败，可能是 token 过期，清除状态
          if (error instanceof Error && error.message.includes('token')) {
            get().logout();
          }
        }
      },
    }),
    {
      name: 'user-storage', // localStorage 的 key
      storage: createJSONStorage(() => localStorage),
      // 只持久化必要的状态，不持久化 loading 和 error
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// 导出一些常用的选择器
export const useUser = () => useUserStore((state) => state.user);
export const useToken = () => useUserStore((state) => state.token);
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated);
export const useIsLoading = () => useUserStore((state) => state.isLoading);
export const useError = () => useUserStore((state) => state.error);
