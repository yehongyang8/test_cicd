/**
 * 认证控制器
 */
import { AuthService, LoginDTO } from '../services/auth.service';
import { success, error, ResponseCode, BusinessError } from '../lib/response';
import { logger } from '../lib/logger';
import { loginRequestSchema } from './schemas';

/**
 * 用户登录
 */
export async function login(data: any) {
  try {
    // 参数校验
    const validatedData = loginRequestSchema.parse(data);

    // 调用服务
    const result = await AuthService.login(validatedData as LoginDTO);

    return success(result, '登录成功');
  } catch (err) {
    logger.error('Login error:', err);

    if (err instanceof BusinessError) {
      return error(err.code, err.message, err.data);
    }

    return error(ResponseCode.INTERNAL_ERROR, '登录失败');
  }
}

/**
 * 获取用户信息
 */
export async function getUserInfo(userId: string) {
  try {
    const result = await AuthService.getUserInfo(userId);
    return success(result, '获取成功');
  } catch (err) {
    logger.error('Get user info error:', err);

    if (err instanceof BusinessError) {
      return error(err.code, err.message, err.data);
    }

    return error(ResponseCode.INTERNAL_ERROR, '获取失败');
  }
}
