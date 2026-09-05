import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug } from '@/lib/posts';
import { categoryStyle, categoryJa } from '@/lib/categories';
import PostActions from './PostActions';

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const style = categoryStyle[post.category];

  const createdAt = new Date(post.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const updatedAt = new Date(post.updatedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const isEdited = post.createdAt !== post.updatedAt;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-rose-500 transition-colors mb-8"
      >
        ← 一覧に戻る
      </Link>

      {/* カバーバナー */}
      {post.coverImage ? (
        <div className="rounded-3xl overflow-hidden h-56 mb-10 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute bottom-5 left-5 text-5xl drop-shadow-sm">{post.emoji}</span>
        </div>
      ) : (
        <div
          className={`rounded-3xl bg-gradient-to-br ${style.cover} flex items-center justify-center h-56 mb-10 relative overflow-hidden`}
        >
          <span className="text-8xl drop-shadow-sm z-10">{post.emoji}</span>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/20 rounded-full" />
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/20 rounded-full" />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${style.color}`}>
            {categoryJa[post.category] ?? post.category}
          </span>
          <span className="text-sm text-stone-400">投稿日 {createdAt}</span>
          {isEdited && (
            <span className="text-xs text-stone-400">更新日 {updatedAt}</span>
          )}
        </div>
        <PostActions slug={slug} />
      </div>

      <h1
        className="text-3xl md:text-4xl font-bold text-stone-800 mb-4 leading-tight"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {post.title}
      </h1>

      <p className="text-stone-500 text-lg leading-relaxed mb-10 pb-10 border-b border-rose-100">
        {post.excerpt}
      </p>

      <div className="prose max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <h1 style={{ fontFamily: 'var(--font-playfair)' }}>{children}</h1>,
            h2: ({ children }) => <h2 style={{ fontFamily: 'var(--font-playfair)' }}>{children}</h2>,
            h3: ({ children }) => <h3 style={{ fontFamily: 'var(--font-playfair)' }}>{children}</h3>,
            img: ({ src, alt }) => {
              const s = typeof src === 'string' ? src : '';
              return s && /\.(mp4|webm|mov|avi|mkv)$/i.test(s) ? (
                <video src={s} controls className="max-w-full rounded-2xl my-4" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s || undefined} alt={alt ?? '画像'} className="max-w-full rounded-2xl my-4" />
              );
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      <div className="mt-14 pt-8 border-t border-rose-100 flex justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-500 text-white font-semibold text-sm hover:bg-rose-600 transition-colors"
        >
          🌸 他の記事を見る
        </Link>
      </div>
    </div>
  );
}
