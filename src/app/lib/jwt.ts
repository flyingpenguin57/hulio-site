import * as jwt from 'jsonwebtoken';

// 用户声明接口
export interface UserClaims {
  username: string;
  userId: number;
  iat?: number;
  exp?: number;
  nbf?: number;
  iss?: string;
  sub?: string;
}

// RSA公钥常量
const RSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0rS0nswzzdvGy6/IJQHw
9u5RE756m7WnY/AQwR9+2JcQNgIb/CrVEEPDheiN4zte8v1R0lZNmuaZjKsoW+aB
P3l9o0IuFDHyjo2alGcK/5UoPl/hhgTS2ID2mCIfd9s2j3mP75kiCAP2Sgp/VzM6
Umlp20yMVM4qkcoy8wbjoAJdmkUYehT4XCuUiU5MhzZ+OQdo7oubQMSReDimRKpk
oN3Oo81dOt95l+ccGbqZ/7x9VjECWqneAzr3lbLxtQYUEC5189Tl7/9kiI3mnXL2
1sHAtKLdq3wq9XoSTOUOG9xsLpndpuE2fdlOG7DlmREVU0qrMP2yWyM6QKpFAru0
WQIDAQAB
-----END PUBLIC KEY-----`;

/**
 * 获取RSA公钥
 * @returns RSA公钥字符串
 */
function getRSAPublicKey(): string {
  return RSA_PUBLIC_KEY;
}

/**
 * 解析和验证JWT Token
 * @param tokenStr JWT Token字符串
 * @returns 解析后的用户声明
 */
export function parseToken(tokenStr: string): UserClaims {
  try {
    const publicKey = getRSAPublicKey();
    
    const decoded = jwt.verify(tokenStr, publicKey, {
      algorithms: ['RS256'],
      issuer: 'hulio-user-service',
      subject: 'user-token',
    }) as UserClaims;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error(`JWT验证失败: ${error.message}`);
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token已过期');
    } else if (error instanceof jwt.NotBeforeError) {
      throw new Error('Token尚未生效');
    } else {
      throw new Error(`Token解析失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * 验证Token是否有效
 * @param tokenStr JWT Token字符串
 * @returns 是否有效
 */
export function isTokenValid(tokenStr: string): boolean {
  try {
    parseToken(tokenStr);
    return true;
  } catch {
    return false;
  }
}

/**
 * 从Authorization头中提取Token
 * @param authHeader Authorization头内容
 * @returns 提取的Token字符串，如果未找到则返回null
 */
export function extractTokenFromHeader(authHeader: string): string | null {
  if (!authHeader) {
    return null;
  }

  // 支持 "Bearer token" 格式
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

// 导出类型和常量
export const JWT_ALGORITHM = 'RS256';
export const JWT_ISSUER = 'hulio-user-service';
export const JWT_SUBJECT = 'user-token';