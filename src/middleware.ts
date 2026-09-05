import { NextRequest, NextResponse } from 'next/server';

const INTERNAL_PREFIXES = [
  '127.', '::1', '::ffff:127.',
  '10.',
  '192.168.',
  '172.16.', '172.17.', '172.18.', '172.19.', '172.20.',
  '172.21.', '172.22.', '172.23.', '172.24.', '172.25.',
  '172.26.', '172.27.', '172.28.', '172.29.', '172.30.', '172.31.',
];

function isInternal(req: NextRequest): boolean {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '';
  return INTERNAL_PREFIXES.some((p) => ip.startsWith(p));
}

const WRITE_PAGES = ['/write'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 쓰기 전용 페이지: 외부 IP는 홈으로 리다이렉트
  const isWritePage = WRITE_PAGES.includes(pathname) || /^\/blog\/[^/]+\/edit$/.test(pathname);
  if (isWritePage && !isInternal(req)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 쓰기 전용 API: 외부 IP는 403
  const isWriteApi =
    (pathname === '/api/posts' && req.method !== 'GET') ||
    (pathname.startsWith('/api/posts/') && req.method !== 'GET') ||
    pathname.startsWith('/api/upload') ||
    pathname === '/api/secret-verify';

  if (isWriteApi && !isInternal(req)) {
    return new Response(
      JSON.stringify({ error: '내부 네트워크에서만 접근 가능합니다.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/write',
    '/blog/:slug/edit',
    '/api/posts',
    '/api/posts/:path*',
    '/api/upload/:path*',
    '/api/secret-verify',
  ],
};
