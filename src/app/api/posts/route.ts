import { NextRequest, NextResponse } from 'next/server';
import { getPosts, createPost } from '@/lib/posts';
import { Category } from '@/types/post';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get('category') || '전체';
  const q = searchParams.get('q') || '';

  const posts = await getPosts(category, q);
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, category, content, emoji, coverImage } = body as {
    title: string;
    category: Category;
    content: string;
    emoji: string;
    coverImage?: string;
  };

  if (!title?.trim() || !category || !content?.trim()) {
    return NextResponse.json({ error: '필수 항목을 입력해주세요.' }, { status: 400 });
  }

  const post = await createPost({ title, category, content, emoji, coverImage });
  return NextResponse.json(post, { status: 201 });
}
