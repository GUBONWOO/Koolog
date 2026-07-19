import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { pin } = await req.json();
  const correct = process.env.SECRET_PIN || '1234';

  if (pin === correct) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
