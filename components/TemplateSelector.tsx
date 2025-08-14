'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResumeTemplate } from '@/types/resume';
import { CheckCircle, Sparkles, Award, Zap, Target } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: ResumeTemplate) => void;
}

const templates: { 
  id: ResumeTemplate; 
  name: string; 
  description: string; 
  icon: React.ComponentType<any>;
  color: string;
  features: string[];
}[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean design with gradient accents and modern typography',
    icon: Sparkles,
    color: 'from-indigo-500 to-purple-600',
    features: ['ATS Optimized', 'Color Accents', 'Modern Layout']
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional layout with timeless appeal',
    icon: Award,
    color: 'from-blue-500 to-cyan-600',
    features: ['Professional', 'Traditional', 'Conservative']
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple with focus on content and readability',
    icon: Target,
    color: 'from-gray-500 to-slate-600',
    features: ['Clean Design', 'Readable', 'Minimalist']
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold design with distinctive styling and visual impact',
    icon: Zap,
    color: 'from-purple-500 to-pink-600',
    features: ['Eye-catching', 'Creative', 'Distinctive']
  }
];

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Template</h2>
        <p className="text-gray-600">Select a professional template that matches your industry and personal style</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => {
          const IconComponent = template.icon;
          const isSelected = selectedTemplate === template.id;
          
          return (
            <Card
              key={template.id}
              className={`relative p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                isSelected
                  ? 'ring-2 ring-black shadow-xl bg-gray-50'
                  : 'border-gray-200 hover:border-black bg-white'
              }`}
              onClick={() => onTemplateChange(template.id)}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              )}
              
              {/* Template Icon */}
              <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center mb-4 shadow-lg">
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              
              {/* Template Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>
                </div>
                
                {/* Features */}
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className={`text-xs ${
                        isSelected 
                          ? 'bg-gray-100 text-gray-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Hover Effect */}
              <div className={`absolute inset-0 rounded-lg transition-opacity duration-300 ${
                isSelected 
                  ? 'opacity-0' 
                  : 'opacity-0 hover:opacity-5 bg-black'
              }`} />
            </Card>
          );
        })}
      </div>
      
      {/* Template Preview Note */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-black" />
          <p className="text-sm text-gray-800">
            <span className="font-medium">Pro Tip:</span> All templates are ATS-friendly and optimized for both human recruiters and applicant tracking systems.
          </p>
        </div>
      </div>
    </div>
  );
}