/**
 * 用户表结构定义
 */
import { z } from 'zod';

/**
 * 用户状态枚举
 */
export enum UserStatus {
  DISABLED = 0,
  ENABLED = 1,
}

/**
 * 用户实体接口
 */
export interface UserEntity {
  id: string;
  username: string;
  password: string;
  realName: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status: UserStatus;
  roleIds: string[];
  createBy: string;
  createTime: number;
  updateBy: string;
  updateTime: number;
  deleteTime?: number;
}

/**
 * 用户 VO（视图对象，去除敏感信息）
 */
export interface UserVO {
  id: string;
  username: string;
  realName: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status: UserStatus;
  roleIds: string[];
  createTime: number;
  updateTime: number;
}

/**
 * 用户创建 DTO
 */
export const CreateUserDTO = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(50),
  realName: z.string().min(1).max(50),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
  status: z.nativeEnum(UserStatus).default(UserStatus.ENABLED),
  roleIds: z.array(z.string()).default([]),
});

export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

/**
 * 用户更新 DTO
 */
export const UpdateUserDTO = z.object({
  id: z.string(),
  username: z.string().min(3).max(50).optional(),
  password: z.string().min(6).max(50).optional(),
  realName: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
  status: z.nativeEnum(UserStatus).optional(),
  roleIds: z.array(z.string()).optional(),
});

export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;

/**
 * 用户查询 DTO
 */
export const QueryUserDTO = z.object({
  id: z.string().optional(),
  username: z.string().optional(),
  realName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  status: z.nativeEnum(UserStatus).optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});

export type QueryUserDTO = z.infer<typeof QueryUserDTO>;

/**
 * 将实体转换为 VO
 */
export function toUserVO(entity: UserEntity): UserVO {
  const { ...vo } = entity;
  return vo;
}
