"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types/post';
import { categoryStyle } from '@/lib/categories';

const WRITE_CATEGORIES: Category[] = ['요리', '공부', '잡동사니', '비밀폴더'];

const EMOJI_OPTIONS = [
  '📝', '🍳', '🍲', '🍜', '🍱', '🥗',
  '📚', '💡', '✏️', '🔥', '✨', '🗂️',
  '🔒', '🌸', '⚡', '🎨', '🚀', '😊',
];

export default function WritePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    category: '공부' as Category,
    emoji: '📝',
    content: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    if (!form.content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || '오류가 발생했어요.');
        return;
      }
      const post = await res.json();
      router.push(`/blog/${post.slug}`);
    } catch {
      setError('네트워크 오류가 발생했어요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="text-stone-400 hover:text-stone-600 transition-colors"
        >
          ←
        </button>
        <h1
          className="text-2xl font-bold text-stone-800"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          새 글 쓰기
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-7">
        {/* 카테고리 */}
        <div>
          <label className="text-sm font-semibold text-stone-600 mb-2.5 block">
            카테고리
          </label>
          <div className="flex flex-wrap gap-2">
            {WRITE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setForm({ ...form, category: cat })}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  form.category === cat
                    ? `${categoryStyle[cat].color} ring-2 ring-offset-1 ring-rose-200`
                    : 'bg-white border border-stone-200 text-stone-500 hover:border-stone-300'
                }`}
              >
                {cat === '비밀폴더' ? '🔒 비밀폴더' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* 이모지 */}
        <div>
          <label className="text-sm font-semibold text-stone-600 mb-2.5 block">
            이모지
          </label>
          <div className="flex flex-wrap gap-2">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setForm({ ...form, emoji })}
                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                  form.emoji === emoji
                    ? 'bg-rose-100 ring-2 ring-rose-400 scale-110'
                    : 'bg-stone-100 hover:bg-stone-200'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* 제목 */}
        <div>
          <label className="text-sm font-semibold text-stone-600 mb-2.5 block">
            제목
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="제목을 입력해 주세요"
            className="w-full px-5 py-3 rounded-2xl border border-stone-200 text-stone-800 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
          />
        </div>

        {/* 미리보기 배너 */}
        <div
          className={`rounded-2xl bg-gradient-to-br ${categoryStyle[form.category].cover} p-5 flex items-center gap-4`}
        >
          <span className="text-4xl">{form.emoji}</span>
          <div>
            <p className="text-xs text-white/70 font-semibold mb-1">미리보기</p>
            <p className="font-bold text-white leading-snug">
              {form.title || '제목이 여기에 표시돼요'}
            </p>
          </div>
        </div>

        {/* 내용 */}
        <div>
          <label className="text-sm font-semibold text-stone-600 mb-2.5 block">
            내용{' '}
            <span className="font-normal text-stone-400">(마크다운 지원)</span>
          </label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder={'# 제목\n\n내용을 마크다운으로 작성해요...\n\n## 소제목\n\n- 항목 1\n- 항목 2'}
            rows={18}
            className="w-full px-5 py-4 rounded-2xl border border-stone-200 text-stone-800 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 resize-none font-mono leading-relaxed transition-all"
          />
        </div>

        {error && (
          <p className="text-sm text-rose-500 bg-rose-50 px-4 py-3 rounded-xl">
            {error}
          </p>
        )}

        <div className="flex gap-3 pb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 rounded-full border border-stone-200 text-stone-600 font-semibold text-sm hover:border-stone-300 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3 rounded-full bg-rose-500 text-white font-semibold text-sm hover:bg-rose-600 disabled:opacity-50 transition-colors"
          >
            {submitting ? '저장 중...' : '게시하기 🌸'}
          </button>
        </div>
      </form>
    </div>
  );
}
