import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
  'image/bmp': 'bmp',
  'image/x-icon': 'ico',
  'image/tiff': 'tiff',
};

const URL_EXT_RE = /\.(jpe?g|png|gif|webp|avif|svg|bmp|ico|tiff?)(?:[?#]|$)/i;

function extFromUrl(urlStr: string): string | null {
  const m = urlStr.match(URL_EXT_RE);
  if (!m) return null;
  const e = m[1].toLowerCase();
  return e === 'jpeg' ? 'jpg' : e;
}

export async function POST(req: NextRequest) {
  const { url } = (await req.json()) as { url: string };

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'URL이 올바르지 않습니다.' }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error();
  } catch {
    return NextResponse.json({ error: '유효한 URL을 입력해주세요.' }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(parsedUrl.toString(), {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,ja;q=0.8,en;q=0.7',
        'Referer': parsedUrl.origin + '/',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
      },
    });
  } catch (e) {
    console.error('[from-url] fetch error:', e);
    return NextResponse.json({ error: '이미지를 가져올 수 없습니다. URL을 확인해주세요.' }, { status: 400 });
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: `가져오기 실패 (HTTP ${res.status}). 이 사이트는 외부 접근을 차단하고 있을 수 있습니다.` },
      { status: 400 }
    );
  }

  const contentType = res.headers.get('content-type')?.split(';')[0].trim().toLowerCase() || '';
  const isImageMime = contentType.startsWith('image/');
  const isOctetStream = contentType === 'application/octet-stream' || contentType === '';
  const extFromUrlPath = extFromUrl(parsedUrl.pathname + parsedUrl.search);

  if (!isImageMime && !(isOctetStream && extFromUrlPath)) {
    return NextResponse.json(
      { error: `이미지 파일이 아닙니다 (${contentType || '알 수 없음'}). 이미지 URL이 맞는지 확인해주세요.` },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length === 0) {
    return NextResponse.json({ error: '빈 응답이 반환됐습니다.' }, { status: 400 });
  }
  if (buffer.length > MAX_SIZE) {
    return NextResponse.json({ error: '파일 크기는 10MB 이하여야 합니다.' }, { status: 400 });
  }

  const ext = (isImageMime ? MIME_TO_EXT[contentType] : null) ?? extFromUrlPath ?? 'jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
