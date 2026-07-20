import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug, updatePost, deletePost } from '@/lib/posts';
import { Category } from '@/types/post';

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return NextResponse.json({ error: '글을 찾을 수 없어요.' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const body = await req.json();
  const { title, category, content, emoji } = body as {
    title: string;
    category: Category;
    content: string;
    emoji: string;
  };

  if (!title?.trim() || !category || !content?.trim()) {
    return NextResponse.json({ error: '필수 항목을 입력해주세요.' }, { status: 400 });
  }

  const post = await updatePost(slug, { title, category, content, emoji });
  if (!post) return NextResponse.json({ error: '글을 찾을 수 없어요.' }, { status: 404 });
  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const ok = await deletePost(slug);
  if (!ok) return NextResponse.json({ error: '글을 찾을 수 없어요.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
