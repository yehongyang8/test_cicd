// 🌐 用户相关 API

import { httpClient } from '../client'
import type { IUserInfo, IUserListParams, IUserListResponse } from '@/types'

/**
 * 获取用户列表
 */
export function getUserList(
  params: IUserListParams
): Promise<IUserListResponse> {
  return httpClient.get<IUserListResponse>('/api/user/list', { params })
}

/**
 * 创建用户
 */
export function createUser(data: {
  username: string
  email: string
  phone?: string
  status: number
  roleIds: string[]
}): Promise<IUserInfo> {
  return httpClient.post<IUserInfo>('/api/user/save', data)
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
}): Promise<IUserInfo> {
  return httpClient.post<IUserInfo>('/api/user/update', data)
}

/**
 * 删除用户
 */
export function deleteUser(id: string): Promise<void> {
  return httpClient.post<void>('/api/user/delete', { id })
}
