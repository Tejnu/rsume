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
    const printContent = document.getElementById('resume-preview-content');
    if (!printContent) {
      console.error('Resume content not found for download');
      alert('Resume content not found. Please try again.');
      return;
    }

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        console.error('Could not open print window - popup blocked');
        alert('Please allow popups for this site to download your resume.');
        return;
      }

      // Get all stylesheets
      const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
        .map((el) => el.outerHTML)
        .join('\n');

      // Create inline styles for print
      const printStyles = `
        <style>
          @page { 
            margin: 0.5in; 
            size: A4; 
          }
          
          * { 
            -webkit-print-color-adjust: exact !important; 
            color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
          
          body { 
            font-family: system-ui, -apple-system, sans-serif; 
            line-height: 1.5; 
            color: #000; 
            background: white; 
            margin: 0; 
            padding: 0; 
          }
          
          .resume-container { 
            max-width: 8.5in; 
            margin: 0 auto; 
            background: white; 
            padding: 0.5in; 
          }
          
          h1, h2, h3, h4, h5, h6 { 
            color: #000 !important; 
            margin-bottom: 0.5em; 
          }
          
          .text-gray-600, .text-gray-700, .text-gray-800 { 
            color: #374151 !important; 
          }
          
          .text-indigo-600, .text-blue-600, .text-purple-600 { 
            color: #4f46e5 !important; 
          }
          
          .bg-gray-50, .bg-gray-100 { 
            background-color: #f9fafb !important; 
          }
          
          .border { 
            border: 1px solid #e5e7eb !important; 
          }
          
          .shadow, .shadow-sm, .shadow-lg { 
            box-shadow: none !important; 
          }
          
          .rounded, .rounded-lg, .rounded-xl { 
            border-radius: 4px !important; 
          }
          
          @media print {
            .no-print { display: none !important; }
            .page-break { page-break-after: always; }
            * { box-shadow: none !important; }
          }
        </style>
      `;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Resume - ${resumeData.personalInfo.fullName || 'Resume'}</title>
            ${stylesheets}
            <style>
              @page { 
                margin: 0.5in; 
                size: letter;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              html, body { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact;
                margin: 0;
                padding: 0;
                font-family: system-ui, -apple-system, sans-serif;
              }
              .resume-content { 
                width: 100%; 
                max-width: none;
                margin: 0;
                padding: 0;
              }
              * {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none !important; }
              }
            </style>
          </head>
          <body>
            <div class="resume-content">
              ${printContent.innerHTML}
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.focus();
                  window.print();
                  setTimeout(function() {
                    window.close();
                  }, 1000);
                }, 500);
              };
            </script>
          </body>
        </html>
      `);

      // Create the complete HTML document
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${resumeData.personalInfo?.fullName || 'Resume'} - Resume</title>
            ${stylesheets}
            ${printStyles}
          </head>
          <body>
            <div class="resume-container">
              ${printContent.innerHTML}
            </div>
            <script>
              window.onload = function() {
                // Small delay to ensure styles are loaded
                setTimeout(() => {
                  window.print();
                  // Close after printing (optional)
                  setTimeout(() => {
                    window.close();
                  }, 1000);
                }, 500);
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
    } catch (error) {
      console.error('Error during download:', error);
      alert('There was an error downloading your resume. Please try again.');
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
              id="resume-preview-content"
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