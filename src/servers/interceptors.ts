// 🌐 请求/响应拦截器

import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'antd'
import { STORAGE_KEYS } from '@/constants'

/**
 * 请求拦截器
 */
export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  // 添加 Token
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}

/**
 * 请求错误拦截器
 */
export const requestErrorInterceptor = (error: any) => {
  console.error('Request Error:', error)
  return Promise.reject(error)
}

/**
 * 响应拦截器
 */
export const responseInterceptor = (response: AxiosResponse) => {
  const { data, config } = response

  // 如果配置了跳过错误处理，直接返回
  if ((config as any).skipErrorHandler) {
    return response
  }

  // 处理业务错误
  if (data.code !== undefined && data.code !== 0 && data.code !== 200) {
    message.error(data.message || '请求失败')
    return Promise.reject(data)
  }

  return response
}

/**
 * 响应错误拦截器
 */
export const responseErrorInterceptor = (error: any) => {
  if (error.response) {
    const { status, data } = error.response

    switch (status) {
      case 401:
        message.error('未授权，请重新登录')
        // 清除 Token
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER_INFO)
        // 跳转到登录页
        window.location.href = '/login'
        break
      case 403:
        message.error('拒绝访问')
        break
      case 404:
        message.error('请求的资源不存在')
        break
      case 500:
        message.error('服务器错误')
        break
      default:
        message.error(data?.message || '请求失败')
    }
  } else if (error.request) {
    message.error('网络错误，请检查网络连接')
  } else {
    message.error('请求配置错误')
  }

  return Promise.reject(error)
}

/**
 * 设置拦截器
 */
export function setupInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use(requestInterceptor, requestErrorInterceptor)
  instance.interceptors.response.use(responseInterceptor, responseErrorInterceptor)
}