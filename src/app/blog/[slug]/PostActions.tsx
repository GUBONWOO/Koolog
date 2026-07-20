"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PostActions({ slug }: { slug: string }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleting(true);
    setPinError('');

    const verifyRes = await fetch('/api/secret-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    const { ok } = await verifyRes.json();

    if (!ok) {
      setPinError('パスワードが違います。');
      setDeleting(false);
      return;
    }

    const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      setPinError('削除中にエラーが発生しました。');
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Link
          href={`/blog/${slug}/edit`}
          className="px-3 py-1.5 rounded-full text-xs font-semibold text-stone-500 border border-stone-200 hover:border-stone-300 hover:text-stone-700 transition-colors"
        >
          ✏️ 編集
        </Link>
        <button
          onClick={() => setShowModal(true)}
          className="px-3 py-1.5 rounded-full text-xs font-semibold text-rose-400 border border-rose-200 hover:bg-rose-50 transition-colors"
        >
          🗑️ 削除
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-xl">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="text-lg font-bold text-stone-800">記事を削除しますか？</h3>
              <p className="text-sm text-stone-500 mt-1">削除すると元に戻せません。</p>
            </div>
            <form onSubmit={handleDelete} className="flex flex-col gap-3">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="パスワードを入力してください"
                className="w-full px-5 py-3 rounded-2xl border border-stone-200 text-stone-800 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                autoFocus
              />
              {pinError && <p className="text-sm text-rose-500">{pinError}</p>}
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setPin(''); setPinError(''); }}
                  className="flex-1 py-3 rounded-full border border-stone-200 text-stone-600 font-semibold text-sm hover:border-stone-300 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={deleting}
                  className="flex-1 py-3 rounded-full bg-rose-500 text-white font-semibold text-sm hover:bg-rose-600 disabled:opacity-50 transition-colors"
                >
                  {deleting ? '削除中...' : '削除'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
