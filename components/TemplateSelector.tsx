'use client';

import { Card } from '@/components/ui/card';
import { ResumeTemplate } from '@/types/resume';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: ResumeTemplate) => void;
}

const templates: { id: ResumeTemplate; name: string; description: string; preview: string }[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with subtle colors',
    preview: '🎨'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional layout',
    preview: '📋'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant with plenty of white space',
    preview: '✨'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold design with distinctive styling',
    preview: '🚀'
  }
];

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose a Template</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onTemplateChange(template.id)}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{template.preview}</div>
              <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
              <p className="text-xs text-gray-600">{template.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}