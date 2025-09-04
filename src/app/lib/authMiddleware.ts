import { NextRequest, NextResponse } from 'next/server';
import { parseToken, extractTokenFromHeader } from './jwt';

/**
 * 认证中间件 - 拦截所有增删改操作
 */
export function authMiddleware(request: NextRequest): NextResponse | null {
  console.log('🔍 中间件被调用:', {
    method: request.method,
    pathname: request.nextUrl.pathname,
    hasAuthHeader: !!request.headers.get('authorization')
  });

  // 只拦截增删改操作
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    console.log('✅ 放行 GET 请求');
    return null; // 放行
  }

  try {
    // 从 Authorization 头中提取 token
    const authHeader = request.headers.get('authorization');
    console.log('📋 Authorization 头:', authHeader ? '存在' : '不存在');
    
    if (!authHeader) {
      console.log('❌ 缺少 Authorization 头');
      return NextResponse.json(
        { success: false, error: '缺少 Authorization 头' },
        { status: 401 }
      );
    }

    const token = extractTokenFromHeader(authHeader);
    console.log('🔑 Token 提取:', token ? '成功' : '失败');
    
    if (!token) {
      console.log('❌ 无效的 Authorization 头格式');
      return NextResponse.json(
        { success: false, error: '无效的 Authorization 头格式' },
        { status: 401 }
      );
    }

    // 使用 jwt.ts 中的方法验证 token
    console.log('🔐 开始验证 token...');
    const userClaims = parseToken(token);
    console.log('✅ Token 验证成功:', { username: userClaims.username, userId: userClaims.userId });
    
    // 验证通过，放行
    return null;

  } catch (error) {
    console.error('❌ Token 验证失败:', error);
    
    let errorMessage = 'Token 验证失败';
    if (error instanceof Error) {
      if (error.message.includes('过期')) {
        errorMessage = 'Token 已过期';
      } else if (error.message.includes('验证失败')) {
        errorMessage = 'Token 验证失败';
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 401 }
    );
  }
}
