**Add your own guidelines here**

# 前端架构与代码规范

> 本文档定义了项目的技术栈选型、目录结构、命名规范、编码风格等核心约定。

---

## 📦 技术栈

| 技术领域       | 技术选型                       | 说明                     |
| -------------- | ------------------------------ | ------------------------ |
| **运行时框架** | React + TypeScript             | 类型安全的 React 开发    |
| **构建工具**   | Vite                           | 别名 `@` 指向 `src`      |
| **路由管理**   | React Router                   | 集中式路由配置           |
| **UI 框架**    | Ant Design + styled-components | 企业级组件库 + CSS-in-JS |
| **状态管理**   | MobX + mobx-react-lite         | 响应式状态管理           |
| **国际化**     | react-i18next + i18next        | 中英文双语支持           |
| **工具 Hooks** | ahooks                         | React Hooks 工具库       |
| **代码质量**   | ESLint + Prettier              | 代码规范检查与格式化     |

---

## 📁 目录结构

### 完整目录结构

```
/src/
├── types.ts              # 📝 全局类型定义
├── constants.ts          # 🔒 全局常量与枚举
├── assets/               # 🎨 静态资源
│   ├── images/           #    图片资源（logo、icon 等）
│   │   ├── logo.svg
│   │   └── icons/
│   ├── fonts/            #    字体文件
│   └── └── custom-font.ttf
├── components/           # 🧩 全局复用组件
│   ├── ComponentA/           #    按钮组件
│   │   ├── index.tsx     #    组件入口（命名导出）
│   │   ├── types.ts      #    Props 类型定义
│   │   ├── styles.ts     #    styled-components 样式
│   │   └── constants.ts  #    组件常量
│   └── index.ts          #    统一导出所有组件
├── pages/             # 🎯 特性模块（按业务领域划分）
│   ├── XXXXXX1/             #    认证模块
│   │   ├── index.tsx
│   │   ├── components/   #    🧩 模块复用组件
│   │   ├── hooks/        #    🎣 模块 Hooks
│   │   ├── stores/       #    📦 模块 Store（可选）
│   │   ├── api/          #    🌐 模块 API
│   │   ├── types.ts      #    📝 模块类型
│   │   └── constants.ts  #    🔒 模块常量
│   └── XXXXXX2/        #    仪表盘模块
│       ├── index.tsx
│       ├── components/
│       └── hooks/
├── hooks/                # 🎣 全局可复用 Hooks
│   ├── useXXX.ts
│   └── index.ts          #    统一导出
├── stores/               # 📦 MobX Store（全局状态）
│   ├── RootStore.ts      #    根 Store，聚合所有子 Store
│   ├── UserStore.ts      #    用户状态
│   └── index.ts          #    导出 Context 和 Hooks
├── locales/              # 🌍 国际化资源
│   ├── zh-CN/            #    中文简体
│   │   ├── common.json   #    通用翻译
│   ├── en-US/            #    英文
│   │   ├── common.json
│   └── index.ts          #    i18n 配置入口
├── servers/                  # 🌐 服务层（前端全局 接口调用）
│   ├── client.ts         #    HTTP 客户端配置（axios/fetch）
│   ├── interceptors.ts   #    请求/响应拦截器
│   ├── types.ts          #    API 通用类型
│   ├── apis/             #    英文
│   │   ├── user.ts       #    用户页面对应的接口调用
│   │   └── XXX.ts       #    XXX页面对应的接口调用
│   └── index.ts          #    导出 API 客户端
├── routes/               # 🛣️ 路由配置
│   ├── index.tsx         #    路由表定义
│   ├── guards.tsx        #    路由守卫（权限验证）
│   └── config.ts         #    路由配置常量
├── utils/                # 🔧 工具函数
│   ├── utilsA.ts         #    请求工具
│   └── index.ts          #    统一导出
├── App.tsx               # 🚀 应用入口组件
├── main.tsx              # 🚀 应用启动入口
└── vite-env.d.ts         # Vite 类型声明
```

