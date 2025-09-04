import { NextRequest } from 'next/server';
import { authMiddleware } from './app/lib/authMiddleware';

export function middleware(request: NextRequest) {
  // 只对 API 路由应用认证中间件
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return authMiddleware(request);
  }
}

export const config = {
  matcher: '/api/:path*',
  runtime: 'nodejs', // 使用 Node.js runtime 而不是 Edge runtime
};
