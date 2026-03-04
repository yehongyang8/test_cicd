// 📦 根 Store，聚合所有子 Store

import { UserStore } from './UserStore'

export class RootStore {
  userStore: UserStore

  constructor() {
    this.userStore = new UserStore()
  }

  /**
   * 重置所有 Store
   */
  reset() {
    this.userStore = new UserStore()
  }
}
