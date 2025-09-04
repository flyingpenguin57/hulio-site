'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';

export const AuthInitializer = () => {
  const { refreshUserInfo, token, isAuthenticated } = useUserStore();

  useEffect(() => {
    // 如果本地有 token 但没有用户信息，尝试刷新用户信息
    if (token && !isAuthenticated) {
      refreshUserInfo();
    }
  }, [token, isAuthenticated, refreshUserInfo]);

  // 这个组件不渲染任何内容，只负责初始化
  return null;
};
