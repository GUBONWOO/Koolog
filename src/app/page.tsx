"use client";

import { useState } from "react";
import PostCard from "@/components/PostCard";
import FeaturedPost from "@/components/FeaturedPost";
import { posts, categories, getFeaturedPost, getPostsByCategory } from "@/lib/posts";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("전체");
  const featured = getFeaturedPost();
  const filteredPosts = getPostsByCategory(activeCategory).filter(
    (p) => !p.featured || activeCategory !== "전체"
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* 히어로 섹션 */}
      <section className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-sm font-semibold mb-5">
          <span>🌸</span>
          <span>프론트엔드 개발 이야기</span>
        </div>
        <h1
          className="text-4xl md:text-5xl font-bold text-stone-800 mb-4 leading-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          배운 것들을 기록하고
          <br />
          <span className="text-rose-500">나누는 공간이에요</span>
        </h1>
        <p className="text-stone-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Next.js, React, TypeScript 그리고 개발하면서 마주치는 크고 작은
          이야기들을 솔직하게 써내려가요.
        </p>
      </section>

      {/* 추천 글 */}
      {featured && activeCategory === "전체" && (
        <section className="mb-14">
          <FeaturedPost post={featured} />
        </section>
      )}

      {/* 카테고리 필터 */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-rose-300 hover:text-rose-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 포스트 그리드 */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20 text-stone-400">
            <span className="text-4xl block mb-4">📭</span>
            <p className="text-lg font-semibold">아직 글이 없어요</p>
          </div>
        )}
      </section>

      {/* 뉴스레터 배너 */}
      <section className="mt-20 rounded-3xl bg-gradient-to-br from-rose-400 to-pink-500 p-10 md:p-14 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 text-9xl opacity-10 select-none">
          🌸
        </div>
        <div className="absolute bottom-0 left-0 text-8xl opacity-10 select-none">
          ✨
        </div>
        <h2
          className="text-2xl md:text-3xl font-bold mb-3 relative z-10"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          새 글 알림 받기
        </h2>
        <p className="text-rose-100 mb-7 relative z-10">
          새로운 글이 올라올 때 이메일로 알려드릴게요. 스팸은 절대 없어요!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto relative z-10">
          <input
            type="email"
            placeholder="이메일 주소를 입력해 주세요"
            className="flex-1 px-5 py-3 rounded-full text-stone-800 text-sm font-medium outline-none focus:ring-2 focus:ring-white/50"
          />
          <button className="px-6 py-3 bg-white text-rose-500 rounded-full font-bold text-sm hover:bg-rose-50 transition-colors whitespace-nowrap">
            구독하기
          </button>
        </div>
      </section>
    </div>
  );
}
