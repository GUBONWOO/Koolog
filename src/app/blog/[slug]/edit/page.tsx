"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Category } from '@/types/post';
import { categoryStyle, categoryJa } from '@/lib/categories';

const WRITE_CATEGORIES: Category[] = ['요리', '공부', '잡동사니', '비밀폴더'];

const EMOJI_OPTIONS = [
  '📝', '🍳', '🍲', '🍜', '🍱', '🥗',
  '📚', '💡', '✏️', '🔥', '✨', '🗂️',
  '🔒', '🌸', '⚡', '🎨', '🚀', '😊',
];

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

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

  // 커버 소스를 분리 관리 — YouTube가 항상 우선
  const [ytUrl, setYtUrl] = useState('');
  const [ytCoverId, setYtCoverId] = useState('');
  const [uploadedCover, setUploadedCover] = useState('');

  const firstContentImage = form.content.match(/!\[[^\]]*\]\(([^)]+)\)/)?.[1];
  const coverImage = ytCoverId
    ? `https://img.youtube.com/vi/${ytCoverId}/maxresdefault.jpg`
    : uploadedCover || firstContentImage || '';

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imageMenu, setImageMenu] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlFetching, setUrlFetching] = useState(false);
  const [error, setError] = useState('');

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then((r) => r.json())
      .then((post) => {
        setForm({ title: post.title, category: post.category, emoji: post.emoji, content: post.content });
        // 저장된 커버가 YouTube 썸네일인지 업로드 사진인지 감지
        const savedCover: string = post.coverImage || '';
        const ytMatch = savedCover.match(/img\.youtube\.com\/vi\/([a-zA-Z0-9_-]{11})\//);
        if (ytMatch) {
          setYtCoverId(ytMatch[1]);
        } else if (savedCover) {
          setUploadedCover(savedCover);
        }
        setLoading(false);
      })
      .catch(() => { setError('記事を読み込めませんでした。'); setLoading(false); });
  }, [slug]);

  const insertAtCursor = (insertText: string) => {
    const ta = textareaRef.current;
    if (!ta || document.activeElement !== ta) {
      setForm(prev => ({ ...prev, content: prev.content + insertText }));
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    setForm(prev => ({
      ...prev,
      content: prev.content.slice(0, start) + insertText + prev.content.slice(end),
    }));
    setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + insertText.length; ta.focus(); }, 0);
  };

  const uploadFile = async (file: File, target: 'content' | 'cover' = 'content') => {
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) { const d = await res.json(); setError(d.error || 'アップロードに失敗しました。'); return; }
      const { url } = await res.json();
      if (target === 'cover') {
        setUploadedCover(url);
      } else {
        insertAtCursor(`\n![メディア](${url})\n`);
      }
    } catch { setError('ネットワークエラーが発生しました。'); }
    finally { setUploading(false); }
  };

  const handleUrlFetch = async () => {
    if (!urlInput.trim()) return;
    setUrlFetching(true);
    setError('');
    try {
      const res = await fetch('/api/upload/from-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || '画像の取得に失敗しました。'); return; }
      const { url } = await res.json();
      insertAtCursor(`\n![画像](${url})\n`);
      setUrlInput('');
    } catch { setError('ネットワークエラーが発生しました。'); }
    finally { setUrlFetching(false); }
  };

  const handleMediaInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadFile(file, 'content');
    e.target.value = '';
  };

  const handleCoverInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadFile(file, 'cover');
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  const handleYtUrl = (url: string) => {
    setYtUrl(url);
    const id = getYouTubeId(url);
    setYtCoverId(id || '');
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('画像または動画ファイルのみアップロードできます。'); return;
    }
    await uploadFile(file, 'content');
  };

  const verifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/secret-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    const data = await res.json();
    if (data.ok) { setPinVerified(true); setPinError(''); }
    else { setPinError('パスワードが違います。'); }
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
        body: JSON.stringify({ ...form, coverImage: coverImage || undefined }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || 'エラーが発生しました。'); return; }
      const post = await res.json();
      router.push(`/blog/${post.slug}`);
      router.refresh();
    } catch { setError('ネットワークエラーが発生しました。'); }
    finally { setSubmitting(false); }
  };

  if (!pinVerified) {
    return (
      <div className="max-w-sm mx-auto px-6 py-24 flex flex-col items-center gap-6">
        <div className="text-5xl">🔑</div>
        <h2 className="text-xl font-bold text-stone-800">パスワード確認</h2>
        <form onSubmit={verifyPin} className="w-full flex flex-col gap-3">
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)}
            placeholder="パスワードを入力してください"
            className="w-full px-5 py-3 rounded-2xl border border-stone-200 text-stone-800 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all" />
          {pinError && <p className="text-sm text-rose-500">{pinError}</p>}
          <button type="submit" className="w-full py-3 rounded-full bg-rose-500 text-white font-semibold text-sm hover:bg-rose-600 transition-colors">確認</button>
        </form>
      </div>
    );
  }

  if (loading) return <div className="flex justify-center py-24 text-stone-400">読み込み中...</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.back()} className="text-stone-400 hover:text-stone-600 transition-colors">←</button>
        <h1 className="text-2xl font-bold text-stone-800" style={{ fontFamily: 'var(--font-playfair)' }}>記事を編集</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-7">
        {/* カテゴリ */}
        <div>
          <label className="text-sm font-semibold text-stone-600 mb-2.5 block">カテゴリ</label>
          <div className="flex flex-wrap gap-2">
            {WRITE_CATEGORIES.map((cat) => (
              <button key={cat} type="button" onClick={() => setForm({ ...form, category: cat })}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  form.category === cat
                    ? `${categoryStyle[cat].color} ring-2 ring-offset-1 ring-rose-200`
                    : 'bg-white border border-stone-200 text-stone-500 hover:border-stone-300'
                }`}>
                {cat === '비밀폴더' ? `🔒 ${categoryJa['비밀폴더']}` : categoryJa[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* 絵文字 */}
        <div>
          <label className="text-sm font-semibold text-stone-600 mb-2.5 block">絵文字</label>
          <div className="flex flex-wrap gap-2">
            {EMOJI_OPTIONS.map((emoji) => (
              <button key={emoji} type="button" onClick={() => setForm({ ...form, emoji })}
                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                  form.emoji === emoji ? 'bg-rose-100 ring-2 ring-rose-400 scale-110' : 'bg-stone-100 hover:bg-stone-200'
                }`}>
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* タイトル */}
        <div>
          <label className="text-sm font-semibold text-stone-600 mb-2.5 block">タイトル</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-5 py-3 rounded-2xl border border-stone-200 text-stone-800 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all" />
        </div>

        {/* プレビューバナー — 優先度: YouTube > アップロード写真 > 絵文字 */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-sm font-semibold text-stone-600">プレビュー</label>
            <div className="flex items-center gap-3">
              {ytCoverId && <span className="text-xs text-red-500 font-semibold">▶ YouTube優先中</span>}
              {(ytCoverId || uploadedCover) && (
                <button type="button"
                  onClick={() => { setYtCoverId(''); setYtUrl(''); setUploadedCover(''); }}
                  className="text-xs text-stone-400 hover:text-rose-500 transition-colors">
                  写真を削除
                </button>
              )}
            </div>
          </div>

          <button type="button" onClick={() => coverInputRef.current?.click()} disabled={uploading}
            className={`w-full rounded-2xl overflow-hidden relative group ${coverImage ? 'h-56' : ''}`}>
            {coverImage ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverImage} alt="cover" className="w-full h-56 object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-5 text-left">
                  <p className="font-bold text-white leading-snug text-base">
                    {form.title || 'タイトルがここに表示されます'}
                  </p>
                </div>
              </>
            ) : (
              <div className={`bg-gradient-to-br ${categoryStyle[form.category].cover} p-5 flex items-center gap-4`}>
                <span className="text-4xl">{form.emoji}</span>
                <div className="text-left">
                  <p className="text-xs text-white/70 font-semibold mb-1">プレビュー</p>
                  <p className="font-bold text-white leading-snug">{form.title || 'タイトルがここに表示されます'}</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-black/50 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-opacity">
                {uploading ? '⏳ アップロード中...' : '📷 カバー写真を変更'}
              </span>
            </div>
          </button>
          <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverInput} />

          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-400 whitespace-nowrap">▶ YouTube</span>
            <input type="text" value={ytUrl} onChange={(e) => handleYtUrl(e.target.value)}
              placeholder="URLを貼り付けるとサムネイルをカバーに設定（最優先）"
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-200 outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-100 text-stone-600 placeholder:text-stone-300 transition-all" />
          </div>
        </div>

        {/* 内容 + メディアツールバー */}
        <div>
          <label className="text-sm font-semibold text-stone-600 mb-2.5 block">
            内容 <span className="font-normal text-stone-400">(Markdown対応)</span>
          </label>

          {/* ツールバー */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-stone-50 border border-stone-200 border-b-0 rounded-t-2xl">
            <div className="relative">
              <button type="button" disabled={uploading || urlFetching}
                onClick={() => { setImageMenu(m => !m); setUrlMode(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-rose-300 hover:bg-rose-50 text-stone-600 hover:text-rose-600 text-xs font-semibold transition-all shadow-sm disabled:opacity-50">
                📷 画像
              </button>
              {imageMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setImageMenu(false)} />
                  <div className="absolute top-full left-0 mt-1.5 z-20 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden min-w-36">
                    <button type="button"
                      onClick={() => { setImageMenu(false); imageInputRef.current?.click(); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 transition-colors">
                      📁 파일에서 선택
                    </button>
                    <div className="border-t border-stone-100" />
                    <button type="button"
                      onClick={() => { setImageMenu(false); setUrlMode(true); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 transition-colors">
                      🔗 URLから取得
                    </button>
                  </div>
                </>
              )}
            </div>

            <button type="button" disabled={uploading || urlFetching}
              onClick={() => videoInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-rose-300 hover:bg-rose-50 text-stone-600 hover:text-rose-600 text-xs font-semibold transition-all shadow-sm disabled:opacity-50">
              🎬 動画
            </button>

            {(uploading || urlFetching) && (
              <span className="text-xs text-rose-400 font-semibold animate-pulse">⏳ 処理中...</span>
            )}
            <span className="ml-auto text-xs text-stone-300 hidden sm:block">ドラッグ＆ドロップでも追加</span>
          </div>

          {urlMode && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50/50 border-x border-stone-200">
              <span className="text-xs text-stone-400 whitespace-nowrap">🔗</span>
              <input type="text" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlFetch()}
                placeholder="画像のURLを貼り付け..."
                autoFocus
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-200 outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-100 bg-white text-stone-600 transition-all" />
              <button type="button" onClick={handleUrlFetch}
                disabled={urlFetching || !urlInput.trim()}
                className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 disabled:opacity-50 transition-colors whitespace-nowrap">
                {urlFetching ? '⏳' : '取得'}
              </button>
              <button type="button" onClick={() => { setUrlMode(false); setUrlInput(''); }}
                className="text-stone-400 hover:text-stone-600 text-sm px-1 transition-colors">✕</button>
            </div>
          )}

          <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleMediaInput} />
          <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleMediaInput} />

          <div className={`relative transition-all ${isDragging ? 'ring-2 ring-rose-400' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}>
            {isDragging && (
              <div className="absolute inset-0 bg-rose-50/90 flex items-center justify-center z-10 pointer-events-none border-2 border-dashed border-rose-300 rounded-b-2xl">
                <p className="text-rose-500 font-semibold text-sm">ここにドロップ</p>
              </div>
            )}
            <textarea ref={textareaRef} value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              onPaste={async (e) => {
                const items = Array.from(e.clipboardData.items);
                const imageItem = items.find(i => i.type.startsWith('image/'));
                if (imageItem) {
                  e.preventDefault();
                  const file = imageItem.getAsFile();
                  if (file) await uploadFile(file, 'content');
                }
              }}
              rows={18}
              className="w-full px-5 py-4 rounded-b-2xl border border-stone-200 text-stone-800 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 resize-none font-mono leading-relaxed transition-all" />
          </div>
        </div>

        {error && <p className="text-sm text-rose-500 bg-rose-50 px-4 py-3 rounded-xl">{error}</p>}

        <div className="flex gap-3 pb-6">
          <button type="button" onClick={() => router.back()}
            className="flex-1 py-3 rounded-full border border-stone-200 text-stone-600 font-semibold text-sm hover:border-stone-300 transition-colors">
            キャンセル
          </button>
          <button type="submit" disabled={submitting}
            className="flex-1 py-3 rounded-full bg-rose-500 text-white font-semibold text-sm hover:bg-rose-600 disabled:opacity-50 transition-colors">
            {submitting ? '保存中...' : '編集完了 ✏️'}
          </button>
        </div>
      </form>
    </div>
  );
}
