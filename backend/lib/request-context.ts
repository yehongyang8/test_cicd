/**
 * 请求上下文管理（模拟 AsyncLocalStorage）
 */

/**
 * 当前用户信息
 */
export interface RequestUser {
  id: string;
  username: string;
  realName: string;
  roleIds: string[];
}

/**
 * 请求上下文
 */
interface RequestContext {
  user?: RequestUser;
}

// 全局上下文存储
let currentContext: RequestContext = {};

/**
 * 设置请求上下文
 */
export function setRequestContext(context: RequestContext) {
  currentContext = context;
}

/**
 * 获取请求上下文
 */
export function getRequestContext(): RequestContext {
  return currentContext;
}

/**
 * 获取当前用户
 */
export function getRequestUser(): RequestUser | undefined {
  return currentContext.user;
}

/**
 * 设置当前用户
 */
export function setRequestUser(user: RequestUser) {
  currentContext.user = user;
}

/**
 * 清除请求上下文
 */
export function clearRequestContext() {
  currentContext = {};
}
