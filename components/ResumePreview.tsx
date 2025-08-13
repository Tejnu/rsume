'use client';

import { ResumeData } from '@/types/resume';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { Card } from '@/components/ui/card';

interface ResumePreviewProps {
  resumeData: ResumeData;
}

export function ResumePreview({ resumeData }: ResumePreviewProps) {
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

  return (
    <Card className="bg-white shadow-lg">
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
        <div 
          className="bg-white border border-gray-200 rounded-lg overflow-hidden"
          style={{ 
            aspectRatio: '8.5/11',
            minHeight: '600px'
          }}
        >
          <div className="h-full overflow-auto">
            {renderTemplate()}
          </div>
        </div>
      </div>
    </Card>
  );
}