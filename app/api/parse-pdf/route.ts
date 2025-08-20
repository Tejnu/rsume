
import { NextResponse } from 'next/server';

// Type declaration for pdf-parse
declare module 'pdf-parse' {
  interface PDFData {
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
    text: string;
  }
  
  interface PDFOptions {
    max?: number;
    version?: string;
  }
  
  function pdfParse(buffer: Buffer, options?: PDFOptions): Promise<PDFData>;
  export = pdfParse;
}

import pdfParse from 'pdf-parse';

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
      max: 0 // parse all pages
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


