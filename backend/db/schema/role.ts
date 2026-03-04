/**
 * 角色表结构定义
 */
import { z } from 'zod';

/**
 * 角色状态枚举
 */
export enum RoleStatus {
  DISABLED = 0,
  ENABLED = 1,
}

/**
 * 角色实体接口
 */
export interface RoleEntity {
  id: string;
  name: string;
  code: string;
  description?: string;
  permissions: string[];
  status: RoleStatus;
  createBy: string;
  createTime: number;
  updateBy: string;
  updateTime: number;
  deleteTime?: number;
}

/**
 * 角色 VO
 */
export interface RoleVO {
  id: string;
  name: string;
  code: string;
  description?: string;
  permissions: string[];
  status: RoleStatus;
  createTime: number;
  updateTime: number;
}

/**
 * 角色创建 DTO
 */
export const CreateRoleDTO = z.object({
  name: z.string().min(1).max(50),
  code: z.string().min(1).max(50),
  description: z.string().optional(),
  permissions: z.array(z.string()).default([]),
  status: z.nativeEnum(RoleStatus).default(RoleStatus.ENABLED),
});

export type CreateRoleDTO = z.infer<typeof CreateRoleDTO>;

/**
 * 角色更新 DTO
 */
export const UpdateRoleDTO = z.object({
  id: z.string(),
  name: z.string().min(1).max(50).optional(),
  code: z.string().min(1).max(50).optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  status: z.nativeEnum(RoleStatus).optional(),
});

export type UpdateRoleDTO = z.infer<typeof UpdateRoleDTO>;

/**
 * 将实体转换为 VO
 */
export function toRoleVO(entity: RoleEntity): RoleVO {
  const { ...vo } = entity;
  return vo;
}
