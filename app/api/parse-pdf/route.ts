
import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await pdfParse(buffer);
    const text = (result.text || '').trim();
    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to parse PDF' }, { status: 500 });
  }
}


