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

        {/* 데스크탑 메뉴 */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-semibold text-stone-600 hover:text-rose-500 transition-colors"
          >
            홈
          </Link>
          <Link
            href="/about"
            className="text-sm font-semibold text-stone-600 hover:text-rose-500 transition-colors"
          >
            소개
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-stone-600 hover:text-rose-500 transition-colors"
          >
            GitHub
          </a>
          <Link
            href="/about"
            className="px-4 py-2 rounded-full bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors"
          >
            연락하기
          </Link>
        </nav>

        {/* 모바일 햄버거 */}
        <button
          className="md:hidden p-2 text-stone-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴 열기"
        >
          <div className="w-5 h-0.5 bg-current mb-1.5 transition-all" />
          <div className="w-5 h-0.5 bg-current mb-1.5 transition-all" />
          <div className="w-5 h-0.5 bg-current transition-all" />
        </button>
      </div>

      {/* 모바일 드롭다운 */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-rose-100 px-6 py-4 flex flex-col gap-4">
          <Link
            href="/"
            className="text-sm font-semibold text-stone-600"
            onClick={() => setMenuOpen(false)}
          >
            홈
          </Link>
          <Link
            href="/about"
            className="text-sm font-semibold text-stone-600"
            onClick={() => setMenuOpen(false)}
          >
            소개
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-stone-600"
          >
            GitHub
          </a>
        </div>
      )}
    </header>
  );
}
