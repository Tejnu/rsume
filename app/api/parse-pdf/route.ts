import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: Request) {
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
    
    // Try to use pdf-parse with better error handling
    let result;
    try {
      // Create a minimal pdf-parse implementation to avoid test file issues
      const pdfParse = await import('pdf-parse').then(module => module.default || module);
      
      result = await pdfParse(buffer, {
        max: 0, // parse all pages
        version: 'v1.10.1'
      });
    } catch (parseError: any) {
      console.error('PDF parsing error:', parseError);
      
      // Fallback: try to extract basic text using a simpler approach
      try {
        const textContent = buffer.toString('utf8');
        const cleanText = textContent.replace(/[^\x20-\x7E\n\r]/g, ' ').trim();
        
        if (cleanText.length > 50) {
          result = {
            text: cleanText,
            numpages: 1,
            info: {}
          };
        } else {
          throw new Error('No readable text found');
        }
      } catch {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Unable to parse PDF. The file may be image-based, encrypted, or corrupted. Please try uploading a DOCX or TXT file instead.' 
          }), 
          { status: 400, headers }
        );
      }
    }
    
    const text = (result.text || '').trim();
    
    if (!text || text.length < 10) {
      return new NextResponse(
        JSON.stringify({ error: 'No readable text found in PDF. The file may be image-based or corrupted.' }), 
        { status: 400, headers }
      );
    }

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
        error: 'PDF parsing service encountered an error. Please try uploading a DOCX or TXT file instead.' 
      }), 
      { status: 500, headers }
    );
  }
}