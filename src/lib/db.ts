import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug        VARCHAR(255) UNIQUE NOT NULL,
      title       VARCHAR(500) NOT NULL,
      excerpt     TEXT,
      content     TEXT NOT NULL,
      category    VARCHAR(50) NOT NULL,
      emoji       VARCHAR(10) DEFAULT '📝',
      date        VARCHAR(50),
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_posts_category   ON posts(category);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);`);
}

export default pool;
