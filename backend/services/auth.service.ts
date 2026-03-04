/**
 * 认证服务
 */
import { BaseCrud } from '../db/crud';
import { UserEntity, UserVO, toUserVO } from '../db/schema/user';
import { BusinessError, ResponseCode } from '../lib/response';
import { logger } from '../lib/logger';
import { nanoid } from 'nanoid';

/**
 * 登录 DTO
 */
export interface LoginDTO {
  username: string;
  password: string;
}

/**
 * 登录响应
 */
export interface LoginResponse {
  user: UserVO;
  token: string;
}

/**
 * 认证服务类
 */
class AuthServiceClass {
  private userCrud = new BaseCrud<UserEntity>('users');

  /**
   * 用户登录
   */
  async login(dto: LoginDTO): Promise<LoginResponse> {
    logger.info('User login attempt:', dto.username);

    // 查询用户
    const user = this.userCrud.findOne({ username: dto.username });

    if (!user) {
      logger.warn('User not found:', dto.username);
      throw new BusinessError(
        ResponseCode.UNAUTHORIZED,
        '用户名或密码错误'
      );
    }

    // 验证密码（这里使用 MD5，实际应使用更安全的加密方式）
    if (user.password !== dto.password) {
      logger.warn('Invalid password for user:', dto.username);
      throw new BusinessError(
        ResponseCode.UNAUTHORIZED,
        '用户名或密码错误'
      );
    }

    // 检查用户状态
    if (user.status !== 1) {
      logger.warn('User account is disabled:', dto.username);
      throw new BusinessError(
        ResponseCode.FORBIDDEN,
        '账号已被禁用'
      );
    }

    // 生成 token（简单模拟，实际应使用 JWT）
    const token = this.generateToken(user);

    logger.info('User login success:', dto.username);

    return {
      user: toUserVO(user),
      token,
    };
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(userId: string): Promise<UserVO> {
    const user = this.userCrud.findById(userId);

    if (!user) {
      throw new BusinessError(
        ResponseCode.NOT_FOUND,
        '用户不存在'
      );
    }

    return toUserVO(user);
  }

  /**
   * 生成 Token
   */
  private generateToken(user: UserEntity): string {
    // 简单模拟 token 生成，实际应使用 JWT
    const payload = {
      id: user.id,
      username: user.username,
      realName: user.realName,
      roleIds: user.roleIds,
    };
    return `Bearer.${btoa(JSON.stringify(payload))}.${nanoid()}`;
  }

  /**
   * 验证 Token
   */
  parseToken(token: string): UserVO | null {
    try {
      // 移除 Bearer 前缀
      const tokenStr = token.replace('Bearer ', '');
      const parts = tokenStr.split('.');
      
      if (parts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (error) {
      logger.error('Token parse error:', error);
      return null;
    }
  }
}

export const AuthService = new AuthServiceClass();
