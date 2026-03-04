// 📦 导出 Store Context 和 Hooks

import { createContext, useContext } from 'react'
import { RootStore } from './RootStore'

const rootStore = new RootStore()
const StoreContext = createContext<RootStore>(rootStore)

/**
 * 使用 Store
 */
export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within StoreProvider')
  }
  return context
}

/**
 * 使用 UserStore
 */
export const useUserStore = () => useStore().userStore

export const StoreProvider = StoreContext.Provider
export { rootStore }
