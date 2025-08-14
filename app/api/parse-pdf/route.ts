
import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

export const dynamic = 'force-dynamic';
export const maxDuration = 30; // 30 seconds timeout

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Invalid file type. Please upload a PDF file.' }, { status: 400 });
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Please upload a file smaller than 10MB.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Parse PDF with options for better text extraction
    const result = await pdfParse(buffer, {
      max: 0, // parse all pages
      version: 'v1.10.100' // specify version for stability
    });
    
    const text = (result.text || '').trim();
    
    if (!text || text.length < 10) {
      return NextResponse.json({ error: 'No readable text found in PDF. The file may be image-based or corrupted.' }, { status: 400 });
    }

    return NextResponse.json({ 
      text,
      pages: result.numpages,
      info: {
        title: result.info?.Title || '',
        author: result.info?.Author || '',
        subject: result.info?.Subject || ''
      }
    });
  } catch (e: any) {
    console.error('PDF parsing error:', e);
    return NextResponse.json({ 
      error: e?.message || 'Failed to parse PDF. Please ensure the file is not corrupted and try again.' 
    }, { status: 500 });
  }
}


