# 项目结构调整说明

## ✅ 已完成的调整

### 1. 主要文件移动

- ✅ 将 `/src/app/App.tsx` 移动到 `/src/App.tsx`（符合规范要求）
- ✅ 更新 `/src/main.tsx` 中的导入路径

### 2. API 层重构

根据 Guidelines.md 规范，将 API 调用整理到 `/src/servers/apis/` 目录：

```
/src/servers/
├── client.ts              # HTTP 客户端配置
├── interceptors.ts        # 请求/响应拦截器
├── types.ts               # API 通用类型
├── apis/                  # 📁 新增 API 目录
│   ├── auth.ts            # 认证相关 API
│   └── user.ts            # 用户相关 API
└── index.ts               # 统一导出所有 API
```

#### API 导出方式

```typescript
// /src/servers/index.ts
export { httpClient } from './client'
export * as authApi from './apis/auth'
export * as userApi from './apis/user'
```

#### 使用方式

```typescript
// ✅ 正确 - 使用命名空间导入
import { authApi, userApi } from '@/servers'

const loginResult = await authApi.login(data)
const users = await userApi.getUserList(params)

// ❌ 错误 - 不要直接使用 httpClient
import { httpClient } from '@/servers'
const response = await httpClient.get('/api/user/list')
```

### 3. 类型定义完善

在 `/src/types.ts` 中新增：

- `IUserListParams` - 用户列表查询参数
- `IUserListResponse` - 用户列表响应类型

### 4. 组件更新

- ✅ 更新 `UserStore.ts`：使用 `authApi.login` 替代旧的 `login` 导入
- ✅ 更新 `UserManagement/index.tsx`：使用 `userApi` 替代页面内的 API 导入
- ✅ 更新 `UserManagement/hooks/useUserList.ts`：使用 `userApi.getUserList`
- ✅ 删除 `UserManagement/api.ts`（已迁移到 `/src/servers/apis/user.ts`）
- ✅ 删除 `/src/servers/auth.ts`（已迁移到 `/src/servers/apis/auth.ts`）

## 📁 当前目录结构

```
/src/
├── App.tsx                  # ✅ 应用入口组件（已移动）
├── main.tsx                 # ✅ 应用启动入口（已更新导入）
├── types.ts                 # ✅ 全局类型定义（已完善）
├── constants.ts             # 全局常量
├── components/              # 全局复用组件
│   ├── Layout/
│   └── index.ts
├── pages/                   # 页面模块
│   ├── Login/
│   ├── Dashboard/
│   └── UserManagement/      # ✅ 已更新 API 调用
│       ├── index.tsx
│       └── hooks/
│           └── useUserList.ts
├── hooks/                   # 全局 Hooks
├── stores/                  # ✅ MobX Store（已更新）
│   ├── RootStore.ts
│   ├── UserStore.ts
│   └── index.ts
├── locales/                 # 国际化资源
│   ├── zh-CN/
│   ├── en-US/
│   └── index.ts
├── servers/                 # ✅ 服务层（已重构）
│   ├── client.ts
│   ├── interceptors.ts
│   ├── types.ts
│   ├── apis/                # ✅ 新增 API 目录
│   │   ├── auth.ts
│   │   └── user.ts
│   └── index.ts             # ✅ 统一导出
├── routes/                  # 路由配置
├── utils/                   # 工具函数
└── styles/                  # 样式文件
```

## 🎯 符合规范的要点

### 1. 目录结构

✅ 符合 Guidelines.md 中的标准目录结构：
- `/src/App.tsx` - 应用入口组件
- `/src/main.tsx` - 应用启动入口
- `/src/types.ts` - 全局类型定义
- `/src/constants.ts` - 全局常量
- `/src/components/` - 全局复用组件
- `/src/pages/` - 页面模块
- `/src/stores/` - MobX Store
- `/src/locales/` - 国际化资源
- `/src/servers/` - 服务层（API 调用）
- `/src/routes/` - 路由配置
- `/src/hooks/` - 全局 Hooks
- `/src/utils/` - 工具函数

### 2. API 调用规范

✅ 所有 API 调用统一管理：
- API 定义在 `/src/servers/apis/` 目录
- 通过 `/src/servers/index.ts` 统一导出
- 使用命名空间导入（`authApi`、`userApi`）

### 3. 命名规范

✅ 符合规范的命名：
- 页面目录：PascalCase（`UserManagement`、`Dashboard`）
- 组件目录：PascalCase（`Layout`）
- 通用目录：kebab-case（`hooks`、`utils`、`components`）
- Hook 文件：`useXxx.ts`（`useUserList.ts`）
- API 文件：`xxx.ts`（`auth.ts`、`user.ts`）

### 4. 导出规范

✅ 符合规范的导出：
- 页面组件：`export default`
- 复用组件：`export function`
- API 函数：`export function`
- 类型定义：`export type`/`export interface`

### 5. 技术栈

✅ 使用规范要求的技术栈：
- React + TypeScript ✅
- Vite ✅
- React Router ✅
- Ant Design ✅
- styled-components ✅
- MobX + mobx-react-lite ✅
- react-i18next + i18next ✅
- ahooks ✅

## 🚀 后续建议

虽然项目已经基本符合 Guidelines.md 规范，但还可以进一步完善：

### 1. 组件结构完善

建议为每个全局复用组件创建独立目录：

```
/src/components/
├── Layout/
│   ├── index.tsx
│   ├── types.ts
│   ├── styles.ts
│   └── constants.ts
└── index.ts
```

### 2. 页面结构完善

为复杂页面添加完整的目录结构：

```
/src/pages/UserManagement/
├── index.tsx          # 页面入口
├── types.ts           # 页面类型
├── constants.ts       # 页面常量
├── components/        # 页面私有组件
├── hooks/             # 页面 Hooks
└── utils.ts           # 页面工具（可选）
```

### 3. 测试文件

根据需要添加测试文件：

```
/src/pages/UserManagement/
├── index.tsx
├── index.test.tsx     # 单元测试
└── hooks/
    ├── useUserList.ts
    └── useUserList.test.ts
```

## 📝 总结

本次调整完成了以下核心工作：

1. ✅ 将主要文件移动到符合规范的位置
2. ✅ 重构 API 层，统一管理所有 API 调用
3. ✅ 更新所有相关的导入路径
4. ✅ 完善类型定义
5. ✅ 确保所有代码符合 Guidelines.md 规范

项目现在拥有清晰的目录结构、统一的 API 调用方式和完整的类型定义，符合标准后台管理系统的架构规范。
