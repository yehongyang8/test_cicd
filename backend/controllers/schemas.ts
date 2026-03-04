/**
 * 控制器 Schema 定义
 */
import { z } from 'zod';
import { CreateUserDTO, UpdateUserDTO, QueryUserDTO } from '../db/schema/user';

/**
 * 登录请求 Schema
 */
export const loginRequestSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(50),
});

/**
 * 登录响应 Schema
 */
export const loginResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.object({
    user: z.object({
      id: z.string(),
      username: z.string(),
      realName: z.string(),
      email: z.string().optional(),
      phone: z.string().optional(),
      avatar: z.string().optional(),
      status: z.number(),
      roleIds: z.array(z.string()),
      createTime: z.number(),
      updateTime: z.number(),
    }),
    token: z.string(),
  }),
  timestamp: z.number().optional(),
});

/**
 * 用户详情请求 Schema
 */
export const userDetailRequestSchema = z.object({
  id: z.string(),
});

/**
 * 用户详情响应 Schema
 */
export const userDetailResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    username: z.string(),
    realName: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    avatar: z.string().optional(),
    status: z.number(),
    roleIds: z.array(z.string()),
    createTime: z.number(),
    updateTime: z.number(),
  }),
  timestamp: z.number().optional(),
});

/**
 * 用户分页请求 Schema
 */
export const userPageRequestSchema = QueryUserDTO;

/**
 * 用户分页响应 Schema
 */
export const userPageResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.object({
    list: z.array(z.object({
      id: z.string(),
      username: z.string(),
      realName: z.string(),
      email: z.string().optional(),
      phone: z.string().optional(),
      avatar: z.string().optional(),
      status: z.number(),
      roleIds: z.array(z.string()),
      createTime: z.number(),
      updateTime: z.number(),
    })),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
  }),
  timestamp: z.number().optional(),
});

/**
 * 用户创建请求 Schema
 */
export const userCreateRequestSchema = CreateUserDTO;

/**
 * 用户更新请求 Schema
 */
export const userUpdateRequestSchema = UpdateUserDTO;

/**
 * 用户删除请求 Schema
 */
export const userDeleteRequestSchema = z.object({
  id: z.string(),
});

/**
 * 批量删除请求 Schema
 */
export const batchDeleteRequestSchema = z.object({
  ids: z.array(z.string()).min(1),
});

/**
 * 通用成功响应 Schema
 */
export const successResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.any().optional(),
  timestamp: z.number().optional(),
});
