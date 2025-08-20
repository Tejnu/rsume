
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

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: Request) {
  // Set proper headers for JSON response
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  };

  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    
    if (!file) {
      return new NextResponse(
        JSON.stringify({ error: 'No file provided' }), 
        { status: 400, headers }
      );
    }

    // Validate file type
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid file type. Please upload a PDF file.' }), 
        { status: 400, headers }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return new NextResponse(
        JSON.stringify({ error: 'File too large. Please upload a file smaller than 10MB.' }), 
        { status: 400, headers }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Dynamic import with error handling
    let pdfParse;
    try {
      // Use dynamic import with better error handling
      const pdfParseModule = await import('pdf-parse');
      pdfParse = pdfParseModule.default || pdfParseModule;
    } catch (importError) {
      console.error('PDF-parse import error:', importError);
      return new NextResponse(
        JSON.stringify({ error: 'PDF parsing service encountered an import error. Please try uploading a DOCX or TXT file instead.' }), 
        { status: 503, headers }
      );
    }
    
    // Parse PDF with error handling for runtime issues
    let result;
    try {
      result = await pdfParse(buffer, {
        max: 0 // parse all pages
      });
    } catch (parseError) {
      console.error('PDF parsing error:', parseError);
      // Check for common pdf-parse errors
      if (parseError instanceof Error && (parseError.message.includes('ENOENT') || parseError.message.includes('test/data'))) {
        return new NextResponse(
          JSON.stringify({ error: 'PDF parsing service encountered a file system error. Please try uploading a DOCX or TXT file instead.' }), 
          { status: 503, headers }
        );
      }
      throw parseError;
    }
    
    const text = (result.text || '').trim();
    
    if (!text || text.length < 10) {
      return new NextResponse(
        JSON.stringify({ error: 'No readable text found in PDF. The file may be image-based or corrupted.' }), 
        { status: 400, headers }
      );
    }

    // Ensure we return proper JSON
    const response = {
      text: text,
      pages: result.numpages || 0,
      info: {
        title: result.info?.Title || '',
        author: result.info?.Author || '',
        subject: result.info?.Subject || ''
      }
    };

    return new NextResponse(
      JSON.stringify(response), 
      { status: 200, headers }
    );
  } catch (e: any) {
    console.error('PDF parsing error:', e);
    
    return new NextResponse(
      JSON.stringify({ 
        error: e?.message || 'Failed to parse PDF. Please ensure the file is not corrupted and try again.' 
      }), 
      { status: 500, headers }
    );
  }
}
