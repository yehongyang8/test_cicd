// 🌐 用户相关 API

import { httpClient } from '../client'
import type { AxiosResponse } from 'axios'
import type { IUserInfo, IUserListParams, IUserListResponse } from '@/types'
import type { ApiResponse } from '../types'

/**
 * 获取用户列表
 */
export function getUserList(
  params: IUserListParams
): Promise<AxiosResponse<IUserListResponse>> {
  return httpClient.get<IUserListResponse>('/api/user/list', { params })
}

/**
 * 创建用户
 */
export function createUser(data: {
  username: string
  password: string
  realName?: string
  email: string
  phone?: string
  status: number
  roleIds: string[]
}): Promise<AxiosResponse<ApiResponse<IUserInfo>>> {
  return httpClient.post<ApiResponse<IUserInfo>>('/api/user/save', data)
}

/**
 * 更新用户
 */
export function updateUser(data: {
  id: string
  username: string
  email: string
  phone?: string
  status: number
  roleIds: string[]
}): Promise<AxiosResponse<ApiResponse<IUserInfo>>> {
  return httpClient.post<ApiResponse<IUserInfo>>('/api/user/update', data)
}

/**
 * 删除用户
 */
export function deleteUser(id: string): Promise<AxiosResponse<ApiResponse>> {
  return httpClient.post<ApiResponse>('/api/user/delete', { id })
}
