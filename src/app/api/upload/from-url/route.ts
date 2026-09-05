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

function detectImageExt(buf: Buffer): string | null {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png';
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return 'gif';
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return 'webp';
  if (buf[0] === 0x42 && buf[1] === 0x4d) return 'bmp';
  if (buf[0] === 0x00 && buf[1] === 0x00 && buf[2] === 0x01 && buf[3] === 0x00) return 'ico';
  // AVIF/HEIC: ftyp box
  if (buf.length > 11 && buf.slice(4, 8).toString('ascii') === 'ftyp') return 'avif';
  return null;
}

export async function POST(req: NextRequest) {
  const { url } = (await req.json()) as { url: string };

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'URLが正しくありません。' }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error();
  } catch {
    return NextResponse.json({ error: '有効なURLを入力してください。' }, { status: 400 });
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
    return NextResponse.json({ error: '画像を取得できません。URLを確認してください。' }, { status: 400 });
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: `取得失敗 (HTTP ${res.status})。このサイトは外部アクセスを制限している可能性があります。` },
      { status: 400 }
    );
  }

  const contentType = res.headers.get('content-type')?.split(';')[0].trim().toLowerCase() || '';
  const isImageMime = contentType.startsWith('image/');
  const extFromUrlPath = extFromUrl(parsedUrl.pathname + parsedUrl.search);

  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length === 0) {
    return NextResponse.json({ error: '空のレスポンスが返されました。' }, { status: 400 });
  }
  if (buffer.length > MAX_SIZE) {
    return NextResponse.json({ error: 'ファイルサイズは10MB以下にしてください。' }, { status: 400 });
  }

  const magicExt = detectImageExt(buffer);

  if (!isImageMime && !magicExt && !extFromUrlPath) {
    return NextResponse.json(
      { error: `画像ファイルではありません (${contentType || '不明'})。画像のURLか確認してください。` },
      { status: 400 }
    );
  }

  const ext = magicExt ?? (isImageMime ? MIME_TO_EXT[contentType] : null) ?? extFromUrlPath ?? 'jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
