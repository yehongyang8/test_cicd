// 🌐 API 通用类型

import type { AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * HTTP 客户端配置
 */
export interface IHttpClientConfig extends AxiosRequestConfig {
  skipAuth?: boolean
  skipErrorHandler?: boolean
}

/**
 * HTTP 响应
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IHttpResponse<T = any> extends AxiosResponse<T> {}

/**
 * 标准 API 响应格式
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
  timestamp?: number
}

/**
 * API 错误
 */
export interface IApiError {
  code: number
  message: string
  data?: any
}
