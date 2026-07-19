import pool, { initDB } from './db';
import { Post, Category } from '@/types/post';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) {
    await initDB();
    dbReady = true;
  }
}

function rowToPost(row: Record<string, unknown>): Post {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    excerpt: row.excerpt as string,
    content: row.content as string,
    category: row.category as Category,
    emoji: row.emoji as string,
    date: row.date as string,
    createdAt: (row.created_at as Date).toISOString(),
  };
}

export async function getPosts(category?: string, q?: string): Promise<Post[]> {
  await ensureDB();

  const conditions: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (category && category !== '전체') {
    conditions.push(`category = $${idx++}`);
    values.push(category);
  }
  if (q) {
    conditions.push(`(title ILIKE $${idx} OR content ILIKE $${idx} OR excerpt ILIKE $${idx})`);
    values.push(`%${q}%`);
    idx++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await pool.query(
    `SELECT * FROM posts ${where} ORDER BY created_at DESC`,
    values
  );
  return result.rows.map(rowToPost);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  await ensureDB();
  const result = await pool.query('SELECT * FROM posts WHERE slug = $1', [slug]);
  return result.rows[0] ? rowToPost(result.rows[0]) : undefined;
}

export async function createPost(data: {
  title: string;
  category: Category;
  content: string;
  emoji: string;
}): Promise<Post> {
  await ensureDB();

  const slug = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date();
  const date = now.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const excerpt =
    data.content
      .replace(/#{1,6}\s/g, '')
      .replace(/[*`\-]/g, '')
      .replace(/\n+/g, ' ')
      .trim()
      .slice(0, 120) + '...';

  const result = await pool.query(
    `INSERT INTO posts (slug, title, excerpt, content, category, emoji, date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [slug, data.title.trim(), excerpt, data.content, data.category, data.emoji || '📝', date]
  );
  return rowToPost(result.rows[0]);
}
