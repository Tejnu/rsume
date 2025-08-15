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

  const handleDownloadPDF = () => {
    const element = document.getElementById('resume-preview-content');
    if (!element) return;

    // Create a new window for printing with all styles preserved
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Get all stylesheets from the current document
    const stylesheets = Array.from(document.styleSheets);
    let cssText = '';

    // Extract CSS from stylesheets
    stylesheets.forEach(stylesheet => {
      try {
        if (stylesheet.cssRules) {
          Array.from(stylesheet.cssRules).forEach(rule => {
            cssText += rule.cssText + '\n';
          });
        }
      } catch (e) {
        // Handle cross-origin restrictions
        console.log('Could not access stylesheet:', e);
      }
    });

    // Get all style tags
    const styleTags = Array.from(document.querySelectorAll('style'));
    styleTags.forEach(styleTag => {
      cssText += styleTag.innerHTML + '\n';
    });

    // Get computed styles for the resume element
    const computedStyles = window.getComputedStyle(element);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Resume - ${resumeData.personalInfo.fullName}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            ${cssText}

            /* Print-specific styles */
            @media print {
              @page {
                margin: 0.5in;
                size: letter;
              }
              body {
                margin: 0;
                padding: 0;
                font-family: 'Inter', sans-serif;
                color: #000 !important;
                background: #fff !important;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                box-shadow: none !important;
              }
              .no-print {
                display: none !important;
              }
              h1, h2, h3 {
                page-break-after: avoid;
                color: inherit !important;
              }
              p, li {
                orphans: 2;
                widows: 2;
              }
              .bg-gradient-to-r,
              .bg-gradient-to-br,
              .bg-blue-600,
              .bg-indigo-600,
              .bg-purple-600,
              .bg-emerald-600,
              .bg-orange-600,
              .bg-red-600 {
                background: #2563eb !important;
                color: white !important;
              }
              .text-blue-600,
              .text-indigo-600,
              .text-purple-600,
              .text-emerald-600,
              .text-orange-600,
              .text-red-600 {
                color: #2563eb !important;
              }
            }

            /* Ensure template styles are preserved */
            #resume-content {
              width: 8.5in;
              min-height: 11in;
              margin: 0 auto;
              background: white;
              font-size: 11px;
              line-height: 1.4;
              color: #000;
            }
          </style>
        </head>
        <body>
          <div id="resume-content">
            ${element.innerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
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
              onClick={handleDownloadPDF}
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