### 目录说明

#### 1. 根目录文件

| 文件           | 说明         | 示例                              |
| -------------- | ------------ | --------------------------------- |
| `types.ts`     | 全局类型定义 | `ApiResponse`、`PaginationParams` |
| `constants.ts` | 全局常量     | `API_BASE_URL`、`PAGE_SIZE`       |
| `App.tsx`      | 应用根组件   | 配置 Provider、Router、Theme      |
| `main.tsx`     | 应用入口     | ReactDOM.render、全局初始化       |

### 核心原则

1. **单一职责**：每个文件/目录只负责一个功能
2. **就近原则**：组件、Hook、工具尽量放在使用模块内
3. **复用优先**：跨模块复用的提升到 `/src/` 根目录
4. **类型安全**：所有 API、组件、Hook 都有 TypeScript 类型
5. **文件行数限制**：单个文件不超过 500 行，超过需拆分

---

## 📝 命名规范

### 目录命名

| 类型     | 风格       | 示例                              |
| -------- | ---------- | --------------------------------- |
| 特性模块 | PascalCase | `DataSetView`、`UserManagement`   |
| 复用组件 | PascalCase | `FilterGroup`、`AuthWrapper`      |
| 通用目录 | kebab-case | `hooks/`、`utils/`、`components/` |

### 文件命名

| 类型          | 规则           | 示例                   |
| ------------- | -------------- | ---------------------- |
| 页面/组件入口 | `index.tsx`    | `pages/Home/index.tsx` |
| 类型定义      | `types.ts`     | `types.ts`             |
| Hook          | `useXxx.ts(x)` | `useUserQueries.ts`    |
| 工具函数      | `xxxUtils.ts`  | `dateUtils.ts`         |
| API 服务      | `xxx.api.ts`   | `user.api.ts`          |
| 样式文件      | `styles.ts`    | `styles.ts`            |

### TypeScript 命名

```typescript
// 接口 - I 前缀
interface IUserInfo {
  id: string;
  name: string;
}

// 类型别名 - T 前缀
type TApiResponse<T> = {
  data: T;
  code: number;
};

// 枚举 - 全大写或 Enum 前缀
const USER_ROLE = {
  ADMIN: "admin",
  USER: "user",
} as const;

// 变量 - camelCase
const userName = "John";
const isLoading = false;

// 常量 - UPPER_SNAKE_CASE
const API_BASE_URL = "https://api.example.com";

// 函数 - camelCase，动词开头
function getUserInfo() {}
function handleSubmit() {}

// 组件 - PascalCase
function UserProfile() {}
```

### 导出规范

| 场景     | 导出方式          | 原因                |
| -------- | ----------------- | ------------------- |
| 页面组件 | `export default`  | 路由懒加载需要      |
| 复用组件 | `export function` | 避免重命名混乱      |
| 工具函数 | `export const`    | 支持按需引入        |
| 类型定义 | `export type`     | TypeScript 最佳实践 |

---

## 🎯 页面创建模板

### 标准结构

```
/pages/{module}/
├── index.tsx          # 页面入口（默认导出）
├── types.ts           # 页面类型
├── components/        # 页面私有组件
├── hooks/             # 页面私有逻辑
└── utils.ts           # 页面工具（可选）
```

### 示例

```tsx
// pages/survey/index.tsx
import { useState } from "react";
import { useSurveyList } from "../../hooks/useSurveyQueries";
import { SurveyTable } from "./components/SurveyTable";

export default function SurveyListPage() {
  const [filters, setFilters] = useState({});
  const { data, isLoading } = useSurveyList(filters);

  return (
    <div>
      <SurveyTable data={data} loading={isLoading} />
    </div>
  );
}
```

---

## 🧩 组件创建模板

### 标准结构

