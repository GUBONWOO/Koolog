import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, posts } from "@/lib/posts";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const lines = post.content.trim().split("\n");

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* 뒤로가기 */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-rose-500 transition-colors mb-8"
      >
        ← 목록으로
      </Link>

      {/* 커버 */}
      <div
        className={`rounded-3xl bg-gradient-to-br ${post.coverColor} flex items-center justify-center h-56 mb-10 relative overflow-hidden`}
      >
        <span className="text-8xl drop-shadow-sm z-10">{post.emoji}</span>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/20 rounded-full" />
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/20 rounded-full" />
      </div>

      {/* 메타 정보 */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${post.categoryColor}`}
        >
          {post.category}
        </span>
        <span className="text-sm text-stone-400">{post.date}</span>
        <span className="text-stone-300">·</span>
        <span className="text-sm text-stone-400">{post.readTime} 읽기</span>
      </div>

      {/* 제목 */}
      <h1
        className="text-3xl md:text-4xl font-bold text-stone-800 mb-4 leading-tight"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {post.title}
      </h1>

      <p className="text-stone-500 text-lg leading-relaxed mb-10 pb-10 border-b border-rose-100">
        {post.excerpt}
      </p>

      {/* 본문 */}
      <div className="prose max-w-none">
        {lines.map((line, i) => {
          if (line.startsWith("# ")) {
            return (
              <h1 key={i} style={{ fontFamily: "var(--font-playfair)" }}>
                {line.slice(2)}
              </h1>
            );
          }
          if (line.startsWith("## ")) {
            return (
              <h2 key={i} style={{ fontFamily: "var(--font-playfair)" }}>
                {line.slice(3)}
              </h2>
            );
          }
          if (line.startsWith("### ")) {
            return (
              <h3 key={i} style={{ fontFamily: "var(--font-playfair)" }}>
                {line.slice(4)}
              </h3>
            );
          }
          if (line.startsWith("- ")) {
            return (
              <ul key={i}>
                <li>{line.slice(2)}</li>
              </ul>
            );
          }
          if (line.startsWith("```")) {
            return null;
          }
          if (line.trim() === "") return <br key={i} />;
          return <p key={i}>{line}</p>;
        })}
      </div>

      {/* 하단 네비게이션 */}
      <div className="mt-14 pt-8 border-t border-rose-100 flex justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-500 text-white font-semibold text-sm hover:bg-rose-600 transition-colors"
        >
          🌸 다른 글 보기
        </Link>
      </div>
    </div>
  );
}
