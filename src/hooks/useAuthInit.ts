import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';

export const useAuthInit = () => {
  const { refreshUserInfo, isAuthenticated, token } = useUserStore();

  useEffect(() => {
    // 如果本地有 token 但没有用户信息，尝试刷新用户信息
    if (token && !isAuthenticated) {
      refreshUserInfo();
    }
  }, [token, isAuthenticated, refreshUserInfo]);
};
