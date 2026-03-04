/**
 * 用户控制器
 */
import { UserService } from '../services/user.service';
import { success, error, ResponseCode, BusinessError } from '../lib/response';
import { logger } from '../lib/logger';
import {
  userPageRequestSchema,
  userDetailRequestSchema,
  userCreateRequestSchema,
  userUpdateRequestSchema,
  userDeleteRequestSchema,
  batchDeleteRequestSchema,
} from './schemas';

/**
 * 分页查询用户
 */
export async function getUserPage(data: any) {
  try {
    // 参数校验
    const validatedData = userPageRequestSchema.parse(data);

    // 调用服务
    const result = await UserService.getUserPage(validatedData);

    return success(result, '查询成功');
  } catch (err) {
    logger.error('Get user page error:', err);

    if (err instanceof BusinessError) {
      return error(err.code, err.message, err.data);
    }

    return error(ResponseCode.INTERNAL_ERROR, '查询失败');
  }
}

/**
 * 获取用户详情
 */
export async function getUserDetail(data: any) {
  try {
    // 参数校验
    const validatedData = userDetailRequestSchema.parse(data);

    // 调用服务
    const result = await UserService.getUserDetail(validatedData.id);

    return success(result, '查询成功');
  } catch (err) {
    logger.error('Get user detail error:', err);

    if (err instanceof BusinessError) {
      return error(err.code, err.message, err.data);
    }

    return error(ResponseCode.INTERNAL_ERROR, '查询失败');
  }
}

/**
 * 创建用户
 */
export async function createUser(data: any) {
  try {
    // 参数校验
    const validatedData = userCreateRequestSchema.parse(data);

    // 调用服务
    const result = await UserService.createUser(validatedData);

    return success(result, '创建成功');
  } catch (err) {
    logger.error('Create user error:', err);

    if (err instanceof BusinessError) {
      return error(err.code, err.message, err.data);
    }

    return error(ResponseCode.INTERNAL_ERROR, '创建失败');
  }
}

/**
 * 更新用户
 */
export async function updateUser(data: any) {
  try {
    // 参数校验
    const validatedData = userUpdateRequestSchema.parse(data);

    // 调用服务
    const result = await UserService.updateUser(validatedData);

    return success(result, '更新成功');
  } catch (err) {
    logger.error('Update user error:', err);

    if (err instanceof BusinessError) {
      return error(err.code, err.message, err.data);
    }

    return error(ResponseCode.INTERNAL_ERROR, '更新失败');
  }
}

/**
 * 删除用户
 */
export async function deleteUser(data: any) {
  try {
    // 参数校验
    const validatedData = userDeleteRequestSchema.parse(data);

    // 调用服务
    const result = await UserService.deleteUser(validatedData.id);

    return success(result, '删除成功');
  } catch (err) {
    logger.error('Delete user error:', err);

    if (err instanceof BusinessError) {
      return error(err.code, err.message, err.data);
    }

    return error(ResponseCode.INTERNAL_ERROR, '删除失败');
  }
}

/**
 * 批量删除用户
 */
export async function batchDeleteUsers(data: any) {
  try {
    // 参数校验
    const validatedData = batchDeleteRequestSchema.parse(data);

    // 调用服务
    const result = await UserService.deleteBatch(validatedData.ids);

    return success(result, '删除成功');
  } catch (err) {
    logger.error('Batch delete users error:', err);

    if (err instanceof BusinessError) {
      return error(err.code, err.message, err.data);
    }

    return error(ResponseCode.INTERNAL_ERROR, '删除失败');
  }
}
