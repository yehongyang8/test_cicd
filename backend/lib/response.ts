/**
 * 统一响应处理
 */

/**
 * 标准响应格式
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  timestamp?: number;
}

/**
 * 分页响应格式
 */
export interface PageResponse<T = any> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 响应码枚举
 */
export enum ResponseCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

/**
 * 成功响应
 */
export function success<T>(data?: T, message = 'Success'): ApiResponse<T> {
  return {
    code: ResponseCode.SUCCESS,
    message,
    data,
    timestamp: Date.now(),
  };
}

/**
 * 错误响应
 */
export function error(
  code: ResponseCode,
  message: string,
  data?: any
): ApiResponse {
  return {
    code,
    message,
    data,
    timestamp: Date.now(),
  };
}

/**
 * 业务异常类
 */
export class BusinessError extends Error {
  constructor(
    public code: ResponseCode,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'BusinessError';
  }
}
