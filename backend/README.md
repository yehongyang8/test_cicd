# 模拟后端架构说明

## 📖 概述

本项目采用严格的分层架构，模拟真实后端开发模式，使用 TypeScript + sql.js + Zod 实现完整的后端功能。

## 🏗️ 核心分层

```
backend/
├── controllers/        # 控制器层 (Controllers)
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   └── schemas.ts      # Zod Schema 定义
├── services/           # 业务逻辑层 (Services)
│   ├── auth.service.ts
│   └── user.service.ts
├── db/                 # 数据访问层 (Data Access)
│   ├── schema/         # 数据库表结构定义
│   │   ├── user.ts
│   │   ├── role.ts
│   │   └── table_schema.ts
│   ├── crud.ts         # 通用 CRUD 封装
│   └── index.ts        # 数据库连接与事务配置
├── lib/                # 工具与库 (Library)
│   ├── request-context.ts  # 请求上下文管理
│   ├── response.ts     # 统一响应处理
│   └── logger.ts       # 日志工具
├── middleware/         # 中间件 (Middleware)
│   └── auth.middleware.ts
└── index.ts            # 后端入口
```

## 🔐 认证与授权

### 默认账号

- **管理员账号**: admin / 123456
- **普通用户**: user / 123456

### Token 机制

- 登录后生成 Token（简化版 JWT）
- Token 格式: `Bearer.{payload}.{random}`
- 通过请求上下文管理当前用户信息

## 📊 数据库设计

### 用户表 (users)

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | TEXT | 主键 |
| username | TEXT | 用户名（唯一） |
| password | TEXT | 密码（MD5加密） |
| realName | TEXT | 真实姓名 |
| email | TEXT | 邮箱 |
| phone | TEXT | 手机号 |
| avatar | TEXT | 头像URL |
| status | INTEGER | 状态（0-禁用，1-启用） |
| roleIds | TEXT | 角色ID列表（JSON数组） |
| createBy | TEXT | 创建人 |
| createTime | INTEGER | 创建时间（时间戳） |
| updateBy | TEXT | 更新人 |
| updateTime | INTEGER | 更新时间（时间戳） |
| deleteTime | INTEGER | 删除时间（软删除） |

### 角色表 (roles)

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | TEXT | 主键 |
| name | TEXT | 角色名称 |
| code | TEXT | 角色编码（唯一） |
| description | TEXT | 描述 |
| permissions | TEXT | 权限列表（JSON数组） |
| status | INTEGER | 状态（0-禁用，1-启用） |
| createBy | TEXT | 创建人 |
| createTime | INTEGER | 创建时间 |
| updateBy | TEXT | 更新人 |
| updateTime | INTEGER | 更新时间 |
| deleteTime | INTEGER | 删除时间（软删除） |

## 🔌 API 接口规范

### HTTP 方法约定

- **GET**: 查询操作
- **POST**: 创建、更新、删除操作

### 参数传递

- **GET 请求**: 使用 Query 参数
- **POST 请求**: 使用 Body (JSON)

### 接口列表

#### 认证相关

- `POST /api/auth/login` - 用户登录
- `GET /api/auth/userInfo` - 获取当前用户信息

#### 用户管理

- `GET /api/user/page` - 分页查询用户列表
- `GET /api/user/detail` - 获取用户详情
- `POST /api/user/save` - 创建用户
- `POST /api/user/update` - 更新用户
- `POST /api/user/delete` - 删除用户
- `POST /api/user/batchDelete` - 批量删除用户

### 统一响应格式

```typescript
{
  code: number,           // 状态码（200-成功，401-未授权，403-禁止，404-未找到，500-内部错误）
  message: string,        // 消息
  data?: any,             // 数据
  timestamp?: number      // 时间戳
}
```

## 🛠️ 核心特性

### 1. 软删除

所有业务表都包含 `deleteTime` 字段，删除操作不会真正删除数据，而是设置删除时间。

```typescript
// 软删除示例
await userCrud.delete(userId)
```

### 2. 审计字段

所有表都包含以下审计字段：

- `createBy`: 创建人
- `createTime`: 创建时间
- `updateBy`: 更新人
- `updateTime`: 更新时间

CRUD 操作会自动填充这些字段。

### 3. 请求上下文

使用请求上下文管理当前用户信息，Service 层可以通过 `getRequestUser()` 获取当前用户。

