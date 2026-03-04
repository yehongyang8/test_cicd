/* eslint-disable react-refresh/only-export-components */
// 🛣️ 路由表定义

import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import { MainLayout } from '@/components/Layout'
import { ROUTES } from '@/constants'

// 懒加载页面组件
const LoginPage = lazy(() => import('@/pages/Login'))
const DashboardPage = lazy(() => import('@/pages/Dashboard'))
const UserManagementPage = lazy(() => import('@/pages/UserManagement'))

/**
 * 路由守卫：检查是否已登录
 */
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('auth_token')

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <>{children}</>
}

/**
 * 路由配置
 */
export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.HOME,
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: ROUTES.USER_MANAGEMENT,
        element: <UserManagementPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
])