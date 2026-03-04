// 📝 全局类型定义

/**
 * API 响应类型
 */
export type TApiResponse<T = any> = {
  data: {
    code: number
    message: string
    data?: T
    timestamp?: number
  }
  code: number
  message: string
  success: boolean
}

/**
 * 分页参数
 */
export interface IPaginationParams {
  page?: number
  pageSize?: number
}

/**
 * 分页响应
 */
export interface IPaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * 用户列表查询参数
 */
export interface IUserListParams extends IPaginationParams {
  username?: string
  email?: string
  status?: number
}

/**
 * 用户列表响应
 */
export type IUserListResponse = TApiResponse<IPaginationResponse<IUserInfo>>

/**
 * 用户信息
 */
export interface IUserInfo {
  id: string
  username: string
  email?: string
  avatar?: string
  role: TUserRole
  roleIds?: string[]
  realName?: string
  phone?: string
  status?: number
  createTime?: number
  updateTime?: number
  createdAt?: string
}

/**
 * 用户角色
 */
export type TUserRole = 'admin' | 'user' | 'guest'

/**
 * 菜单项
 */
export interface IMenuItem {
  key: string
  label: string
  icon?: React.ReactNode
  path?: string
  children?: IMenuItem[]
}

/**
 * 表格列配置
 */
export interface ITableColumn<T = any> {
  key: string
  title: string
  dataIndex: keyof T
  width?: number | string
  fixed?: 'left' | 'right'
  render?: (value: any, record: T, index: number) => React.ReactNode
}