```
/src/components/ComponentName/
├── index.tsx          # 组件入口（命名导出）
├── types.ts           # Props 类型
├── styles.ts          # styled-components 样式
└── constants.ts       # 组件常量（可选）
```

### 示例

```tsx
// src/components/DataTable/index.tsx
import { Table } from "antd";
import type { DataTableProps } from "./types";

export function DataTable<T extends Record<string, any>>({
  columns,
  dataSource,
  loading = false,
  ...rest
}: DataTableProps<T>) {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      {...rest}
    />
  );
}
```

---

## 🛣️ 路由规范

### 路径命名

- 使用 **kebab-case**：`/user-profile`、`/data-analysis`
- 语义清晰：`/survey/create`、`/template/edit/:id`
- 层级不超过 3 层
- 动态参数：`:paramName`

### 示例

```tsx
// src/route/index.tsx
import { lazy } from "react";

const SurveyList = lazy(() => import("@/pages/survey"));

export const routes = [
  {
    path: "/survey",
    children: [
      { index: true, element: <SurveyList /> },
      { path: "create", element: <SurveyCreate /> },
      { path: "detail/:id", element: <SurveyDetail /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];
```

---

## 📦 状态管理（MobX）

### Store 结构

```
/src/stores/
├── RootStore.ts       # 根 Store
├── UserStore.ts       # 用户状态
├── UIStore.ts         # UI 状态
└── index.ts           # 导出与 Context
```

### 基础用法

```typescript
// stores/UserStore.ts
import { makeAutoObservable, runInAction } from "mobx";

export class UserStore {
  currentUser: User | null = null;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return this.currentUser !== null;
  }

  async fetchUser(id: string) {
    this.isLoading = true;
    try {
      const user = await userApi.getUser(id);
      runInAction(() => {
        this.currentUser = user;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}
```

```typescript
// stores/index.ts
import { createContext, useContext } from "react";
import { RootStore } from "./RootStore";

const rootStore = new RootStore();
const StoreContext = createContext<RootStore>(rootStore);

export const useStore = () => useContext(StoreContext);
export const useUserStore = () => useStore().userStore;
export const StoreProvider = StoreContext.Provider;
export { rootStore };
```

```tsx
// 组件中使用
import { observer } from "mobx-react-lite";
import { useUserStore } from "@/stores";

export const UserProfile = observer(() => {
  const userStore = useUserStore();

  return (
    <div>
      <h2>{userStore.currentUser?.name}</h2>
      {userStore.isLoggedIn && (
        <button onClick={() => userStore.logout()}>退出</button>
      )}
    </div>
  );
});
```

### 最佳实践

✅ **推荐**

- 使用 `makeAutoObservable` 简化代码
- 异步操作用 `runInAction` 更新状态
- 使用 `computed` 派生状态
- 组件用 `observer` 包裹

❌ **不推荐**

- 不要在 action 外直接修改状态
- 不要忘记使用 `observer`
- 不要在异步后直接修改状态（应用 `runInAction`）

---

## 🌍 国际化（i18n）

### 目录结构

```
/src/locales/
├── zh-CN/
│   ├── common.json       # 通用翻译
│   ├── menu.json
│   └── validation.json
├── en-US/
│   ├── common.json
│   ├── menu.json
│   └── validation.json
└── index.ts              # 配置入口
```

### 配置

```typescript
// locales/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zhCN from "./zh-CN";
import enUS from "./en-US";

i18n.use(initReactI18next).init({
  resources: { "zh-CN": zhCN, "en-US": enUS },
  fallbackLng: "zh-CN",
  interpolation: { escapeValue: false },
});

export default i18n;
```

### 翻译文件

```json
// locales/zh-CN/common.json
{
  "button": {
    "confirm": "确定",
    "cancel": "取消",
    "save": "保存"
  },
  "label": {
    "username": "用户名",
    "email": "邮箱"
  },
  "placeholder": {
    "input": "请输入{{field}}"
  }
}
```

### 使用

