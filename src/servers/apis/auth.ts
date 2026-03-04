// 🔐 认证相关 API

import { httpClient } from '../client'
import type { TApiResponse } from '@/types'

/**
 * 登录请求参数
 */
export interface ILoginParams {
  username: string
  password: string
}

/**
 * 登录响应数据
 */
export interface ILoginResponse {
  user: {
    id: string
    username: string
    realName: string
    email?: string
    phone?: string
    avatar?: string
    status: number
    roleIds: string[]
    createTime: number
    updateTime: number
  }
  token: string
}

/**
 * 用户登录
 */
export function login(
  data: ILoginParams
): Promise<TApiResponse<ILoginResponse>> {
  return httpClient.post<TApiResponse<ILoginResponse>>('/api/auth/login', data)
}

/**
 * 获取用户信息
 */
export function getUserInfo(): Promise<
  TApiResponse<ILoginResponse['user']>
> {
  return httpClient.get<TApiResponse<ILoginResponse['user']>>(
    '/api/auth/userInfo'
  )
}
