// 🎯 用户管理页面

import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useBoolean, useRequest } from 'ahooks'
import styled from 'styled-components'
import type { ColumnsType } from 'antd/es/table'
import type { IUserInfo } from '@/types'
import { userApi } from '@/servers'
import { md5 } from '@/utils/crypto'

const PageContainer = styled.div`
  padding: 24px;
`

const TableCard = styled(Card)`
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-elevation-sm);

  .ant-card-head {
    border-bottom: 1px solid var(--color-border);
  }

  .ant-card-head-title {
    font-size: var(--text-lg);
    font-weight: var(--font-weight-semibold);
  }
`

const ActionButton = styled(Button)`
  border-radius: var(--radius-button);
`

export default observer(function UserManagementPage() {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [visible, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false)
  const [editingUser, setEditingUser] = useState<IUserInfo | null>(null)
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 })

  // 获取用户列表
  const { data, loading, refresh } = useRequest(
    () => userApi.getUserList(pagination),
    {
      refreshDeps: [pagination],
      onSuccess: (response) => {
        console.log('User list loaded:', response.data)
      },
      onError: (err) => {
        console.error('Failed to load user list:', err)
        message.error('加载用户列表失败')
      },
    }
  )

  const dataSource = data?.data?.data?.list || []
  const total = data?.data?.data?.total || 0

  const handleAdd = () => {
    setEditingUser(null)
    form.resetFields()
    showModal()
  }

  const handleEdit = (record: IUserInfo) => {
    setEditingUser(record)
    form.setFieldsValue({
      username: record.username,
      realName: record.realName,
      email: record.email,
      phone: record.phone,
      status: record.status,
    })
    showModal()
  }

  const handleDelete = (record: IUserInfo) => {
    Modal.confirm({
      title: t('message.deleteConfirm'),
      onOk: async () => {
        try {
          const response = await userApi.deleteUser(record.id)
          if (response.data.code === 200) {
            message.success(t('message.success'))
            refresh()
          } else {
            message.error(response.data.message || '删除失败')
          }
        } catch (error) {
          console.error('Delete failed:', error)
          message.error('删除失败')
        }
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      if (editingUser) {
        // 更新
        const response = await userApi.updateUser({
          id: editingUser.id,
          ...values,
        })
        if (response.data.code === 200) {
          message.success(t('message.success'))
          hideModal()
          form.resetFields()
          refresh()
        } else {
          message.error(response.data.message || '更新失败')
        }
      } else {
        // 新增（需要密码）
        if (!values.password) {
          message.error('请输入密码')
          return
        }
        const response = await userApi.createUser({
          username: values.username,
          password: md5(values.password), // MD5 加密密码
          realName: values.realName,
          email: values.email,
          phone: values.phone,
          status: values.status || 1,
          roleIds: ['user'],
        })
        if (response.data.code === 200) {
          message.success(t('message.success'))
          hideModal()
          form.resetFields()
          refresh()
        } else {
          message.error(response.data.message || '创建失败')
        }
      }
    } catch (error) {
      console.error('Submit failed:', error)
      message.error('操作失败')
    }
  }

  const columns: ColumnsType<IUserInfo> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: t('label.username'),
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: t('label.email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        const statusConfig = {
          0: { text: '禁用', color: 'var(--color-muted-foreground)' },
          1: { text: '启用', color: 'var(--color-chart-4)' },
        }
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig[1]
        return (
          <Tag
            color={config.color}
            style={{ borderRadius: 'var(--radius-tag)' }}
          >
            {config.text}
          </Tag>
        )
      },
    },
    {
      title: t('label.operation'),
      key: 'operation',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {t('button.edit')}
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            {t('button.delete')}
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <PageContainer>
      <h2>{t('menu.userManagement', { ns: 'menu' })}</h2>

      <TableCard
        title={t('menu.userManagement', { ns: 'menu' })}
        extra={
          <ActionButton type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            {t('button.add')}
          </ActionButton>
        }
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="id"
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: total,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => {
              setPagination({ page, pageSize })
            },
          }}
        />
      </TableCard>

      <Modal
        title={editingUser ? t('button.edit') : t('button.add')}
        open={visible}
        onOk={handleSubmit}
        onCancel={hideModal}
        okText={t('button.confirm')}
        cancelText={t('button.cancel')}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label={t('label.username')}
            rules={[
              {
                required: true,
                message: t('validation.required', { field: t('label.username') }),
              },
            ]}
          >
            <Input placeholder={t('placeholder.input', { field: t('label.username') })} />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label={t('label.password')}
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
              <Input.Password placeholder={t('placeholder.input', { field: t('label.password') })} />
            </Form.Item>
          )}

          <Form.Item
            name="realName"
            label="姓名"
            rules={[
              {
                required: true,
                message: '请输入姓名',
              },
            ]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="email"
            label={t('label.email')}
            rules={[
              {
                type: 'email',
                message: t('validation.email'),
              },
            ]}
          >
            <Input placeholder={t('placeholder.input', { field: t('label.email') })} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            initialValue={1}
          >
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
})