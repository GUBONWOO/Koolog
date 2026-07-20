import Link from "next/link";
import { Post } from "@/types/post";
import { categoryStyle } from "@/lib/categories";

export default function FeaturedPost({ post }: { post: Post }) {
  const style = categoryStyle[post.category];

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
        <div
          className={`bg-gradient-to-br ${style.cover} p-8 md:p-12 min-h-72 flex flex-col justify-between relative overflow-hidden`}
        >
          <div className="absolute top-6 right-8 text-7xl opacity-80">
            {post.emoji}
          </div>
          <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-white/15 rounded-full" />
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-white/15 rounded-full" />

          <div className="flex items-center gap-3 relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-white/80 text-rose-600 text-xs font-bold tracking-wide uppercase">
              ✨ 추천 글
            </span>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${style.color} bg-white/80`}>
              {post.category}
            </span>
          </div>

          <div className="relative z-10 mt-6 md:mt-0 max-w-xl">
            <h2
              className="text-2xl md:text-3xl font-bold text-stone-800 mb-3 group-hover:text-rose-700 transition-colors leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {post.title}
            </h2>
            <p className="text-stone-600 text-sm md:text-base leading-relaxed">
              {post.excerpt}
            </p>
            <div className="mt-5 flex items-center gap-4">
              <span className="text-xs text-stone-500">{post.date}</span>
              <span className="ml-auto text-sm font-bold text-rose-500 group-hover:text-rose-700 transition-colors">
                자세히 보기 →
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
