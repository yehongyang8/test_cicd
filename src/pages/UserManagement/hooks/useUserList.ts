// 🎣 用户列表 Hook

import { useRequest } from 'ahooks'
import { userApi } from '@/servers'
import type { IPaginationParams } from '@/types'

/**
 * 使用用户列表
 */
export function useUserList(params: IPaginationParams) {
  const { data, loading, error, run, refresh } = useRequest(
    () => userApi.getUserList(params),
    {
      manual: false,
      onSuccess: (response) => {
        console.log('User list loaded:', response.data)
      },
      onError: (err) => {
        console.error('Failed to load user list:', err)
      },
    }
  )

  return {
    users: data?.data?.data?.data?.list || [],
    total: data?.data?.data?.data?.total || 0,
    loading,
    error,
    refresh,
    reload: run,
  }
}