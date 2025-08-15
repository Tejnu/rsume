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

  const handleDownloadPDF = async () => {
    const element = document.getElementById('resume-preview-content');
    if (!element) return;

    try {
      // Import html2pdf dynamically
      const html2pdf = (await import('html2pdf.js')).default;
      
      // Configure options for better PDF output
      const options = {
        margin: 0.5,
        filename: `${resumeData.personalInfo?.fullName || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          letterRendering: true,
          allowTaint: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait' 
        }
      };

      // Generate and download PDF with template styling preserved
      await html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }

    try {
      // Dynamic import of html2pdf
      const html2pdf = (await import('html2pdf.js')).default;
      
      // Clone the element to avoid modifying the original
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      // Create a temporary container with proper styling
      const container = document.createElement('div');
      container.style.width = '8.5in';
      container.style.minHeight = '11in';
      container.style.margin = '0';
      container.style.padding = '0.5in';
      container.style.backgroundColor = 'white';
      container.style.fontFamily = 'Inter, sans-serif';
      container.style.fontSize = '12px';
      container.style.lineHeight = '1.4';
      container.style.color = '#000';
      container.appendChild(clonedElement);
      
      // Temporarily add to DOM for rendering
      container.style.position = 'fixed';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      document.body.appendChild(container);

      const options = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${resumeData.personalInfo.fullName || 'Resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait' 
        }
      };

      await html2pdf().set(options).from(container).save();
      
      // Clean up
      document.body.removeChild(container);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      // Fallback to print dialog
      window.print();
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