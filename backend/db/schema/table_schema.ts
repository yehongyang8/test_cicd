/**
 * 数据库表结构 SQL 定义
 */
export const tableSchema = `
  -- 用户表
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    realName TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    avatar TEXT,
    status INTEGER NOT NULL DEFAULT 1,
    roleIds TEXT NOT NULL,
    createBy TEXT NOT NULL,
    createTime INTEGER NOT NULL,
    updateBy TEXT NOT NULL,
    updateTime INTEGER NOT NULL,
    deleteTime INTEGER
  );

  -- 角色表
  CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    permissions TEXT NOT NULL,
    status INTEGER NOT NULL DEFAULT 1,
    createBy TEXT NOT NULL,
    createTime INTEGER NOT NULL,
    updateBy TEXT NOT NULL,
    updateTime INTEGER NOT NULL,
    deleteTime INTEGER
  );

  -- 创建索引
  CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
  CREATE INDEX IF NOT EXISTS idx_users_deleteTime ON users(deleteTime);
  CREATE INDEX IF NOT EXISTS idx_roles_code ON roles(code);
  CREATE INDEX IF NOT EXISTS idx_roles_deleteTime ON roles(deleteTime);
`;
