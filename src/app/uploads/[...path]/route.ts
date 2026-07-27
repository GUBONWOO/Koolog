import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const CONTENT_TYPES: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
  gif: 'image/gif', webp: 'image/webp', avif: 'image/avif',
  svg: 'image/svg+xml', bmp: 'image/bmp', ico: 'image/x-icon',
  tiff: 'image/tiff', mp4: 'video/mp4', webm: 'video/webm',
  mov: 'video/quicktime', avi: 'video/x-msvideo', mkv: 'video/x-matroska',
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: parts } = await params;
  const filename = parts.join('/');

  // 경로 이동 공격 방지
  if (!filename || filename.includes('..') || filename.startsWith('/')) {
    return new NextResponse(null, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

  try {
    const buffer = await readFile(filePath);
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    const contentType = CONTENT_TYPES[ext] ?? 'application/octet-stream';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
