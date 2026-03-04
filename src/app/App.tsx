// 🚀 应用入口组件

import { Suspense } from 'react'
import { RouterProvider } from 'react-router'
import { ConfigProvider, App as AntApp, Spin } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'
import { useTranslation } from 'react-i18next'
import { StoreProvider, rootStore } from '@/stores'
import { router } from '@/routes'
import '@/locales' // 初始化 i18n
import '@/styles/index.css' // 导入全局样式

// Ant Design 语言包映射
const antdLocales: Record<string, any> = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

function AppContent() {
  const { i18n } = useTranslation()

  return (
    <ConfigProvider
      locale={antdLocales[i18n.language] || zhCN}
      theme={{
        token: {
          colorPrimary: 'rgba(33, 29, 112, 1)',
          colorSuccess: 'rgba(6, 191, 156, 1)',
          colorWarning: 'rgba(250, 173, 20, 1)',
          colorError: 'rgba(255, 77, 79, 1)',
          colorInfo: 'rgba(33, 29, 112, 1)',
          borderRadius: 6,
          fontSize: 14,
        },
        components: {
          Button: {
            borderRadius: 6,
          },
          Card: {
            borderRadius: 6,
          },
          Input: {
            borderRadius: 6,
          },
        },
      }}
    >
      <AntApp>
        <Suspense
          fallback={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: 'var(--color-background)',
              }}
            >
              <Spin size="large" />
            </div>
          }
        >
          <RouterProvider router={router} />
        </Suspense>
      </AntApp>
    </ConfigProvider>
  )
}

export default function App() {
  return (
    <StoreProvider value={rootStore}>
      <AppContent />
    </StoreProvider>
  )
}