import postgres from 'postgres';

// 延迟初始化数据库连接
let sql: ReturnType<typeof postgres> | null = null;

function getSql() {
  if (!sql) {
    if (!process.env.POSTGRES_URL) {
      throw new Error('POSTGRES_URL environment variable is not set. Please create a .env.local file with your Neon database connection string.');
    }
    
    sql = postgres(process.env.POSTGRES_URL, { 
      ssl: 'require', // Neon requires SSL
      max: 10, // 连接池大小
      idle_timeout: 20, // 空闲连接超时
      connect_timeout: 10, // 连接超时
      // Neon specific optimizations
      prepare: false, // 禁用prepared statements以提高性能
      connection: {
        application_name: 'hulio-site'
      }
    });
  }
  return sql;
}

export { getSql };

// 数据库连接测试
export async function testConnection() {
  try {
    const sqlInstance = getSql();
    const result = await sqlInstance`SELECT NOW()`;
    console.log('Database connected successfully:', result[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// 初始化数据库表（如果需要）
export async function initDatabase() {
  try {
    const sqlInstance = getSql();
    
    // 检查articles表是否存在
    const tableExists = await sqlInstance`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'articles'
      );
    `;

    if (!tableExists[0].exists) {
      console.log('Creating articles table...');
      await sqlInstance`
        CREATE TABLE articles (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          summary TEXT,
          content TEXT NOT NULL,
          author_id INTEGER NOT NULL,
          category VARCHAR(50),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          tags TEXT[] DEFAULT '{}',
          view_count INTEGER DEFAULT 0,
          status SMALLINT DEFAULT 1
        );
      `;
      console.log('Articles table created successfully');
    } else {
      console.log('Articles table already exists');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}
