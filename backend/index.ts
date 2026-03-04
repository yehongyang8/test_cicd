/**
 * 模拟后端入口
 * 提供类似于真实后端的 API 调用接口
 */
import { initDatabase } from './db';
import { logger } from './lib/logger';
import { error, ResponseCode } from './lib/response';
import { authMiddleware } from './middleware/auth.middleware';
import * as authController from './controllers/auth.controller';
import * as userController from './controllers/user.controller';
import { clearRequestContext } from './lib/request-context';
import { AuthService } from './services/auth.service'

/**
 * API 请求接口
 */
export interface ApiRequest {
  path: string;
  method: 'GET' | 'POST';
  data?: any;
  params?: any;
  token?: string;
}

/**
 * 路由映射表
 */
const routes: Record<string, any> = {
  // 认证相关
  'POST:/api/auth/login': authController.login,
  'GET:/api/auth/userInfo': (data: any, userId: string) => authController.getUserInfo(userId),

  // 用户相关
  'GET:/api/user/page': userController.getUserPage,
  'GET:/api/user/detail': userController.getUserDetail,
  'POST:/api/user/save': userController.createUser,
  'POST:/api/user/update': userController.updateUser,
  'POST:/api/user/delete': userController.deleteUser,
  'POST:/api/user/batchDelete': userController.batchDeleteUsers,
};

/**
 * 后端实例
 */
class MockBackend {
  private initialized = false;

  /**
   * 初始化
   */
  async init() {
    if (this.initialized) return;

    try {
      await initDatabase();
      this.initialized = true;
      logger.info('Mock backend initialized successfully');
    } catch (err) {
      logger.error('Failed to initialize mock backend:', err);
      throw err;
    }
  }

  /**
   * 处理请求
   */
  async request(req: ApiRequest): Promise<any> {
    // 确保已初始化
    if (!this.initialized) {
      await this.init();
    }

    const { path, method, data, params, token } = req;
    const routeKey = `${method}:${path}`;

    logger.info(`Request: ${routeKey}`, { data, params });

    try {
      // 认证中间件
      const isAuthed = authMiddleware(path, token);
      if (!isAuthed) {
        return error(ResponseCode.UNAUTHORIZED, '未授权或登录已过期');
      }

      // 查找路由处理器
      const handler = routes[routeKey];
      if (!handler) {
        logger.warn('Route not found:', routeKey);
        return error(ResponseCode.NOT_FOUND, '接口不存在');
      }

      // 合并请求数据
      const requestData = method === 'GET' ? params : data;

      // 执行处理器
      let result;
      if (path === '/api/auth/userInfo' && token) {
        // 特殊处理：从 token 中解析 userId
        const user = AuthService.parseToken(token);
        result = await handler(requestData, user?.id);
      } else {
        result = await handler(requestData);
      }

      logger.info(`Response: ${routeKey}`, result);

      return result;
    } catch (err) {
      logger.error('Request error:', err);
      return error(ResponseCode.INTERNAL_ERROR, '服务器内部错误');
    } finally {
      // 清除请求上下文
      clearRequestContext();
    }
  }

  /**
   * GET 请求
   */
  async get(path: string, params?: any, token?: string) {
    return this.request({ path, method: 'GET', params, token });
  }

  /**
   * POST 请求
   */
  async post(path: string, data?: any, token?: string) {
    return this.request({ path, method: 'POST', data, token });
  }
}

// 导出单例
export const mockBackend = new MockBackend();

// 自动初始化
mockBackend.init().catch(err => {
  logger.error('Auto-init failed:', err);
});
