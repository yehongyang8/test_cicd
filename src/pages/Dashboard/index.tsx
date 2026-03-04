// 🎯 工作台页面

import { observer } from 'mobx-react-lite'
import { Card, Row, Col, Statistic, Table } from 'antd'
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useMount } from 'ahooks'
import styled from 'styled-components'
import type { ColumnsType } from 'antd/es/table'

const PageContainer = styled.div`
  padding: 24px;
`

const StatsCard = styled(Card)`
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-elevation-sm);
  
  .ant-card-body {
    padding: 24px;
  }

  .ant-statistic-title {
    color: var(--color-muted-foreground);
    font-size: var(--text-sm);
  }

  .ant-statistic-content {
    color: var(--color-foreground);
  }
`

const TableCard = styled(Card)`
  margin-top: 24px;
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

interface IRecentActivity {
  key: string
  user: string
  action: string
  time: string
  status: 'success' | 'warning' | 'error'
}

export default observer(function DashboardPage() {
  const { t } = useTranslation()

  useMount(() => {
    console.log('Dashboard mounted')
  })

  const statsData = [
    {
      title: '总用户数',
      value: 1234,
      icon: <UserOutlined style={{ fontSize: 24, color: 'var(--color-chart-1)' }} />,
      prefix: <RiseOutlined />,
      suffix: '%',
      precision: 2,
      valueStyle: { color: 'var(--color-chart-2)' },
    },
    {
      title: '总订单数',
      value: 5678,
      icon: <ShoppingCartOutlined style={{ fontSize: 24, color: 'var(--color-chart-3)' }} />,
      prefix: <RiseOutlined />,
      suffix: '%',
      precision: 2,
      valueStyle: { color: 'var(--color-chart-2)' },
    },
    {
      title: '总收入',
      value: 98765,
      icon: <DollarOutlined style={{ fontSize: 24, color: 'var(--color-chart-2)' }} />,
      prefix: '¥',
      precision: 2,
    },
    {
      title: '本月增长',
      value: 12.5,
      icon: <RiseOutlined style={{ fontSize: 24, color: 'var(--color-chart-4)' }} />,
      suffix: '%',
      precision: 1,
      valueStyle: { color: 'var(--color-chart-2)' },
    },
  ]

  const activityData: IRecentActivity[] = [
    {
      key: '1',
      user: '张三',
      action: '创建了新用户',
      time: '2026-02-05 10:30:00',
      status: 'success',
    },
    {
      key: '2',
      user: '李四',
      action: '修改了系统设置',
      time: '2026-02-05 09:15:00',
      status: 'warning',
    },
    {
      key: '3',
      user: '王五',
      action: '删除了订单',
      time: '2026-02-05 08:45:00',
      status: 'error',
    },
    {
      key: '4',
      user: '赵六',
      action: '导出了数据报表',
      time: '2026-02-04 16:20:00',
      status: 'success',
    },
  ]

  const columns: ColumnsType<IRecentActivity> = [
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          success: { text: '成功', color: 'var(--color-chart-2)' },
          warning: { text: '警告', color: 'var(--color-chart-3)' },
          error: { text: '失败', color: 'var(--color-chart-4)' },
        }
        const config = statusConfig[status as keyof typeof statusConfig]
        return <span style={{ color: config.color }}>{config.text}</span>
      },
    },
  ]

  return (
    <PageContainer>
      <h2>工作台</h2>

      <Row gutter={[16, 16]}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatsCard>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                precision={stat.precision}
                valueStyle={stat.valueStyle}
              />
              <div style={{ marginTop: 16 }}>{stat.icon}</div>
            </StatsCard>
          </Col>
        ))}
      </Row>

      <TableCard title="最近活动">
        <Table columns={columns} dataSource={activityData} pagination={false} />
      </TableCard>
    </PageContainer>
  )
})
