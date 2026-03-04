/**
 * 认证中间件
 */
import { AuthService } from '../services/auth.service';
import { setRequestUser } from '../lib/request-context';
import { logger } from '../lib/logger';

/**
 * 不需要认证的路径
 */
const WHITE_LIST = ['/api/auth/login'];

/**
 * 认证中间件
 */
export function authMiddleware(path: string, token?: string): boolean {
  // 白名单路径直接放行
  if (WHITE_LIST.includes(path)) {
    return true;
  }

  // 检查 token
  if (!token) {
    logger.warn('Missing token for path:', path);
    return false;
  }

  // 验证 token
  const user = AuthService.parseToken(token);
  if (!user) {
    logger.warn('Invalid token for path:', path);
    return false;
  }

  // 设置当前用户到请求上下文
  setRequestUser({
    id: user.id,
    username: user.username,
    realName: user.realName,
    roleIds: user.roleIds,
  });

  return true;
}
