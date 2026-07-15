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
    title: "koolog 시작",
    desc: "배운 것들을 기록하고 나누기 위해 블로그를 만들었어요.",
    emoji: "🌸",
  },
  {
    year: "2023",
    title: "프리랜서 프론트엔드 개발",
    desc: "다양한 프로젝트를 통해 실전 경험을 쌓았어요.",
    emoji: "💻",
  },
  {
    year: "2022",
    title: "개발 시작",
    desc: "HTML/CSS로 시작해서 React에 빠져들었어요.",
    emoji: "🚀",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      {/* 프로필 헤더 */}
      <section className="text-center mb-16">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center text-5xl mx-auto mb-6 shadow-lg shadow-rose-200">
          👩‍💻
        </div>
        <h1
          className="text-3xl md:text-4xl font-bold text-stone-800 mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          안녕하세요, <span className="text-rose-500">gubonwoo</span>예요!
        </h1>
        <p className="text-stone-500 text-base leading-relaxed max-w-lg mx-auto">
          아름다운 인터페이스를 만드는 걸 좋아하는 프론트엔드 개발자예요.
          배운 것을 정리하고 나누는 걸 즐겨요.
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
            이메일 보내기
          </a>
        </div>
      </section>

      {/* 소개 */}
      <section className="mb-14">
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8">
          <h2
            className="text-xl font-bold text-stone-800 mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            이 블로그는요 🌸
          </h2>
          <div className="space-y-3 text-stone-600 leading-relaxed">
            <p>
              개발하면서 마주치는 크고 작은 문제들, 새로 배운 개념들, 그리고
              삽질의 흔적들을 솔직하게 기록해요.
            </p>
            <p>
              완벽한 글을 쓰려고 오래 기다리기보다는, 지금 알고 있는 것들을
              빠르게 정리하는 편이에요.
            </p>
            <p>
              누군가에게 도움이 된다면 더할 나위 없이 좋고, 최소한 미래의
              제가 고마워할 기록을 남기려 해요.
            </p>
          </div>
        </div>
      </section>

      {/* 기술 스택 */}
      <section className="mb-14">
        <h2
          className="text-xl font-bold text-stone-800 mb-5"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          주로 쓰는 기술 ⚡
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

      {/* 타임라인 */}
      <section className="mb-14">
        <h2
          className="text-xl font-bold text-stone-800 mb-6"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          걸어온 길 📍
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
          같이 이야기해요
        </h2>
        <p className="text-violet-100 mb-6 relative z-10">
          궁금한 게 있거나, 글에 대한 의견이 있으면 편하게 연락해 주세요!
        </p>
        <a
          href="mailto:zcwxzsx@gmail.com"
          className="inline-block px-8 py-3 bg-white text-violet-600 rounded-full font-bold text-sm hover:bg-violet-50 transition-colors relative z-10"
        >
          이메일 보내기 ✉️
        </a>
      </section>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="text-sm font-semibold text-stone-500 hover:text-rose-500 transition-colors"
        >
          ← 블로그로 돌아가기
        </Link>
      </div>
    </div>
  );
}
