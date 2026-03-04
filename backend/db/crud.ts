/**
 * 通用 CRUD 封装（含审计与软删除）
 */
import { getDatabase } from './index';
import { getRequestUser } from '../lib/request-context';

/**
 * 分页查询结果
 */
export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 查询选项
 */
export interface QueryOptions {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
}

/**
 * 通用 CRUD 类
 */
export class BaseCrud<T extends Record<string, any>> {
  constructor(private tableName: string) {}

  /**
   * 根据 ID 查询
   */
  findById(id: string): T | null {
    const db = getDatabase();
    const stmt = db.prepare(
      `SELECT * FROM ${this.tableName} WHERE id = ? AND deleteTime IS NULL`
    );
    stmt.bind([id]);

    if (stmt.step()) {
      const row = stmt.getAsObject() as any;
      stmt.free();
      return this.parseRow(row);
    }

    stmt.free();
    return null;
  }

  /**
   * 查询单条记录
   */
  findOne(where: Partial<T>): T | null {
    const db = getDatabase();
    const conditions = Object.keys(where)
      .map(key => `${key} = ?`)
      .join(' AND ');
    
    const stmt = db.prepare(
      `SELECT * FROM ${this.tableName} WHERE ${conditions} AND deleteTime IS NULL LIMIT 1`
    );
    stmt.bind(Object.values(where));

    if (stmt.step()) {
      const row = stmt.getAsObject() as any;
      stmt.free();
      return this.parseRow(row);
    }

    stmt.free();
    return null;
  }

  /**
   * 查询列表
   */
  findList(where?: Partial<T>, options?: QueryOptions): T[] {
    const db = getDatabase();
    let sql = `SELECT * FROM ${this.tableName} WHERE deleteTime IS NULL`;

    const values: any[] = [];

    if (where && Object.keys(where).length > 0) {
      const conditions = Object.keys(where)
        .map(key => {
          const value = where[key as keyof T];
          if (typeof value === 'string' && value.includes('%')) {
            return `${key} LIKE ?`;
          }
          return `${key} = ?`;
        })
        .join(' AND ');
      sql += ` AND ${conditions}`;
      values.push(...Object.values(where));
    }

    if (options?.orderBy) {
      sql += ` ORDER BY ${options.orderBy} ${options.order || 'DESC'}`;
    }

    const stmt = db.prepare(sql);
    stmt.bind(values);

    const results: T[] = [];
    while (stmt.step()) {
      results.push(this.parseRow(stmt.getAsObject() as any));
    }

    stmt.free();
    return results;
  }

  /**
   * 分页查询
   */
  findPage(where?: Partial<T>, options?: QueryOptions): PageResult<T> {
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 10;
    const offset = (page - 1) * pageSize;

    const db = getDatabase();
    let sql = `SELECT * FROM ${this.tableName} WHERE deleteTime IS NULL`;
    let countSql = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE deleteTime IS NULL`;

    const values: any[] = [];

    if (where && Object.keys(where).length > 0) {
      const conditions = Object.keys(where)
        .map(key => {
          const value = where[key as keyof T];
          if (typeof value === 'string' && value.includes('%')) {
            return `${key} LIKE ?`;
          }
          return `${key} = ?`;
        })
        .join(' AND ');
      sql += ` AND ${conditions}`;
      countSql += ` AND ${conditions}`;
      values.push(...Object.values(where));
    }

    if (options?.orderBy) {
      sql += ` ORDER BY ${options.orderBy} ${options.order || 'DESC'}`;
    }

    sql += ` LIMIT ? OFFSET ?`;

    // 查询总数
    const countStmt = db.prepare(countSql);
    countStmt.bind(values);
    countStmt.step();
    const total = (countStmt.getAsObject() as any).total;
    countStmt.free();

    // 查询列表
    const stmt = db.prepare(sql);
    stmt.bind([...values, pageSize, offset]);

    const list: T[] = [];
    while (stmt.step()) {
      list.push(this.parseRow(stmt.getAsObject() as any));
    }

    stmt.free();

    return {
      list,
      total,
      page,
      pageSize,
    };
  }

  /**
   * 创建记录
   */
  create(data: Partial<T>): T {
    const db = getDatabase();
    const user = getRequestUser();
    const now = Date.now();

    const recordData = {
      ...data,
      createBy: user?.id || 'system',
      createTime: now,
      updateBy: user?.id || 'system',
      updateTime: now,
    };

    const fields = Object.keys(recordData);
    const placeholders = fields.map(() => '?').join(', ');
    const values = fields.map(field => this.serializeValue(recordData[field as keyof typeof recordData]));

    const sql = `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES (${placeholders})`;
    db.run(sql, values);

    return recordData as T;
  }

  /**
   * 更新记录
   */
  update(id: string, data: Partial<T>): T | null {
    const db = getDatabase();
    const user = getRequestUser();
    const now = Date.now();

    const updateData = {
      ...data,
      updateBy: user?.id || 'system',
      updateTime: now,
    };

    const fields = Object.keys(updateData);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => this.serializeValue(updateData[field as keyof typeof updateData]));

    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ? AND deleteTime IS NULL`;
    db.run(sql, [...values, id]);

    return this.findById(id);
  }

  /**
   * 软删除
   */
  delete(id: string): boolean {
    const db = getDatabase();
    const user = getRequestUser();
    const now = Date.now();

    const sql = `UPDATE ${this.tableName} SET deleteTime = ?, updateBy = ?, updateTime = ? WHERE id = ? AND deleteTime IS NULL`;
    db.run(sql, [now, user?.id || 'system', now, id]);

    return true;
  }

  /**
   * 批量删除
   */
  deleteBatch(ids: string[]): boolean {
    const db = getDatabase();
    const user = getRequestUser();
    const now = Date.now();

    const placeholders = ids.map(() => '?').join(', ');
    const sql = `UPDATE ${this.tableName} SET deleteTime = ?, updateBy = ?, updateTime = ? WHERE id IN (${placeholders}) AND deleteTime IS NULL`;
    db.run(sql, [now, user?.id || 'system', now, ...ids]);

    return true;
  }

  /**
   * 解析行数据
   */
  private parseRow(row: any): T {
    const parsed: any = {};
    for (const key in row) {
      parsed[key] = this.deserializeValue(row[key]);
    }
    return parsed;
  }

  /**
   * 序列化值（用于存储）
   */
  private serializeValue(value: any): any {
    if (value === null || value === undefined) {
      return null;
    }
    if (Array.isArray(value) || typeof value === 'object') {
      return JSON.stringify(value);
    }
    return value;
  }

  /**
   * 反序列化值（用于读取）
   */
  private deserializeValue(value: any): any {
    if (typeof value === 'string') {
      // 尝试解析 JSON 数组
      if (value.startsWith('[') || value.startsWith('{')) {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
    }
    return value;
  }
}
