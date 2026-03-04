/**
 * 数据库连接与配置
 * 使用 sql.js 实现浏览器内存数据库
 */
import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;

/**
 * 初始化数据库
 */
export async function initDatabase(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`
  });

  db = new SQL.Database();

  // 执行初始化 SQL
  const schema = await import('./schema/table_schema');
  db.run(schema.tableSchema);

  // 插入初始数据
  await seedData(db);

  return db;
}

/**
 * 获取数据库实例
 */
export function getDatabase(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * 事务执行
 */
export async function runInTransaction<T>(
  callback: (db: Database) => Promise<T>
): Promise<T> {
  const database = getDatabase();
  
  try {
    database.run('BEGIN TRANSACTION');
    const result = await callback(database);
    database.run('COMMIT');
    return result;
  } catch (error) {
    database.run('ROLLBACK');
    throw error;
  }
}

/**
 * 种子数据
 */
async function seedData(database: Database) {
  // 插入初始管理员用户
  database.run(`
    INSERT INTO users (id, username, password, realName, email, phone, status, roleIds, createBy, createTime, updateBy, updateTime)
    VALUES (
      'admin',
      'admin',
      'e10adc3949ba59abbe56e057f20f883e',
      '系统管理员',
      'admin@example.com',
      '13800138000',
      1,
      '["admin"]',
      'system',
      ${Date.now()},
      'system',
      ${Date.now()}
    )
  `);

  // 插入初始角色
  database.run(`
    INSERT INTO roles (id, name, code, description, permissions, status, createBy, createTime, updateBy, updateTime)
    VALUES (
      'admin',
      '超级管理员',
      'admin',
      '系统超级管理员角色',
      '["*"]',
      1,
      'system',
      ${Date.now()},
      'system',
      ${Date.now()}
    )
  `);

  // 插入普通用户
  database.run(`
    INSERT INTO users (id, username, password, realName, email, phone, status, roleIds, createBy, createTime, updateBy, updateTime)
    VALUES (
      'user1',
      'user',
      'e10adc3949ba59abbe56e057f20f883e',
      '普通用户',
      'user@example.com',
      '13800138001',
      1,
      '["user"]',
      'admin',
      ${Date.now()},
      'admin',
      ${Date.now()}
    )
  `);

  // 插入普通用户角色
  database.run(`
    INSERT INTO roles (id, name, code, description, permissions, status, createBy, createTime, updateBy, updateTime)
    VALUES (
      'user',
      '普通用户',
      'user',
      '普通用户角色',
      '["dashboard:view"]',
      1,
      'admin',
      ${Date.now()},
      'admin',
      ${Date.now()}
    )
  `);
}