```tsx
import { useTranslation } from "react-i18next";

export function UserForm() {
  const { t } = useTranslation();

  return (
    <Form>
      <Form.Item label={t("common.label.username")}>
        <Input
          placeholder={t("common.placeholder.input", {
            field: t("common.label.username"),
          })}
        />
      </Form.Item>
      <Button type="primary">
        {t("common.button.submit")}
      </Button>
    </Form>
  );
}
```

### 语言切换

```tsx
import { useTranslation } from "react-i18next";
import { Select } from "antd";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <Select
      value={i18n.language}
      onChange={(lang) => i18n.changeLanguage(lang)}
      options={[
        { value: "zh-CN", label: "简体中文" },
        { value: "en-US", label: "English" },
      ]}
    />
  );
}
```

### 配合 Ant Design

```tsx
import { ConfigProvider } from "antd";
import { useTranslation } from "react-i18next";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";

const locales = { "zh-CN": zhCN, "en-US": enUS };

export function App() {
  const { i18n } = useTranslation();
  return (
    <ConfigProvider locale={locales[i18n.language] || zhCN}>
      {/* 应用内容 */}
    </ConfigProvider>
  );
}
```

---

## 🎣 工具 Hooks（ahooks）

### ahooks 使用规范

项目使用 **ahooks** 作为 React Hooks 工具库，提供大量开箱即用的 Hooks。

```bash
pnpm add ahooks
```

#### 常用 Hooks 速查

| 分类         | Hooks                                            | 说明             |
| ------------ | ------------------------------------------------ | ---------------- |
| **生命周期** | `useMount`、`useUnmount`、`useUpdateEffect`      | 组件生命周期管理 |
| **状态**     | `useBoolean`、`useToggle`、`useSetState`         | 简化状态管理     |
| **请求**     | `useRequest`、`useAntdTable`                     | 异步请求与表格   |
| **防抖节流** | `useDebounceFn`、`useThrottleFn`、`useDebounce`  | 性能优化         |
| **存储**     | `useLocalStorageState`、`useSessionStorageState` | 本地存储         |
| **响应式**   | `useResponsive`、`useSize`                       | 响应式设计       |
| **定时器**   | `useInterval`、`useTimeout`                      | 定时任务         |
| **DOM**      | `useEventListener`、`useClickAway`、`useScroll`  | DOM 操作         |

#### 常用示例

```tsx
import {
  useMount,
  useBoolean,
  useRequest,
  useDebounceFn,
  useLocalStorageState,
} from "ahooks";

function MyComponent() {
  // 组件挂载
  useMount(() => {
    console.log("mounted");
  });

  // 布尔状态
  const [visible, { setTrue, setFalse, toggle }] =
    useBoolean(false);

  // 异步请求
  const { data, loading, run } = useRequest(api.getData, {
    manual: true,
    onSuccess: (data) => console.log(data),
  });

  // 防抖
  const { run: handleSearch } = useDebounceFn(
    (value) => console.log(value),
    { wait: 500 },
  );

  // 本地存储
  const [user, setUser] = useLocalStorageState("user", {
    defaultValue: { name: "" },
  });

  return <button onClick={toggle}>切换</button>;
}
```

#### 最佳实践

✅ **推荐**

- 使用 `useRequest` 管理异步请求
- 使用 `useBoolean` 管理布尔状态
- 使用 `useDebounceFn` 处理频繁操作
- 使用 `useLocalStorageState` 持久化状态

❌ **不推荐**

- 不要重复实现 ahooks 已有的功能
- 不要手动实现防抖节流
- 不要手动管理 localStorage

#### 与 MobX 配合

```tsx
import { observer } from "mobx-react-lite";
import { useRequest, useMount } from "ahooks";
import { useUserStore } from "@/stores";

export const UserProfile = observer(() => {
  const userStore = useUserStore();

  const { loading, run } = useRequest(
    (id) => userApi.getUser(id),
    {
      manual: true,
      onSuccess: (data) => userStore.setUser(data),
    },
  );

  useMount(() => run(userStore.userId));

  return loading ? (
    <div>加载中...</div>
  ) : (
    <div>{userStore.currentUser?.name}</div>
  );
});
```

