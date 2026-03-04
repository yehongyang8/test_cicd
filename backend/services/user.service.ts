/**
 * 用户服务
 */
import { nanoid } from 'nanoid';
import { BaseCrud, PageResult } from '../db/crud';
import {
  UserEntity,
  UserVO,
  CreateUserDTO,
  UpdateUserDTO,
  QueryUserDTO,
  toUserVO,
} from '../db/schema/user';
import { BusinessError, ResponseCode } from '../lib/response';
import { logger } from '../lib/logger';

/**
 * 用户服务类
 */
class UserServiceClass {
  private userCrud = new BaseCrud<UserEntity>('users');

  /**
   * 分页查询用户
   */
  async getUserPage(dto: QueryUserDTO): Promise<PageResult<UserVO>> {
    logger.info('Query user page:', dto);

    const where: Partial<UserEntity> = {};

    if (dto.username) {
      where.username = `%${dto.username}%`;
    }
    if (dto.realName) {
      where.realName = `%${dto.realName}%`;
    }
    if (dto.email) {
      where.email = `%${dto.email}%`;
    }
    if (dto.phone) {
      where.phone = `%${dto.phone}%`;
    }
    if (dto.status !== undefined) {
      where.status = dto.status;
    }

    const result = this.userCrud.findPage(where, {
      page: dto.page,
      pageSize: dto.pageSize,
      orderBy: 'createTime',
      order: 'DESC',
    });

    return {
      ...result,
      list: result.list.map(toUserVO),
    };
  }

  /**
   * 获取用户详情
   */
  async getUserDetail(id: string): Promise<UserVO> {
    logger.info('Get user detail:', id);

    const user = this.userCrud.findById(id);

    if (!user) {
      throw new BusinessError(
        ResponseCode.NOT_FOUND,
        '用户不存在'
      );
    }

    return toUserVO(user);
  }

  /**
   * 创建用户
   */
  async createUser(dto: CreateUserDTO): Promise<UserVO> {
    logger.info('Create user:', dto.username);

    // 检查用户名是否存在
    const existing = this.userCrud.findOne({ username: dto.username });
    if (existing) {
      throw new BusinessError(
        ResponseCode.BAD_REQUEST,
        '用户名已存在'
      );
    }

    // 创建用户
    const user = this.userCrud.create({
      id: nanoid(),
      ...dto,
    } as UserEntity);

    logger.info('User created successfully:', user.id);

    return toUserVO(user);
  }

  /**
   * 更新用户
   */
  async updateUser(dto: UpdateUserDTO): Promise<UserVO> {
    logger.info('Update user:', dto.id);

    // 检查用户是否存在
    const existing = this.userCrud.findById(dto.id);
    if (!existing) {
      throw new BusinessError(
        ResponseCode.NOT_FOUND,
        '用户不存在'
      );
    }

    // 如果更新用户名，检查是否重复
    if (dto.username && dto.username !== existing.username) {
      const duplicate = this.userCrud.findOne({ username: dto.username });
      if (duplicate) {
        throw new BusinessError(
          ResponseCode.BAD_REQUEST,
          '用户名已存在'
        );
      }
    }

    // 更新用户
    const updated = this.userCrud.update(dto.id, dto as Partial<UserEntity>);

    if (!updated) {
      throw new BusinessError(
        ResponseCode.INTERNAL_ERROR,
        '更新失败'
      );
    }

    logger.info('User updated successfully:', dto.id);

    return toUserVO(updated);
  }

  /**
   * 删除用户
   */
  async deleteUser(id: string): Promise<boolean> {
    logger.info('Delete user:', id);

    // 检查用户是否存在
    const existing = this.userCrud.findById(id);
    if (!existing) {
      throw new BusinessError(
        ResponseCode.NOT_FOUND,
        '用户不存在'
      );
    }

    // 不允许删除管理员
    if (existing.username === 'admin') {
      throw new BusinessError(
        ResponseCode.FORBIDDEN,
        '不允许删除管理员账号'
      );
    }

    // 软删除
    this.userCrud.delete(id);

    logger.info('User deleted successfully:', id);

    return true;
  }

  /**
   * 批量删除用户
   */
  async deleteBatch(ids: string[]): Promise<boolean> {
    logger.info('Batch delete users:', ids);

    // 检查是否包含管理员
    for (const id of ids) {
      const user = this.userCrud.findById(id);
      if (user && user.username === 'admin') {
        throw new BusinessError(
          ResponseCode.FORBIDDEN,
          '不允许删除管理员账号'
        );
      }
    }

    // 批量软删除
    this.userCrud.deleteBatch(ids);

    logger.info('Users deleted successfully');

    return true;
  }
}

export const UserService = new UserServiceClass();
