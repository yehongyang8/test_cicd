// 📦 用户状态管理

import { makeAutoObservable, runInAction } from 'mobx'
import type { IUserInfo } from '@/types'
import { STORAGE_KEYS } from '@/constants'
import { authApi } from '@/servers'
import { md5 } from '@/utils/crypto'

export class UserStore {
  currentUser: IUserInfo | null = null
  isLoading = false
  token: string | null = null

  constructor() {
    makeAutoObservable(this)
    this.loadFromStorage()
  }

  /**
   * 计算属性：是否已登录
   */
  get isLoggedIn() {
    return this.currentUser !== null && this.token !== null
  }

  /**
   * 计算属性：是否为管理员
   */
  get isAdmin() {
    return this.currentUser?.roleIds?.includes('admin') || false
  }

  /**
   * 从本地存储加载用户信息
   */
  loadFromStorage() {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
      const userInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO)

      if (token && userInfo) {
        runInAction(() => {
          this.token = token
          this.currentUser = JSON.parse(userInfo)
        })
      }
    } catch (error) {
      console.error('Failed to load user info from storage:', error)
    }
  }

  /**
   * 设置用户信息
   */
  setUser(user: IUserInfo, token: string) {
    this.currentUser = user
    this.token = token

    // 保存到本地存储
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user))
  }

  /**
   * 登录
   */
  async login(username: string, password: string) {
    this.isLoading = true
    try {
      // 对密码进行 MD5 加密
      const encryptedPassword = md5(password)

      // 调用登录 API
      const response = await authApi.login({ username, password: encryptedPassword })

      if (response.data.code === 200 && response.data.data) {
        const { user, token } = response.data.data

        runInAction(() => {
          // 转换用户数据格式
          const userInfo: IUserInfo = {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            role: user.roleIds.includes('admin') ? 'admin' : 'user',
            roleIds: user.roleIds,
            realName: user.realName,
            phone: user.phone,
            status: user.status,
            createTime: user.createTime,
            updateTime: user.updateTime,
          }

          this.setUser(userInfo, token)
          this.isLoading = false
        })

        return { success: true }
      } else {
        runInAction(() => {
          this.isLoading = false
        })
        return { success: false, message: response.data.message || '登录失败' }
      }
    } catch (error) {
      runInAction(() => {
        this.isLoading = false
      })
      return { success: false, message: '登录失败，请稍后重试' }
    }
  }

  /**
   * 登出
   */
  logout() {
    this.currentUser = null
    this.token = null

    // 清除本地存储
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_INFO)
  }

  /**
   * 更新用户信息
   */
  updateUser(updates: Partial<IUserInfo>) {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updates }
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(this.currentUser))
    }
  }
}