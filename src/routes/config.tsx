// 🛣️ 路由配置常量

import type { IMenuItem } from '@/types'
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons'

/**
 * 菜单配置
 */
export const menuConfig: IMenuItem[] = [
  {
    key: 'dashboard',
    label: 'menu.dashboard',
    icon: <DashboardOutlined />,
    path: '/dashboard',
  },
  {
    key: 'userManagement',
    label: 'menu.userManagement',
    icon: <UserOutlined />,
    path: '/user-management',
  },
  {
    key: 'system',
    label: 'menu.system',
    icon: <SettingOutlined />,
    path: '/system',
  },
]
