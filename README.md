# 后台管理系统

基于 React + TypeScript + Vite + Ant Design + MobX + React Router 构建的标准后台管理系统。

## 📦 技术栈

| 技术领域       | 技术选型                       |
| -------------- | ------------------------------ |
| **运行时框架** | React + TypeScript             |
| **构建工具**   | Vite                           |
| **路由管理**   | React Router                   |
| **UI 框架**    | Ant Design + styled-components |
| **状态管理**   | MobX + mobx-react-lite         |
| **国际化**     | react-i18next + i18next        |
| **工具 Hooks** | ahooks                         |

## 📁 目录结构

```
/src/
├── App.tsx               # 应用入口组件
├── main.tsx              # 应用启动入口
├── types.ts              # 全局类型定义
├── constants.ts          # 全局常量与枚举
├── components/           # 全局复用组件
│   ├── Layout/           # 布局组件
│   │   └── index.tsx
│   └── index.ts          # 统一导出
├── pages/                # 页面模块（按业务领域划分）
│   ├── Login/            # 登录页面
│   │   └── index.tsx
│   ├── Dashboard/        # 工作台页面
│   │   └── index.tsx
│   └── UserManagement/   # 用户管理页面
│       ├── index.tsx
│       └── hooks/        # 模块 Hooks
│           └── useUserList.ts
├── hooks/                # 全局可复用 Hooks
│   └── index.ts
├── stores/               # MobX Store（全局状态）
│   ├── RootStore.ts      # 根 Store
│   ├── UserStore.ts      # 用户状态
│   └── index.ts          # 导出 Context 和 Hooks
├── locales/              # 国际化资源
│   ├── zh-CN/            # 中文简体
│   │   ├── common.json
│   │   └── menu.json
│   ├── en-US/            # 英文
│   │   ├── common.json
│   │   └── menu.json
│   └── index.ts          # i18n 配置入口
├── servers/              # 服务层（API 调用）
│   ├── client.ts         # HTTP 客户端配置
│   ├── interceptors.ts   # 请求/响应拦截器
│   ├── types.ts          # API 通用类型
│   ├── apis/             # API 接口
│   │   ├── auth.ts       # 认证相关 API
│   │   └── user.ts       # 用户相关 API
│   └── index.ts          # 导出 API 客户端
├── routes/               # 路由配置
│   ├── index.tsx         # 路由表定义
│   └── config.tsx        # 路由配置常量
├── utils/                # 工具函数
│   ├── crypto.ts         # 加密工具
│   └── index.ts          # 统一导出
└── styles/               # 样式文件
    ├── index.css         # 全局样式
    ├── fonts.css         # 字体样式
    ├── theme.css         # 主题变量
    └── tailwind.css      # Tailwind CSS
```

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

## 📖 核心功能

### 1. 用户认证

- ✅ 用户登录（使用 MD5 加密密码）
- ✅ 登录状态持久化（localStorage）
- ✅ 路由守卫（未登录自动跳转到登录页）
- ✅ 自动刷新用户信息

### 2. 用户管理

- ✅ 用户列表查询（支持分页）
- ✅ 新增用户
- ✅ 编辑用户
- ✅ 删除用户
- ✅ 用户状态管理

### 3. 国际化

- ✅ 支持中英文切换
- ✅ Ant Design 组件国际化
- ✅ 翻译文件模块化管理

### 4. 状态管理

- ✅ 使用 MobX 管理全局状态
- ✅ 用户状态（登录、登出、更新）
- ✅ 响应式状态更新

### 5. 后端系统

项目包含完整的模拟后端系统（基于 TypeScript + Drizzle ORM + SQLite）：

```
/backend/
├── controllers/          # 控制器层
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   └── schemas.ts        # Zod Schema 定义
├── services/             # 业务逻辑层
│   ├── auth.service.ts
│   └── user.service.ts
├── db/                   # 数据访问层
│   ├── index.ts          # 数据库连接
│   ├── crud.ts           # 通用 CRUD
│   └── schema/           # 数据库表结构
│       ├── user.ts
│       ├── role.ts
│       └── table_schema.ts
├── lib/                  # 工具与库
│   ├── request-context.ts
│   ├── response.ts
│   └── logger.ts
└── middleware/           # 中间件
    └── auth.middleware.ts
```

## 🧩 核心规范

### 命名规范

- **目录命名**：特性模块使用 `PascalCase`，通用目录使用 `kebab-case`
- **文件命名**：
  - 页面/组件入口：`index.tsx`
  - 类型定义：`types.ts`
  - Hook：`useXxx.ts`
  - 工具函数：`xxxUtils.ts`
  - API 服务：`xxx.ts`

### 导出规范

- **页面组件**：使用 `export default`（路由懒加载需要）
- **复用组件**：使用 `export function`（避免重命名混乱）
- **工具函数**：使用 `export const`（支持按需引入）
- **类型定义**：使用 `export type`（TypeScript 最佳实践）

### API 调用规范

所有 API 调用都通过 `/src/servers/apis/` 目录管理：

```typescript
// ✅ 正确 - 使用统一的 API 导出
import { userApi } from '@/servers'

const users = await userApi.getUserList(params)

// ❌ 错误 - 不要直接使用 httpClient
import { httpClient } from '@/servers'
const response = await httpClient.get('/api/user/list')
```

## 🎨 样式规范

### 基础组件

优先使用 Ant Design 组件

### 样式定制

使用 styled-components 定制样式：

```tsx
import styled from 'styled-components'

const StyledCard = styled(Card)`
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-elevation-sm);
`
```

### 主题变量

使用 CSS 变量定义主题：

```css
:root {
  --color-primary: rgba(33, 29, 112, 1);
  --color-success: rgba(6, 191, 156, 1);
  --radius-card: 8px;
  --shadow-elevation-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

## 📱 测试账号

- 用户名：`admin`
- 密码：`123456`

## 📝 开发注意事项

1. **类型安全**：所有 API、组件、Hook 都有 TypeScript 类型
2. **国际化**：新增文案需要在 `locales/` 目录添加翻译
3. **状态管理**：使用 MobX 管理全局状态，组件用 `observer` 包裹
4. **API 调用**：统一使用 `/src/servers/apis/` 中的 API 函数
5. **代码规范**：遵循 Guidelines.md 中的架构规范

## 🔗 相关文档

- [前端架构规范](./guidelines/Guidelines.md)
- [React 官方文档](https://react.dev/)
- [Ant Design 官方文档](https://ant.design/)
- [MobX 官方文档](https://mobx.js.org/)
- [React Router 官方文档](https://reactrouter.com/)