---

## 🎨 样式规范

### 使用规范

| 场景     | 做法                           |
| -------- | ------------------------------ |
| 基础组件 | 优先使用 Ant Design            |
| 布局     | 使用 `Layout`、`Space`、`Flex` |
| 样式定制 | 使用 styled-components         |
| 主题变量 | 使用 `theme.useToken()`        |

### 主题配置

```tsx
import { ConfigProvider, theme } from "antd";

const customTheme = {
  token: {
    colorPrimary: "#1890ff",
    borderRadius: 4,
    fontSize: 14,
  },
};

function App() {
  return (
    <ConfigProvider theme={customTheme}>
      {/* 内容 */}
    </ConfigProvider>
  );
}
```

### styled-components 用法

```tsx
// styles.ts
import styled from "styled-components";

export const CardContainer = styled.div`
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

// 动态样式
export const Badge = styled.span<{
  $status: "success" | "error";
}>`
  padding: 2px 8px;
  border-radius: 4px;
  background: ${(props) =>
    props.$status === "success" ? "#52c41a" : "#ff4d4f"};
  color: #fff;
`;

// 扩展 Ant Design 组件
import { Table } from "antd";

export const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #fafafa;
    font-weight: 600;
  }
`;
```

### 最佳实践

✅ **推荐**

- 优先使用 Ant Design 组件
- 使用 styled-components 定制样式
- 使用主题 token
- 在组件外定义 styled 组件

❌ **不推荐**

- 过度使用内联样式
- 重复造轮子
- 在组件内定义 styled 组件

---

## 编码规范

### Prettier 配置

```javascript
module.exports = {
  printWidth: 80,
  tabWidth: 2,
  singleQuote: true,
  semi: false,
  trailingComma: 'none',
}
```

### ESLint 关键规则

- 允许 React JSX 运行时（无需 `import React`）
- 未使用变量报错，但允许 `_` 前缀
- 关闭 `prop-types` 等非 TS 规则

### 导入顺序

1. 第三方包
2. 别名 `@/...`
3. 相对路径

---

## API 层规范

```typescript
// ✅ 正确 - 使用 httpClient
import { httpClient } from "@/lib/api";

export const userApi = {
  getUsers: () => httpClient.get<User[]>("/users"),
  createUser: (data: CreateUserDto) =>
    httpClient.post<User>("/users", data),
};

// ❌ 错误 - 不要使用 fetch
const response = await fetch("https://...");
```

---

## 新增内容规则

### 新增页面

- 目录：`/pages/{module}/`
- 文件：`index.tsx`（默认导出）、`types.ts`、`hooks/`、`components/`
- 路由：在 `src/route/index.tsx` 增加条目

### 新增组件

- 目录：`/components/ComponentName/`
- 文件：`index.tsx`（命名导出）、`types.ts`、`styles.ts`

### 新增 Hook

- 文件名：`useXxx.ts(x)`
- 放置：复用型在 `/hooks/`，组件私有放组件内 `hooks/`

### 新增工具

- 目录：`/utils/`
- 文件：`xxxUtils.ts`

---

## 运行命令

- 开发：`pnpm dev`
- 构建：`pnpm build`
- 检查：`pnpm lint`
- 测试：`pnpm test`

# TypeScript 后端结构规范

本规范定义了基于 TypeScript + indexed + sqlite.js 的模拟后端开发架构。通过显式的分层设计，模拟成熟后端的开发模式，确保代码职责清晰、全链路类型安全。

## 1. 核心分层架构

采用严格的分层结构，明确各层职责：

