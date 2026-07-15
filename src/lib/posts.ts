import { Post } from "@/types/post";

export const posts: Post[] = [
  {
    slug: "next-js-15-app-router",
    title: "Next.js 15 App Router 완벽 가이드",
    excerpt:
      "App Router의 핵심 개념부터 실전 패턴까지. Server Component와 Client Component를 언제, 어떻게 써야 하는지 정리했어요.",
    content: `
# Next.js 15 App Router 완벽 가이드

App Router가 처음 나왔을 때 솔직히 헷갈렸어요. Pages Router에 익숙해져 있었거든요. 근데 써보니까 확실히 다르더라고요.

## Server Component vs Client Component

기본적으로 app 폴더 안에 있는 컴포넌트는 **Server Component**예요. 브라우저에서 실행되는 게 아니라 서버에서만 렌더링돼요.

\`\`\`tsx
// 이건 Server Component (기본값)
export default function Page() {
  return <div>서버에서 렌더링</div>;
}

// 이건 Client Component
"use client";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
\`\`\`

## 언제 Client Component를 써야 할까요?

- \`useState\`, \`useEffect\` 같은 React 훅을 쓸 때
- 브라우저 이벤트(onClick, onChange 등)를 다룰 때
- 브라우저 전용 API를 사용할 때

반대로 데이터 페칭, DB 접근, 민감한 정보는 Server Component에서 처리하는 게 좋아요.
    `,
    category: "개발",
    categoryColor: "bg-rose-100 text-rose-600",
    date: "2024년 12월 15일",
    readTime: "8분",
    coverColor: "from-rose-200 to-pink-300",
    emoji: "⚡",
    featured: true,
  },
  {
    slug: "tailwind-css-tips",
    title: "Tailwind CSS 실전 팁 10가지",
    excerpt:
      "매일 쓰면서 쌓인 Tailwind 노하우. @apply는 언제 써야 하는지, 커스텀 값은 어떻게 관리하는지 정리했어요.",
    content: `# Tailwind CSS 실전 팁 10가지`,
    category: "디자인",
    categoryColor: "bg-violet-100 text-violet-600",
    date: "2024년 12월 10일",
    readTime: "6분",
    coverColor: "from-violet-200 to-purple-300",
    emoji: "🎨",
  },
  {
    slug: "typescript-utility-types",
    title: "TypeScript 유틸리티 타입 정복하기",
    excerpt:
      "Partial, Pick, Omit, Record... 매번 헷갈리는 유틸리티 타입들을 실제 코드 예시와 함께 깔끔하게 정리했어요.",
    content: `# TypeScript 유틸리티 타입 정복하기`,
    category: "개발",
    categoryColor: "bg-rose-100 text-rose-600",
    date: "2024년 12월 5일",
    readTime: "10분",
    coverColor: "from-sky-200 to-blue-300",
    emoji: "🔷",
  },
  {
    slug: "react-performance-optimization",
    title: "React 성능 최적화, 이것만 알면 돼요",
    excerpt:
      "memo, useMemo, useCallback의 차이와 실제로 언제 써야 하는지. 잘못 쓰면 오히려 느려지는 이유도 설명할게요.",
    content: `# React 성능 최적화`,
    category: "개발",
    categoryColor: "bg-rose-100 text-rose-600",
    date: "2024년 11월 28일",
    readTime: "12분",
    coverColor: "from-emerald-200 to-teal-300",
    emoji: "🚀",
  },
  {
    slug: "figma-to-code-workflow",
    title: "Figma에서 코드까지 나만의 워크플로우",
    excerpt:
      "디자인 파일을 받고 어떻게 컴포넌트를 설계하고 코드로 옮기는지, 실제 프로젝트에서 쓰는 과정을 공유해요.",
    content: `# Figma에서 코드까지`,
    category: "워크플로우",
    categoryColor: "bg-amber-100 text-amber-600",
    date: "2024년 11월 20일",
    readTime: "9분",
    coverColor: "from-amber-200 to-yellow-300",
    emoji: "🖌️",
  },
  {
    slug: "git-commit-message",
    title: "좋은 커밋 메시지 쓰는 법",
    excerpt:
      "6개월 후의 내가 고마워할 커밋 메시지 작성법. Conventional Commits 규칙과 실제로 어떻게 적용하는지 알아봐요.",
    content: `# 좋은 커밋 메시지 쓰는 법`,
    category: "개발 문화",
    categoryColor: "bg-green-100 text-green-600",
    date: "2024년 11월 15일",
    readTime: "5분",
    coverColor: "from-lime-200 to-green-300",
    emoji: "📝",
  },
  {
    slug: "css-grid-layout",
    title: "CSS Grid로 복잡한 레이아웃 뚝딱 만들기",
    excerpt:
      "Flexbox만 쓰다가 Grid를 배웠더니 레이아웃 코드가 절반으로 줄었어요. 핵심 개념과 실용적인 패턴을 소개해요.",
    content: `# CSS Grid 레이아웃`,
    category: "디자인",
    categoryColor: "bg-violet-100 text-violet-600",
    date: "2024년 11월 8일",
    readTime: "7분",
    coverColor: "from-fuchsia-200 to-pink-300",
    emoji: "🔲",
  },
  {
    slug: "developer-productivity",
    title: "개발자 생산성을 높이는 VS Code 세팅",
    excerpt:
      "쓸수록 달라지는 VS Code 환경 설정. 익스텐션, 단축키, snippet까지 내가 실제로 매일 쓰는 것들만 모았어요.",
    content: `# VS Code 생산성 세팅`,
    category: "워크플로우",
    categoryColor: "bg-amber-100 text-amber-600",
    date: "2024년 11월 1일",
    readTime: "8분",
    coverColor: "from-orange-200 to-amber-300",
    emoji: "⚙️",
  },
];

export const categories = ["전체", "개발", "디자인", "워크플로우", "개발 문화"];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: string): Post[] {
  if (category === "전체") return posts;
  return posts.filter((p) => p.category === category);
}

export function getFeaturedPost(): Post | undefined {
  return posts.find((p) => p.featured);
}
