// 🎯 登录页面

import { observer } from 'mobx-react-lite'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useUserStore } from '@/stores'
import { ROUTES } from '@/constants'
import styled from 'styled-components'

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
`

const LoginCard = styled(Card)`
  width: 400px;
  box-shadow: var(--shadow-elevation-sm);
  border-radius: var(--radius-card);

  .ant-card-head {
    text-align: center;
    border-bottom: 1px solid var(--color-border);
  }

  .ant-card-head-title {
    font-size: var(--text-xl);
    font-weight: var(--font-weight-semibold);
  }
`

const LoginButton = styled(Button)`
  width: 100%;
  height: 40px;
  border-radius: var(--radius-button);
`

interface ILoginForm {
  username: string
  password: string
}

export default observer(function LoginPage() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const userStore = useUserStore()

  const handleSubmit = async (values: ILoginForm) => {
    const result = await userStore.login(values.username, values.password)

    if (result.success) {
      message.success(t('message.success'))
      navigate(ROUTES.DASHBOARD)
    } else {
      message.error(result.message || t('message.error'))
    }
  }

  return (
    <LoginContainer>
      <LoginCard title="后台管理系统">
        <Form form={form} onFinish={handleSubmit} autoComplete="off">
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: t('validation.required', { field: t('label.username') }),
              },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'var(--color-muted-foreground)' }} />}
              placeholder={t('placeholder.input', { field: t('label.username') })}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: t('validation.required', { field: t('label.password') }),
              },
              {
                min: 6,
                message: t('validation.password'),
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'var(--color-muted-foreground)' }} />}
              placeholder={t('placeholder.input', { field: t('label.password') })}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <LoginButton type="primary" htmlType="submit" loading={userStore.isLoading}>
              {t('button.login')}
            </LoginButton>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', color: 'var(--color-muted-foreground)', marginTop: '16px' }}>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>测试账号：admin / 123456</p>
        </div>
      </LoginCard>
    </LoginContainer>
  )
})