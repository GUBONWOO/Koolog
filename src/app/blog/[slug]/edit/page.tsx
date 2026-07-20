"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Category } from '@/types/post';
import { categoryStyle, categoryJa } from '@/lib/categories';

const WRITE_CATEGORIES: Category[] = ['요리', '공부', '잡동사니', '비밀폴더'];

const EMOJI_OPTIONS = [
  '📝', '🍳', '🍲', '🍜', '🍱', '🥗',
  '📚', '💡', '✏️', '🔥', '✨', '🗂️',
  '🔒', '🌸', '⚡', '🎨', '🚀', '😊',
];

export default function EditPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  const [pin, setPin] = useState('');
  const [pinVerified, setPinVerified] = useState(false);
  const [pinError, setPinError] = useState('');

  const [form, setForm] = useState({
    title: '',
    category: '공부' as Category,
    emoji: '📝',
    content: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then((r) => r.json())
      .then((post) => {
        setForm({
          title: post.title,
          category: post.category,
          emoji: post.emoji,
          content: post.content,
        });
        setLoading(false);
      })
      .catch(() => {
        setError('記事を読み込めませんでした。');
        setLoading(false);
      });
  }, [slug]);

  const verifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/secret-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    const data = await res.json();
    if (data.ok) {
      setPinVerified(true);
      setPinError('');
    } else {
      setPinError('パスワードが違います。');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('タイトルを入力してください。'); return; }
    if (!form.content.trim()) { setError('内容を入力してください。'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'エラーが発生しました。');
        return;
      }
      const post = await res.json();
      router.push(`/blog/${post.slug}`);
    } catch {
      setError('ネットワークエラーが発生しました。');
    } finally {
      setSubmitting(false);
    }
  };

  if (!pinVerified) {
    return (
      <div className="max-w-sm mx-auto px-6 py-24 flex flex-col items-center gap-6">
        <div className="text-5xl">🔑</div>
        <h2 className="text-xl font-bold text-stone-800">パスワード確認</h2>
        <form onSubmit={verifyPin} className="w-full flex flex-col gap-3">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="パスワードを入力してください"
            className="w-full px-5 py-3 rounded-2xl border border-stone-200 text-stone-800 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
          />
          {pinError && (
            <p className="text-sm text-rose-500">{pinError}</p>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-rose-500 text-white font-semibold text-sm hover:bg-rose-600 transition-colors"
          >
            確認
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center py-24 text-stone-400">読み込み中...</div>;
  }

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
          記事を編集
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-7">
        <div>
          <label className="text-sm font-semibold text-stone-600 mb-2.5 block">カテゴリ</label>
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
                {cat === '비밀폴더' ? `🔒 ${categoryJa['비밀폴더']}` : categoryJa[cat]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-stone-600 mb-2.5 block">絵文字</label>
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

        <div>
          <label className="text-sm font-semibold text-stone-600 mb-2.5 block">タイトル</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-5 py-3 rounded-2xl border border-stone-200 text-stone-800 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
          />
        </div>

        <div
          className={`rounded-2xl bg-gradient-to-br ${categoryStyle[form.category].cover} p-5 flex items-center gap-4`}
        >
          <span className="text-4xl">{form.emoji}</span>
          <div>
            <p className="text-xs text-white/70 font-semibold mb-1">プレビュー</p>
            <p className="font-bold text-white leading-snug">
              {form.title || 'タイトルがここに表示されます'}
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-stone-600 mb-2.5 block">
            内容 <span className="font-normal text-stone-400">(Markdown対応)</span>
          </label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={18}
            className="w-full px-5 py-4 rounded-2xl border border-stone-200 text-stone-800 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 resize-none font-mono leading-relaxed transition-all"
          />
        </div>

        {error && (
          <p className="text-sm text-rose-500 bg-rose-50 px-4 py-3 rounded-xl">{error}</p>
        )}

        <div className="flex gap-3 pb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 rounded-full border border-stone-200 text-stone-600 font-semibold text-sm hover:border-stone-300 transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3 rounded-full bg-rose-500 text-white font-semibold text-sm hover:bg-rose-600 disabled:opacity-50 transition-colors"
          >
            {submitting ? '保存中...' : '編集完了 ✏️'}
          </button>
        </div>
      </form>
    </div>
  );
}
