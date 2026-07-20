import Link from "next/link";

const skills = [
  { name: "React / Next.js", color: "bg-rose-100 text-rose-600" },
  { name: "TypeScript", color: "bg-sky-100 text-sky-600" },
  { name: "Tailwind CSS", color: "bg-violet-100 text-violet-600" },
  { name: "Node.js", color: "bg-green-100 text-green-600" },
  { name: "Figma", color: "bg-amber-100 text-amber-600" },
  { name: "Git / GitHub", color: "bg-stone-100 text-stone-600" },
];

const timeline = [
  {
    year: "2024",
    title: "koolog スタート",
    desc: "学んだことを記録・共有するためにブログを作りました。",
    emoji: "🌸",
  },
  {
    year: "2023",
    title: "フリーランスフロントエンド開発",
    desc: "様々なプロジェクトを通して実践経験を積みました。",
    emoji: "💻",
  },
  {
    year: "2022",
    title: "開発スタート",
    desc: "HTML/CSSから始めて、Reactにはまりました。",
    emoji: "🚀",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      {/* プロフィールヘッダー */}
      <section className="text-center mb-16">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center text-5xl mx-auto mb-6 shadow-lg shadow-rose-200">
          👩‍💻
        </div>
        <h1
          className="text-3xl md:text-4xl font-bold text-stone-800 mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          はじめまして、<span className="text-rose-500">gubonwoo</span>です！
        </h1>
        <p className="text-stone-500 text-base leading-relaxed max-w-lg mx-auto">
          美しいインターフェースを作るのが好きなフロントエンドエンジニアです。
          学んだことを整理して共有するのを楽しんでいます。
        </p>

        <div className="flex items-center justify-center gap-4 mt-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-stone-800 text-white text-sm font-semibold hover:bg-stone-700 transition-colors"
          >
            GitHub
          </a>
          <a
            href="mailto:zcwxzsx@gmail.com"
            className="px-5 py-2.5 rounded-full border-2 border-rose-300 text-rose-500 text-sm font-semibold hover:bg-rose-50 transition-colors"
          >
            メールを送る
          </a>
        </div>
      </section>

      {/* ブログ紹介 */}
      <section className="mb-14">
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8">
          <h2
            className="text-xl font-bold text-stone-800 mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            このブログについて 🌸
          </h2>
          <div className="space-y-3 text-stone-600 leading-relaxed">
            <p>
              開発中に出会う大小様々な問題、新しく学んだ概念、そして試行錯誤の記録を正直に残しています。
            </p>
            <p>
              完璧な記事を書こうと長く待つより、今知っていることを素早くまとめるスタイルです。
            </p>
            <p>
              誰かの役に立てば嬉しいですし、少なくとも未来の自分が感謝してくれる記録を残したいと思っています。
            </p>
          </div>
        </div>
      </section>

      {/* 技術スタック */}
      <section className="mb-14">
        <h2
          className="text-xl font-bold text-stone-800 mb-5"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          よく使う技術 ⚡
        </h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill.name}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${skill.color}`}
            >
              {skill.name}
            </span>
          ))}
        </div>
      </section>

      {/* タイムライン */}
      <section className="mb-14">
        <h2
          className="text-xl font-bold text-stone-800 mb-6"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          歩んできた道 📍
        </h2>
        <div className="space-y-4">
          {timeline.map((item) => (
            <div
              key={item.year}
              className="flex gap-5 bg-white rounded-2xl p-5 border border-stone-100 hover:border-rose-200 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-xl">
                {item.emoji}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                    {item.year}
                  </span>
                  <span className="font-bold text-stone-800 text-sm">
                    {item.title}
                  </span>
                </div>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl bg-gradient-to-br from-violet-400 to-purple-500 p-10 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 text-8xl opacity-10 select-none">
          💌
        </div>
        <h2
          className="text-2xl font-bold mb-3 relative z-10"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          一緒に話しましょう
        </h2>
        <p className="text-violet-100 mb-6 relative z-10">
          気になることや記事への感想があれば、気軽に連絡してください！
        </p>
        <a
          href="mailto:zcwxzsx@gmail.com"
          className="inline-block px-8 py-3 bg-white text-violet-600 rounded-full font-bold text-sm hover:bg-violet-50 transition-colors relative z-10"
        >
          メールを送る ✉️
        </a>
      </section>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="text-sm font-semibold text-stone-500 hover:text-rose-500 transition-colors"
        >
          ← ブログに戻る
        </Link>
      </div>
    </div>
  );
}