```typescript
import { getRequestUser } from '../lib/request-context'

// 在 Service 中获取当前用户
const currentUser = getRequestUser()
```

### 4. 类型安全

- 使用 Zod 进行请求参数校验
- 完整的 TypeScript 类型定义
- 从 Schema 推导类型

```typescript
// 定义 Schema
export const CreateUserDTO = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(50),
  realName: z.string().min(1).max(50),
  // ...
})

// 推导类型
export type CreateUserDTO = z.infer<typeof CreateUserDTO>
```

### 5. 事务支持

支持事务操作，确保数据一致性。

```typescript
import { runInTransaction } from '../db'

await runInTransaction(async (db) => {
  // 在事务中执行多个操作
  await createUser(data)
  await updateRole(roleData)
})
```

## 🚀 使用方式

### 前端集成

在 `/src/servers/client.ts` 中，使用自定义 Axios 适配器拦截请求，转发到模拟后端：

```typescript
import { mockBackend } from '../../backend'

const httpClient = axios.create({
  adapter: async (config) => {
    const token = config.headers?.Authorization
    
    let result
    if (config.method?.toLowerCase() === 'get') {
      result = await mockBackend.get(config.url || '', config.params, token)
    } else {
      result = await mockBackend.post(config.url || '', config.data, token)
    }
    
    return {
      data: result,
      status: 200,
      statusText: 'OK',
      headers: config.headers || {},
      config,
    }
  },
})
```

### API 调用示例

```typescript
// 登录
import { login } from '@/servers/auth'

const response = await login({
  username: 'admin',
  password: md5('123456')
})

// 获取用户列表
import { getUserList } from '@/pages/UserManagement/api'

const response = await getUserList({
  page: 1,
  pageSize: 10
})
```

## 📝 开发规范

### Controller 层

- 负责路由定义和参数校验
- 使用 Zod Schema 进行输入验证
- 调用 Service 层处理业务逻辑
- 返回统一格式的响应

### Service 层

- 负责核心业务逻辑
- 通过 CRUD 类操作数据库
- 保持纯粹，不依赖 HTTP 上下文
- 使用 BusinessError 抛出业务异常

### CRUD 层

- 封装通用的数据库操作
- 自动处理审计字段
- 支持软删除
- 支持分页查询

## 🔄 扩展方式

### 添加新的业务模块

1. 在 `db/schema/` 创建表结构定义
2. 在 `services/` 创建业务逻辑
3. 在 `controllers/` 创建控制器
4. 在 `backend/index.ts` 注册路由

### 示例：添加文章模块

```typescript
// 1. db/schema/article.ts
export interface ArticleEntity {
  id: string
  title: string
  content: string
  // ... 其他字段
  createBy: string
  createTime: number
  updateBy: string
  updateTime: number
  deleteTime?: number
}

// 2. services/article.service.ts
class ArticleServiceClass {
  private articleCrud = new BaseCrud<ArticleEntity>('articles')
  
  async getArticlePage(dto: QueryArticleDTO) {
    return this.articleCrud.findPage(dto, { orderBy: 'createTime' })
  }
  
  async createArticle(dto: CreateArticleDTO) {
    return this.articleCrud.create({ id: nanoid(), ...dto })
  }
}

export const ArticleService = new ArticleServiceClass()

// 3. controllers/article.controller.ts
export async function getArticlePage(data: any) {
  const validatedData = articlePageRequestSchema.parse(data)
  const result = await ArticleService.getArticlePage(validatedData)
  return success(result)
}

// 4. backend/index.ts - 注册路由
const routes = {
  // ... 其他路由
  'GET:/api/article/page': articleController.getArticlePage,
  'POST:/api/article/save': articleController.createArticle,
}
```

## 🔍 调试

启用调试日志：

```typescript
import { logger, LogLevel } from './lib/logger'

logger.setLevel(LogLevel.DEBUG)
```

查看数据库内容：

```typescript
import { getDatabase } from './db'

const db = getDatabase()
const stmt = db.prepare('SELECT * FROM users')
while (stmt.step()) {
  console.log(stmt.getAsObject())
}
stmt.free()
```

## 📚 技术栈

- **sql.js**: 浏览器内 SQLite 数据库
- **Zod**: 运行时类型校验
- **nanoid**: 生成唯一ID
- **crypto-js**: 加密工具（MD5）
