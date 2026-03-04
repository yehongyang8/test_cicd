// 🧩 布局组件

import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Layout as AntLayout, Menu, Dropdown, Avatar, Space, Button } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  GlobalOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useUserStore } from '@/stores'
import { menuConfig } from '@/routes/config'
import { ROUTES } from '@/constants'
import styled from 'styled-components'

const { Header, Sider, Content } = AntLayout

const StyledLayout = styled(AntLayout)`
  min-height: 100vh;
`

const StyledHeader = styled(Header)`
  background: var(--color-card);
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-elevation-sm);
  border-bottom: 1px solid var(--color-border);
`

const StyledSider = styled(Sider)`
  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
  }

  .ant-menu {
    border-right: none;
  }
`

const Logo = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  border-bottom: 1px solid var(--color-border);
`

const StyledContent = styled(Content)`
  background: var(--color-muted);
  overflow: auto;
`

const TriggerButton = styled(Button)`
  font-size: 18px;
  width: 64px;
  height: 64px;
  border: none;
`

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { t, i18n } = useTranslation()
  const userStore = useUserStore()

  const handleMenuClick = ({ key }: { key: string }) => {
    const menuItem = menuConfig.find((item) => item.key === key)
    if (menuItem?.path) {
      navigate(menuItem.path)
    }
  }

  const handleLogout = () => {
    userStore.logout()
    navigate(ROUTES.LOGIN)
  }

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('menu.profile', { ns: 'menu' }),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('button.logout'),
      onClick: handleLogout,
    },
  ]

  const languageMenuItems = [
    {
      key: 'zh-CN',
      label: '简体中文',
      onClick: () => handleLanguageChange('zh-CN'),
    },
    {
      key: 'en-US',
      label: 'English',
      onClick: () => handleLanguageChange('en-US'),
    },
  ]

  const selectedKey = menuConfig.find((item) => item.path === location.pathname)?.key || 'dashboard'

  return (
    <StyledLayout>
      <StyledSider trigger={null} collapsible collapsed={collapsed}>
        <Logo>{collapsed ? 'Admin' : '后台管理系统'}</Logo>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={menuConfig.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: t(item.label, { ns: 'menu' }),
          }))}
        />
      </StyledSider>

      <AntLayout>
        <StyledHeader>
          <TriggerButton
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />

          <Space size="large">
            <Dropdown menu={{ items: languageMenuItems }} placement="bottomRight">
              <Button type="text" icon={<GlobalOutlined />}>
                {i18n.language === 'zh-CN' ? '简体中文' : 'English'}
              </Button>
            </Dropdown>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  src={userStore.currentUser?.avatar}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <span>{userStore.currentUser?.username}</span>
              </Space>
            </Dropdown>
          </Space>
        </StyledHeader>

        <StyledContent>
          <Outlet />
        </StyledContent>
      </AntLayout>
    </StyledLayout>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default observer(MainLayout)