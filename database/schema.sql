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

CREATE INDEX IF NOT EXISTS idx_posts_category   ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
