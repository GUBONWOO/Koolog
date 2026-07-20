import Link from 'next/link';
import { Post } from '@/types/post';
import { categoryStyle, categoryJa } from '@/lib/categories';

export default function PostCard({ post }: { post: Post }) {
  const style = categoryStyle[post.category];

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-stone-100">
        <div
          className={`h-48 bg-gradient-to-br ${style.cover} flex items-center justify-center relative overflow-hidden`}
        >
          <span className="text-6xl drop-shadow-sm">{post.emoji}</span>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/20 rounded-full" />
          <div className="absolute -top-4 -left-4 w-14 h-14 bg-white/20 rounded-full" />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${style.color}`}
            >
              {categoryJa[post.category] ?? post.category}
            </span>
            <span className="text-xs text-stone-400">{post.date}</span>
          </div>
          <h3
            className="text-lg font-bold text-stone-800 mb-2 group-hover:text-rose-500 transition-colors leading-snug"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {post.title}
          </h3>
          <p className="text-sm text-stone-500 leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
          <div className="mt-4 flex justify-end">
            <span className="text-xs font-semibold text-rose-400 group-hover:text-rose-600 transition-colors">
              読む →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
