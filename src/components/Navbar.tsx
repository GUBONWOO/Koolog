"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🌸</span>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            <span className="text-rose-500">koolog</span>
          </span>
        </Link>

        {/* デスクトップメニュー */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-semibold text-stone-600 hover:text-rose-500 transition-colors"
          >
            ホーム
          </Link>
          <Link
            href="/about"
            className="text-sm font-semibold text-stone-600 hover:text-rose-500 transition-colors"
          >
            紹介
          </Link>
          <Link
            href="/write"
            className="px-4 py-2 rounded-full bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors"
          >
            ✏️ 書く
          </Link>
        </nav>

        {/* モバイルハンバーガー */}
        <button
          className="md:hidden p-2 text-stone-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニューを開く"
        >
          <div className="w-5 h-0.5 bg-current mb-1.5 transition-all" />
          <div className="w-5 h-0.5 bg-current mb-1.5 transition-all" />
          <div className="w-5 h-0.5 bg-current transition-all" />
        </button>
      </div>

      {/* モバイルドロップダウン */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-rose-100 px-6 py-4 flex flex-col gap-4">
          <Link
            href="/"
            className="text-sm font-semibold text-stone-600"
            onClick={() => setMenuOpen(false)}
          >
            ホーム
          </Link>
          <Link
            href="/about"
            className="text-sm font-semibold text-stone-600"
            onClick={() => setMenuOpen(false)}
          >
            紹介
          </Link>
          <Link
            href="/write"
            className="text-sm font-semibold text-rose-500"
            onClick={() => setMenuOpen(false)}
          >
            ✏️ 書く
          </Link>
        </div>
      )}
    </header>
  );
}
