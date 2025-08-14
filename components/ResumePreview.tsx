'use client';

import { ResumeData } from '@/types/resume';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
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

  const renderTemplate = () => {
    switch (resumeData.selectedTemplate) {
      case 'modern':
        return <ModernTemplate resumeData={resumeData} />;
      case 'classic':
        return <ClassicTemplate resumeData={resumeData} />;
      case 'minimal':
        return <MinimalTemplate resumeData={resumeData} />;
      case 'creative':
        return <CreativeTemplate resumeData={resumeData} />;
      default:
        return <ModernTemplate resumeData={resumeData} />;
    }
  };

  const handleDownload = () => {
    const printContent = document.getElementById('resume-preview-content');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((el) => el.outerHTML)
      .join('\n');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Resume - ${resumeData.personalInfo.fullName || 'Resume'}</title>
          ${stylesheets}
          <style>
            @page { margin: 0.5in; size: letter; }
            html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .resume-content { width: 100%; }
          </style>
        </head>
        <body>
          <div id="resume-preview-content">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);

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
              className="rounded-lg border-gray-300"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(1.2, zoom + 0.1))}
              className="rounded-lg border-gray-300"
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
              className="bg-black text-white hover:bg-gray-800 rounded-lg"
              size="sm"
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