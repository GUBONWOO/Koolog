import pool, { initDB } from './db';
import { Post, Category } from '@/types/post';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) {
    await initDB();
    dbReady = true;
  }
}

function firstImageInContent(content: string): string | undefined {
  return content.match(/!\[[^\]]*\]\(([^)]+)\)/)?.[1];
}

function rowToPost(row: Record<string, unknown>): Post {
  const content = row.content as string;
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    excerpt: row.excerpt as string,
    content,
    category: row.category as Category,
    emoji: row.emoji as string,
    coverImage: (row.cover_image as string) || firstImageInContent(content) || undefined,
    date: row.date as string,
    createdAt: (row.created_at as Date).toISOString(),
    updatedAt: (row.updated_at as Date).toISOString(),
  };
}

function makeExcerpt(content: string): string {
  return (
    content
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/[*`\-]/g, '')
      .replace(/\n+/g, ' ')
      .trim()
      .slice(0, 120) + '...'
  );
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
  coverImage?: string;
}): Promise<Post> {
  await ensureDB();

  const slug = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date();
  const date = now.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const excerpt = makeExcerpt(data.content);

  const result = await pool.query(
    `INSERT INTO posts (slug, title, excerpt, content, category, emoji, cover_image, date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [slug, data.title.trim(), excerpt, data.content, data.category, data.emoji || '📝', data.coverImage || null, date]
  );
  return rowToPost(result.rows[0]);
}

export async function updatePost(
  slug: string,
  data: { title: string; category: Category; content: string; emoji: string; coverImage?: string }
): Promise<Post | undefined> {
  await ensureDB();

  const excerpt = makeExcerpt(data.content);

  const result = await pool.query(
    `UPDATE posts
     SET title = $1, excerpt = $2, content = $3, category = $4, emoji = $5, cover_image = $6
     WHERE slug = $7
     RETURNING *`,
    [data.title.trim(), excerpt, data.content, data.category, data.emoji || '📝', data.coverImage || null, slug]
  );
  return result.rows[0] ? rowToPost(result.rows[0]) : undefined;
}

export async function deletePost(slug: string): Promise<boolean> {
  await ensureDB();
  const result = await pool.query('DELETE FROM posts WHERE slug = $1', [slug]);
  return (result.rowCount ?? 0) > 0;
}
