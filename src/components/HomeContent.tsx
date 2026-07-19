"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import PostCard from '@/components/PostCard';
import { CATEGORIES } from '@/lib/categories';
import { Post } from '@/types/post';

export default function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get('category') || '전체';
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

  const navigate = (cat: string, newQ?: string) => {
    const params = new URLSearchParams();
    if (cat !== '전체') params.set('category', cat);
    const query = newQ !== undefined ? newQ : q;
    if (query) params.set('q', query);
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : '/');
  };

  const handleCategoryClick = (cat: string) => {
    if (cat === '비밀폴더') {
      const unlocked = sessionStorage.getItem('secret-unlocked') === 'true';
      if (!unlocked) {
        setShowPinModal(true);
        setPinInput('');
        setPinError(false);
        return;
      }
    }
    navigate(cat);
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
      navigate('비밀폴더');
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(category, searchInput);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* 히어로 */}
      <section className="text-center mb-12">
        <h1
          className="text-4xl md:text-5xl font-bold text-stone-800 mb-4 leading-tight"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          기록하고
          <br />
          <span className="text-rose-500">나누는 공간이에요</span>
        </h1>
        <p className="text-stone-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          요리, 공부, 소소한 일상까지 솔직하게 써내려가요.
        </p>
      </section>

      {/* 검색 */}
      <form
        onSubmit={handleSearch}
        className="mb-8 flex gap-2 max-w-md mx-auto md:mx-0"
      >
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="검색어를 입력해 주세요"
          className="flex-1 px-5 py-2.5 rounded-full border border-stone-200 text-sm text-stone-800 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 bg-white"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-full bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors"
        >
          검색
        </button>
        {q && (
          <button
            type="button"
            onClick={() => {
              setSearchInput('');
              navigate(category, '');
            }}
            className="px-4 py-2.5 rounded-full border border-stone-200 text-stone-500 text-sm hover:border-stone-300 transition-colors"
          >
            초기화
          </button>
        )}
      </form>

      {/* 카테고리 필터 */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                category === cat
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-rose-300 hover:text-rose-500'
              }`}
            >
              {cat === '비밀폴더' ? '🔒 비밀폴더' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* 검색 결과 표시 */}
      {q && (
        <p className="text-sm text-stone-400 mb-4">
          &quot;{q}&quot; 검색 결과 {posts.length}개
        </p>
      )}

      {/* 포스트 그리드 */}
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
              {q ? `'${q}' 검색 결과가 없어요` : '아직 글이 없어요'}
            </p>
          </div>
        )}
      </section>

      {/* 비밀폴더 PIN 모달 */}
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
              <h2 className="text-lg font-bold text-stone-800">비밀폴더</h2>
              <p className="text-sm text-stone-400 mt-1">PIN을 입력해 주세요</p>
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
                <p className="text-xs text-rose-500 text-center">PIN이 틀렸어요</p>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-rose-500 text-white font-semibold text-sm hover:bg-rose-600 transition-colors"
              >
                확인
              </button>
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="w-full py-2.5 rounded-full border border-stone-200 text-stone-500 text-sm hover:border-stone-300 transition-colors"
              >
                취소
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
