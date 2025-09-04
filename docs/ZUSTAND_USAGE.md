# Zustand 用户状态管理使用说明

## 概述

本项目使用 Zustand 来管理用户登录状态和用户信息。Zustand 是一个轻量级的状态管理库，提供了简单易用的 API。

## 安装

```bash
npm install zustand
```

## 核心文件

### 1. 用户状态 Store (`src/stores/userStore.ts`)

这是核心的状态管理文件，包含：

- **状态**：用户信息、token、认证状态、加载状态、错误信息
- **操作**：登录、登出、更新用户信息、刷新用户信息等

### 2. 认证初始化器 (`src/components/AuthInitializer.tsx`)

在应用启动时自动检查并恢复用户状态。

### 3. 受保护路由 (`src/components/ProtectedRoute.tsx`)

保护需要登录才能访问的页面。

## 使用方法

### 在组件中使用用户状态

```tsx
import { useUserStore } from '@/stores/userStore';

function MyComponent() {
  // 获取整个 store
  const { user, isAuthenticated, isLoading, error } = useUserStore();
  
  // 或者使用选择器（推荐，性能更好）
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;
  
  return <div>Welcome, {user?.nickname}!</div>;
}
```

### 使用预定义的选择器

```tsx
import { useUser, useIsAuthenticated, useIsLoading, useError } from '@/stores/userStore';

function MyComponent() {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useIsLoading();
  const error = useError();
  
  // ... 组件逻辑
}
```

### 执行操作

```tsx
import { useUserStore } from '@/stores/userStore';

function LoginForm() {
  const { login, isLoading, error, clearError } = useUserStore();
  
  const handleSubmit = async (credentials) => {
    try {
      await login(credentials);
      // 登录成功后的处理
    } catch (error) {
      // 错误已经在 store 中处理了
      console.error('Login failed:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* 表单内容 */}
    </form>
  );
}
```

## 主要功能

### 1. 用户登录

```tsx
const { login } = useUserStore();

await login({ username: 'user', password: 'pass' });
```

### 2. 用户登出

```tsx
const { logout } = useUserStore();

logout(); // 清除状态并重定向
```

### 3. 更新用户信息

```tsx
const { updateUserInfo } = useUserStore();

await updateUserInfo({ nickname: 'New Name' });
```

### 4. 刷新用户信息

```tsx
const { refreshUserInfo } = useUserStore();

await refreshUserInfo(); // 从服务器获取最新用户信息
```

## 状态持久化

用户状态会自动保存到 localStorage，包括：

- 用户信息
- 认证 token
- 认证状态

**注意**：加载状态和错误信息不会被持久化。

## 受保护路由

对于需要登录的页面，使用 `ProtectedRoute` 组件：

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Dashboard content</div>
    </ProtectedRoute>
  );
}
```

## 错误处理

所有异步操作都包含错误处理：

```tsx
const { error, clearError } = useUserStore();

// 显示错误
{error && (
  <div className="error-message">
    {error}
    <button onClick={clearError}>Dismiss</button>
  </div>
)}

// 清除错误
clearError();
```

## 最佳实践

1. **使用选择器**：优先使用预定义的选择器而不是整个 store
2. **错误处理**：总是处理异步操作的错误
3. **加载状态**：在异步操作期间显示加载状态
4. **状态检查**：在访问用户信息前检查认证状态

## 示例组件

参考 `src/components/UserProfile.tsx` 了解完整的使用示例。

## 故障排除

### 常见问题

1. **状态不同步**：确保使用 `useUserStore` hook 而不是直接导入 store
2. **登录状态丢失**：检查 localStorage 是否被清除
3. **API 调用失败**：检查网络请求和 token 有效性

### 调试

在开发环境中，可以在浏览器控制台查看 store 状态：

```tsx
// 在组件中
const store = useUserStore.getState();
console.log('Current store state:', store);
```
