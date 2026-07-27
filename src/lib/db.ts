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
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_posts_category   ON posts(category);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);`);
  await pool.query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();`);
  await pool.query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_image VARCHAR(500);`);
  await pool.query(`
    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);
  await pool.query(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'posts_updated_at'
      ) THEN
        CREATE TRIGGER posts_updated_at
          BEFORE UPDATE ON posts
          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
      END IF;
    END $$;
  `);
}

export default pool;
