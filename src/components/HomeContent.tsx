"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import PostCard from '@/components/PostCard';
import { CATEGORIES, categoryJa, categoryJaToKorean } from '@/lib/categories';
import { Post } from '@/types/post';

export default function HomeContent() {
  const searchParams = useSearchParams();

  // URL에는 일본어 값이 들어옴 (ex: ?category=料理)
  const categoryParam = searchParams.get('category') || '';
  // API 쿼리는 한국어 내부값 사용
  const category = categoryJaToKorean[categoryParam] || '전체';
  const q = searchParams.get('q') || '';

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(q);

  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const pinRef = useRef<HTMLInputElement>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== '전체') params.set('category', category);
    if (q) params.set('q', q);
    const res = await fetch(`/api/posts?${params}`);
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }, [category, q]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  useEffect(() => {
    if (showPinModal) {
      setTimeout(() => pinRef.current?.focus(), 50);
    }
  }, [showPinModal]);

  // URL에 일본어 파라미터를 사용하는 href 생성
  const getCategoryHref = (cat: string) => {
    if (cat === '전체') return '/';
    return `/?category=${encodeURIComponent(categoryJa[cat])}`;
  };

  // 비밀폴더는 PIN 체크가 필요해서 버튼으로 처리
  const handleSecretClick = () => {
    const unlocked = sessionStorage.getItem('secret-unlocked') === 'true';
    if (!unlocked) {
      setShowPinModal(true);
      setPinInput('');
      setPinError(false);
    } else {
      window.location.href = getCategoryHref('비밀폴더');
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/secret-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: pinInput }),
    });
    if (res.ok) {
      sessionStorage.setItem('secret-unlocked', 'true');
      setShowPinModal(false);
      window.location.href = getCategoryHref('비밀폴더');
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category !== '전체') params.set('category', categoryJa[category]);
    if (searchInput) params.set('q', searchInput);
    const qs = params.toString();
    window.location.href = qs ? `/?${qs}` : '/';
  };

  const handleResetSearch = () => {
    setSearchInput('');
    const params = new URLSearchParams();
    if (category !== '전체') params.set('category', categoryJa[category]);
    window.location.href = params.toString() ? `/?${params}` : '/';
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* ヒーロー */}
      <section className="text-center mb-12">
        <h1
          className="text-4xl md:text-5xl font-bold text-stone-800 mb-4 leading-tight"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          記録して
          <br />
          <span className="text-rose-500">分かち合う空間</span>
        </h1>
        <p className="text-stone-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          料理、勉強、日常のあれこれを正直に綴ります。
        </p>
      </section>

      {/* 検索 */}
      <form
        onSubmit={handleSearch}
        className="mb-8 flex gap-2 max-w-md mx-auto md:mx-0"
      >
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="キーワードを入力してください"
          className="flex-1 px-5 py-2.5 rounded-full border border-stone-200 text-sm text-stone-800 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 bg-white"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-full bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors"
        >
          検索
        </button>
        {q && (
          <button
            type="button"
            onClick={handleResetSearch}
            className="px-4 py-2.5 rounded-full border border-stone-200 text-stone-500 text-sm hover:border-stone-300 transition-colors"
          >
            リセット
          </button>
        )}
      </form>

      {/* カテゴリフィルター */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat;
            const baseClass = `px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200`;
            const activeClass = 'bg-rose-500 text-white shadow-md shadow-rose-200';
            const inactiveClass = 'bg-white text-stone-600 border border-stone-200 hover:border-rose-300 hover:text-rose-500';

            if (cat === '비밀폴더') {
              return (
                <button
                  key={cat}
                  onClick={handleSecretClick}
                  className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                  🔒 {categoryJa['비밀폴더']}
                </button>
              );
            }

            return (
              <Link
                key={cat}
                href={getCategoryHref(cat)}
                className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                {categoryJa[cat]}
              </Link>
            );
          })}
        </div>
      </section>

      {/* 検索結果表示 */}
      {q && (
        <p className="text-sm text-stone-400 mb-4">
          &quot;{q}&quot; の検索結果 {posts.length}件
        </p>
      )}

      {/* 投稿グリッド */}
      <section>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl h-72 animate-pulse border border-stone-100"
              />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-stone-400">
            <span className="text-4xl block mb-4">📭</span>
            <p className="text-lg font-semibold">
              {q ? `「${q}」の検索結果はありません` : 'まだ記事がありません'}
            </p>
          </div>
        )}
      </section>

      {/* 秘密フォルダ PINモーダル */}
      {showPinModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowPinModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 w-80 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <span className="text-5xl block mb-3">🔒</span>
              <h2 className="text-lg font-bold text-stone-800">秘密フォルダ</h2>
              <p className="text-sm text-stone-400 mt-1">PINを入力してください</p>
            </div>
            <form onSubmit={handlePinSubmit} className="flex flex-col gap-3">
              <input
                ref={pinRef}
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="• • • •"
                maxLength={8}
                className={`w-full px-5 py-3 rounded-2xl border text-center text-stone-800 text-lg tracking-widest outline-none transition-colors ${
                  pinError
                    ? 'border-rose-400 bg-rose-50 focus:ring-rose-200'
                    : 'border-stone-200 focus:border-rose-300 focus:ring-rose-100'
                } focus:ring-2`}
              />
              {pinError && (
                <p className="text-xs text-rose-500 text-center">PINが違います</p>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-rose-500 text-white font-semibold text-sm hover:bg-rose-600 transition-colors"
              >
                確認
              </button>
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="w-full py-2.5 rounded-full border border-stone-200 text-stone-500 text-sm hover:border-stone-300 transition-colors"
              >
                キャンセル
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
