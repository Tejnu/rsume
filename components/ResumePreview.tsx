'use client';

import { ResumeData } from '@/types/resume';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate'; // Added
import { TechnicalTemplate } from './templates/TechnicalTemplate'; // Added
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';

interface ResumePreviewProps {
  resumeData: ResumeData;
  onDownloadPDF?: () => void;
}

export function ResumePreview({ resumeData, onDownloadPDF }: ResumePreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Safety check for resumeData
  if (!resumeData || !resumeData.personalInfo) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm sticky top-24 h-fit">
        <div className="p-6">
          <div className="text-center text-gray-500">
            Loading resume preview...
          </div>
        </div>
      </Card>
    );
  }

  const renderTemplate = () => {
    const { selectedTemplate } = resumeData;

    switch (selectedTemplate) {
      case 'modern':
        return <ModernTemplate resumeData={resumeData} />;
      case 'classic':
        return <ClassicTemplate resumeData={resumeData} />;
      case 'minimal':
        return <MinimalTemplate resumeData={resumeData} />;
      case 'creative':
        return <CreativeTemplate resumeData={resumeData} />;
      case 'executive':
        return <ExecutiveTemplate data={resumeData} />;
      case 'technical':
        return <TechnicalTemplate data={resumeData} />;
      default:
        return <ModernTemplate resumeData={resumeData} />;
    }
  };

  const handleDownload = () => {
    const element = document.getElementById('resume-preview-content');
    if (!element) {
      console.error('Resume content not found for download');
      alert('Resume content not found. Please try again.');
      return;
    }

    // Create a complete HTML document with all styles preserved
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Could not open print window - popup blocked');
      alert('Please allow popups for this site to download your resume.');
      return;
    }

    // Capture computed styles for the template
    const computedStyles = window.getComputedStyle(element);
    const templateStyles = Array.from(computedStyles).map(property => {
      return `${property}: ${computedStyles.getPropertyValue(property)};`;
    }).join('\n');

    // Get all external stylesheets (like Tailwind)
    let externalStyles = '';
    try {
      const stylesheets = Array.from(document.styleSheets);
      for (const stylesheet of stylesheets) {
        try {
          if (stylesheet.cssRules) {
            externalStyles += Array.from(stylesheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n') + '\n';
          }
        } catch (e) {
          console.warn("Could not access stylesheet:", stylesheet.href);
        }
      }
    } catch (e) {
      console.warn("Error accessing stylesheets:", e);
    }

    // Get all inline styles from current document
    const inlineStyles = Array.from(document.querySelectorAll('style'))
      .map(style => style.innerHTML)
      .join('\n');

    // Comprehensive template styling for design preservation
    const enhancedStyles = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800&display=swap');
          
          @page {
            margin: 0.5in;
            size: letter;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box !important;
          }

          html, body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.5;
            color: #1f2937;
            background: white;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Template-specific font families */
          .font-serif { font-family: 'Playfair Display', Georgia, serif !important; }
          .font-sans { font-family: 'Inter', system-ui, sans-serif !important; }
          .font-mono { font-family: 'Monaco', 'Menlo', 'Consolas', monospace !important; }

          /* Tailwind-like utility classes */
          .text-xs { font-size: 0.75rem; line-height: 1rem; }
          .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
          .text-base { font-size: 1rem; line-height: 1.5rem; }
          .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
          .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
          .text-2xl { font-size: 1.5rem; line-height: 2rem; }
          .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }

          .font-light { font-weight: 300; }
          .font-normal { font-weight: 400; }
          .font-medium { font-weight: 500; }
          .font-semibold { font-weight: 600; }
          .font-bold { font-weight: 700; }

          .text-gray-600 { color: #4b5563 !important; }
          .text-gray-700 { color: #374151 !important; }
          .text-gray-800 { color: #1f2937 !important; }
          .text-gray-900 { color: #111827 !important; }
          .text-indigo-600 { color: #4f46e5 !important; }
          .text-blue-600 { color: #2563eb !important; }
          .text-purple-600 { color: #9333ea !important; }
          .text-pink-600 { color: #db2777 !important; }
          .text-green-600 { color: #059669 !important; }
          .text-red-600 { color: #dc2626 !important; }

          .bg-gray-50 { background-color: #f9fafb !important; }
          .bg-gray-100 { background-color: #f3f4f6 !important; }
          .bg-indigo-50 { background-color: #eef2ff !important; }
          .bg-blue-50 { background-color: #eff6ff !important; }
          .bg-purple-50 { background-color: #faf5ff !important; }
          .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)) !important; }

          .border { border: 1px solid #e5e7eb !important; }
          .border-l-4 { border-left: 4px solid !important; }
          .border-indigo-500 { border-color: #6366f1 !important; }
          .border-blue-500 { border-color: #3b82f6 !important; }
          .border-purple-500 { border-color: #8b5cf6 !important; }

          .rounded { border-radius: 0.25rem !important; }
          .rounded-lg { border-radius: 0.5rem !important; }
          .rounded-xl { border-radius: 0.75rem !important; }

          .p-1 { padding: 0.25rem !important; }
          .p-2 { padding: 0.5rem !important; }
          .p-3 { padding: 0.75rem !important; }
          .p-4 { padding: 1rem !important; }
          .p-6 { padding: 1.5rem !important; }
          .p-8 { padding: 2rem !important; }

          .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
          .px-3 { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
          .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
          .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
          .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }

          .m-0 { margin: 0 !important; }
          .mb-2 { margin-bottom: 0.5rem !important; }
          .mb-3 { margin-bottom: 0.75rem !important; }
          .mb-4 { margin-bottom: 1rem !important; }
          .mb-6 { margin-bottom: 1.5rem !important; }
          .mb-8 { margin-bottom: 2rem !important; }

          .flex { display: flex !important; }
          .flex-col { flex-direction: column !important; }
          .items-center { align-items: center !important; }
          .justify-between { justify-content: space-between !important; }
          .space-y-2 > * + * { margin-top: 0.5rem !important; }
          .space-y-3 > * + * { margin-top: 0.75rem !important; }
          .space-y-4 > * + * { margin-top: 1rem !important; }

          .grid { display: grid !important; }
          .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
          .gap-2 { gap: 0.5rem !important; }
          .gap-4 { gap: 1rem !important; }

          .w-full { width: 100% !important; }
          .max-w-4xl { max-width: 56rem !important; }
          .min-h-screen { min-height: 100vh !important; }

          /* Remove shadows for print */
          .shadow, .shadow-sm, .shadow-md, .shadow-lg, .shadow-xl {
            box-shadow: none !important;
          }

          h1, h2, h3, h4, h5, h6 {
            margin-top: 0;
            margin-bottom: 0.5em;
            font-weight: 600;
            line-height: 1.2;
          }

          h1 { font-size: 1.875rem; }
          h2 { font-size: 1.5rem; }
          h3 { font-size: 1.25rem; }

          p {
            margin-top: 0;
            margin-bottom: 0.5rem;
          }

          ul, ol {
            margin: 0;
            padding-left: 1.5rem;
          }

          li {
            margin-bottom: 0.25rem;
          }

          /* Template-specific enhancements */
          .resume-container {
            max-width: 8.5in;
            margin: 0 auto;
            background: white;
            padding: 0.5in;
            font-size: 12px;
            line-height: 1.4;
          }

          /* Enhanced gradient backgrounds for all templates */
          .bg-gradient-to-r.from-indigo-500.to-purple-600 {
            background: linear-gradient(to right, #6366f1, #8b5cf6) !important;
            color: white !important;
          }

          .bg-gradient-to-r.from-blue-500.to-cyan-600 {
            background: linear-gradient(to right, #3b82f6, #06b6d4) !important;
            color: white !important;
          }

          .bg-gradient-to-r.from-purple-500.to-pink-600 {
            background: linear-gradient(to right, #8b5cf6, #db2777) !important;
            color: white !important;
          }

          .bg-gradient-to-r.from-emerald-500.to-teal-600 {
            background: linear-gradient(to right, #10b981, #0d9488) !important;
            color: white !important;
          }

          .bg-gradient-to-r.from-orange-500.to-red-600 {
            background: linear-gradient(to right, #f97316, #dc2626) !important;
            color: white !important;
          }

          /* Template-specific design elements */
          .border-l-4.border-indigo-500 { border-left: 4px solid #6366f1 !important; }
          .border-l-4.border-purple-500 { border-left: 4px solid #8b5cf6 !important; }
          .border-l-4.border-blue-500 { border-left: 4px solid #3b82f6 !important; }
          .border-l-4.border-emerald-500 { border-left: 4px solid #10b981 !important; }

          /* Creative template specific styles */
          .creative-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
          }

          .creative-section {
            border-left: 3px solid #667eea !important;
            padding-left: 1rem !important;
          }

          /* Executive template specific styles */
          .executive-header {
            background: #1f2937 !important;
            color: white !important;
          }

          .executive-section {
            border-bottom: 2px solid #e5e7eb !important;
            padding-bottom: 1rem !important;
          }

          /* Technical template specific styles */
          .technical-grid {
            display: grid !important;
            grid-template-columns: 1fr 2fr !important;
            gap: 2rem !important;
          }

          .technical-sidebar {
            background: #f8fafc !important;
            padding: 1.5rem !important;
          }

          /* Skill bars and progress elements */
          .skill-bar {
            height: 8px !important;
            background: #e5e7eb !important;
            border-radius: 4px !important;
            overflow: hidden !important;
          }

          .skill-progress {
            height: 100% !important;
            background: linear-gradient(to right, #6366f1, #8b5cf6) !important;
            transition: none !important;
          }

          /* Icons and decorative elements */
          .icon-circle {
            width: 40px !important;
            height: 40px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: #6366f1 !important;
            color: white !important;
          }

          /* Contact information styling */
          .contact-item {
            display: flex !important;
            align-items: center !important;
            margin-bottom: 0.5rem !important;
          }

          .contact-icon {
            width: 16px !important;
            height: 16px !important;
            margin-right: 0.5rem !important;
            color: #6b7280 !important;
          }

          @media print {
            * {
              box-shadow: none !important;
              text-shadow: none !important;
            }
            .no-print { display: none !important; }
            .page-break { page-break-after: always; }
            body { margin: 0; padding: 0; }
            .resume-container {
              padding: 0.25in;
              margin: 0;
              box-shadow: none !important;
            }
          }
        </style>
      `;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${resumeData.personalInfo?.fullName || 'Resume'} - Resume</title>
          
          <!-- Tailwind CSS -->
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = {
              theme: {
                extend: {
                  fontFamily: {
                    'inter': ['Inter', 'system-ui', 'sans-serif'],
                    'playfair': ['Playfair Display', 'Georgia', 'serif'],
                  },
                  colors: {
                    'gradient-start': '#6366f1',
                    'gradient-end': '#8b5cf6',
                  }
                }
              }
            }
          </script>
          
          <!-- External Styles -->
          <style>
            ${externalStyles}
          </style>
          
          <!-- Inline Styles -->
          <style>
            ${inlineStyles}
          </style>
          
          <!-- Enhanced Template Styles -->
          ${enhancedStyles}
          
          <style>
            /* Override any conflicting styles */
            #resume-preview-content {
              ${templateStyles}
            }
            
            /* Ensure proper rendering */
            .resume-container * {
              position: relative !important;
              z-index: auto !important;
            }
          </style>
        </head>
        <body class="bg-white">
          <div class="resume-container max-w-4xl mx-auto bg-white" style="min-height: 11in;">
            ${element.innerHTML}
          </div>
          
          <script>
            // Ensure all fonts and styles are loaded before printing
            window.onload = function() {
              const fonts = [
                new FontFace('Inter', 'url(https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900)'),
                new FontFace('Playfair Display', 'url(https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800)')
              ];
              
              Promise.allSettled(fonts.map(font => font.load())).then(() => {
                setTimeout(() => {
                  window.focus();
                  window.print();
                  setTimeout(() => {
                    window.close();
                  }, 2000);
                }, 1500);
              }).catch(() => {
                // Fallback if fonts fail to load
                setTimeout(() => {
                  window.focus();
                  window.print();
                  setTimeout(() => {
                    window.close();
                  }, 2000);
                }, 1500);
              });
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    if (onDownloadPDF) {
      onDownloadPDF();
    }
  };


  return (
    <Card className="bg-white border border-gray-200 shadow-sm sticky top-24 h-fit">
      <div className="p-6">
        {/* Header with Controls */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              className="text-xs px-2 py-1 border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              className="text-xs px-2 py-1 border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="rounded-lg border-gray-300"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleDownload}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 text-sm px-4 py-2"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        {/* Preview Container */}
        <div className={`bg-gray-50 border-2 border-gray-200 rounded-2xl overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50 p-6' : ''}`}>
          {isFullscreen && (
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                onClick={() => setIsFullscreen(false)}
                className="rounded-lg border-gray-300"
              >
                Exit Fullscreen
              </Button>
            </div>
          )}

          <div
            className="bg-white shadow-2xl mx-auto overflow-auto"
            style={{
              width: isFullscreen ? '210mm' : '100%',
              maxWidth: isFullscreen ? '210mm' : '820px',
              height: isFullscreen ? '297mm' : '840px',
              transform: isFullscreen ? 'none' : `scale(${zoom})`,
              transformOrigin: 'top center',
              transition: 'all 0.3s ease'
            }}
          >
            <div
              id="resume-preview-content" // Corrected ID to match getElementById
              className="h-full overflow-auto"
              style={{
                fontSize: isFullscreen ? '12px' : '12px',
                lineHeight: '1.4'
              }}
            >
              {renderTemplate()}
            </div>
          </div>
        </div>

        {/* Template Info */}
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 capitalize">
                {resumeData.selectedTemplate} Template
              </p>
              <p className="text-xs text-gray-600">
                Optimized for ATS systems
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span className="text-xs text-black font-medium">Live</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}