import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;  // 10MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200MB

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
  }

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  if (!isImage && !isVideo) {
    return NextResponse.json({ error: '이미지 또는 동영상 파일만 업로드 가능합니다.' }, { status: 400 });
  }

  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  if (file.size > maxSize) {
    const limit = isVideo ? '200MB' : '10MB';
    return NextResponse.json({ error: `파일 크기는 ${limit} 이하여야 합니다.` }, { status: 400 });
  }

  const ext = (file.name.split('.').pop() || (isVideo ? 'mp4' : 'jpg'))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  await mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