```text
backend/
├── controllers/        # 控制器层 (Controllers)
│   ├── [module].controller.ts # 定义路由、解析参数、调用 Service
│   └── schemas.ts      # 接口请求/响应的 Zod Schema 定义
├── services/           # 业务逻辑层 (Services)
│   └── [module].service.ts # 核心业务逻辑实现
├── db/                 # 数据访问层 (Data Access)
│   ├── schema          # 数据库表结构定义 (Drizzle)
│   │   ├── user.ts     # 用户表结构定义
│   │   ├── role.ts     # 角色表结构定义
│   │   └── table_schema.ts    # 数据库表结构 SQL
│   ├── crud.ts         # 通用 CRUD 封装 (含审计与软删除)
│   └── index.ts        # 数据库连接与事务配置
├── lib/                # 工具与库 (Library)
│   ├── request-context.ts # 请求上下文管理 (AsyncLocalStorage)
│   ├── response.ts     # 统一响应处理
│   └── logger.ts       # 日志工具
└── middleware/         # 中间件 (Middleware)
```

## 2. 控制器层规范 (Controllers)

Controller 层负责处理外部请求并将其分发到业务逻辑层。

- **职责**:
  - 定义 API 路由路径和 HTTP 方法。
  - 使用 Zod Schema 进行输入参数校验。
  - 解析请求参数（Query, Body）。
  - 调用 Service 层方法。
  - 返回统一格式的响应。
- **要求**:
  - **禁止** 在 Controller 中编写业务逻辑。
  - **禁止** 直接操作数据库。

```typescript
// 示例：api/controllers/user.controller.ts
import { createApiRoute } from "../lib/openapi";
import { userSaveSchema, userResponseSchema } from "./schemas";
import { UserService } from "../services/user.service";

export const createUserRoute = createApiRoute({
  method: "post",
  path: "/api/user/save",
  request: {
    body: {
      content: {
        "application/json": { schema: userSaveSchema },
      },
    },
  },
  success: {
    schema: userResponseSchema,
  },
  handler: async (c) => {
    const data = await c.req.json();
    const result = await UserService.create(data);
    return c.json({ code: 200, data: result });
  },
});
```

## 3. 业务逻辑层规范 (Services)

Service 层是业务逻辑的核心，应保持纯粹：

- **职责**: 处理业务规则、事务控制、调用 CRUD。
- **解耦**: 不直接操作 HTTP 上下文。
- **上下文获取**: 通过 `getRequestUser()` 获取当前用户信息。
- **事务**: 使用 `runInTransaction` 包裹多表写操作。

## 4. 数据模型规范 (Models)

### 4.1 数据库实体 (Entity)

对应 `db/schema.ts`。所有业务表必须包含基础审计字段（`createBy`, `createTime`, `updateBy`, `updateTime`, `deleteTime`）。

### 4.2 DTO & VO

- **DTO (Data Transfer Object)**: 用于 Controller 输入校验。
- **VO (View Object)**: 用于 Controller 输出，负责数据脱敏。

## 5. HTTP 接口规范

| 操作类型 | HTTP 方法 | 参数传递方式 | 路径示例                        |
| :------- | :-------- | :----------- | :------------------------------ |
| 查询单条 | `GET`     | Query 参数   | `/api/user/detail?id=xxx`       |
| 查询列表 | `GET`     | Query 参数   | `/api/user/page?page=1&size=10` |
| 创建资源 | `POST`    | Body (JSON)  | `/api/user/save`                |
| 更新资源 | `POST`    | Body (JSON)  | `/api/user/update`              |
| 删除资源 | `POST`    | Body (JSON)  | `/api/user/delete`              |

**禁止事项**：

- 🚫 禁止使用路径参数传递 ID (如 `/user/:id`)。
- 🚫 禁止使用 `PUT` / `DELETE` 方法。

## 6. 编码原则

1.  **类型先行**: 优先定义 Schema，确保全链路类型推断。
2.  **软删除**: 所有业务查询默认过滤 `deleteTime`。
3.  **消除魔法值**: 状态值必须抽取为常量或枚举。