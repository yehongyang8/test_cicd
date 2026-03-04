// 🔒 全局常量与枚举

/**
 * API 基础地址
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com'

/**
 * 分页默认配置
 */
export const PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = ['10', '20', '50', '100']

/**
 * 本地存储键名
 */
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  LANGUAGE: 'language',
  THEME: 'theme',
} as const

/**
 * 用户角色
 */
export const USER_ROLE = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const

/**
 * 路由路径
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USER_MANAGEMENT: '/user-management',
  NOT_FOUND: '/404',
} as const

/**
 * 请求超时时间（毫秒）
 */
export const REQUEST_TIMEOUT = 30000

/**
 * Token 过期时间（毫秒）
 */
export const TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000 // 7天
