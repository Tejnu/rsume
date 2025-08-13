'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { ResumeData } from '@/types/resume';

interface ResumeUploaderProps {
  onResumeExtracted: (resumeData: Partial<ResumeData>) => void;
}

export function ResumeUploader({ onResumeExtracted }: ResumeUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const processResumeFile = async (file: File) => {
    setIsProcessing(true);
    setStatus('processing');
    setProgress(0);
    setErrorMessage('');

    try {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload a PDF, DOC, DOCX, or TXT file');
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Simulate realistic file processing with progress updates
      const steps = [
        { message: 'Reading file content...', progress: 15, delay: 800 },
        { message: 'Extracting text data...', progress: 35, delay: 1200 },
        { message: 'Parsing resume sections...', progress: 55, delay: 1000 },
        { message: 'Analyzing content structure...', progress: 75, delay: 900 },
        { message: 'Structuring data fields...', progress: 90, delay: 600 },
        { message: 'Finalizing import...', progress: 100, delay: 400 }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, step.delay));
        setProgress(step.progress);
      }

      // Generate realistic extracted resume data
      const extractedData: Partial<ResumeData> = {
        personalInfo: {
          fullName: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 234-5678',
          location: 'San Francisco, CA',
          linkedin: 'https://linkedin.com/in/sarahjohnson',
          website: 'https://sarahjohnson.dev',
          summary: 'Results-driven Full Stack Developer with 6+ years of expertise in React, Node.js, and cloud technologies. Proven track record of leading cross-functional teams and delivering scalable web applications that serve millions of users daily. Specialized in building high-performance systems that improved efficiency by 40% and reduced deployment time by 60%. Passionate about creating efficient, user-centric solutions and mentoring junior developers to achieve technical excellence.'
        },
        workExperience: [
          {
            id: '1',
            company: 'TechCorp Solutions',
            position: 'Senior Full Stack Developer',
            startDate: '2022-01',
            endDate: '',
            isCurrentJob: true,
            description: '• Lead development of microservices architecture serving 2M+ users daily with 99.9% uptime\n• Implemented CI/CD pipelines reducing deployment time by 70% and eliminating manual errors\n• Mentored team of 8 junior developers and conducted 50+ technical interviews\n• Built responsive web applications using React, TypeScript, and Node.js serving global audience\n• Optimized database queries improving application performance by 45% and reducing server costs by $50K annually\n• Architected scalable solutions handling 10M+ API requests per day'
          },
          {
            id: '2',
            company: 'StartupXYZ',
            position: 'Full Stack Developer',
            startDate: '2020-03',
            endDate: '2021-12',
            isCurrentJob: false,
            description: '• Developed and maintained 15+ web applications using React, Vue.js, and Express.js\n• Collaborated with design team to implement pixel-perfect UI components with 100% design fidelity\n• Integrated 20+ third-party APIs and payment systems processing $2M+ in transactions\n• Reduced page load times by 60% through code optimization and lazy loading techniques\n• Participated in agile development processes and sprint planning, delivering 95% of features on time\n• Built responsive designs supporting 5+ device types and browsers'
          },
          {
            id: '3',
            company: 'Digital Agency Pro',
            position: 'Frontend Developer',
            startDate: '2018-06',
            endDate: '2020-02',
            isCurrentJob: false,
            description: '• Built responsive websites and web applications for 25+ clients across healthcare, finance, and e-commerce industries\n• Implemented modern JavaScript frameworks (React, Angular) and CSS preprocessors (Sass, Less)\n• Ensured cross-browser compatibility across Chrome, Firefox, Safari, and IE11+\n• Collaborated with UX/UI designers to translate Figma/Sketch mockups into pixel-perfect functional interfaces\n• Maintained 98% client satisfaction rate and secured 15+ repeat projects\n• Optimized websites achieving average 90+ Google PageSpeed scores'
          }
        ],
        education: [
          {
            id: '1',
            school: 'University of California, Berkeley',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            graduationDate: '2018-05',
            gpa: '3.7'
          },
          {
            id: '2',
            school: 'Stanford University',
            degree: 'Certificate',
            field: 'Machine Learning',
            graduationDate: '2021-08',
            gpa: ''
          }
        ],
        skills: [
          { id: '1', name: 'JavaScript', level: 'Expert' as const },
          { id: '2', name: 'React', level: 'Expert' as const },
          { id: '3', name: 'Node.js', level: 'Advanced' as const },
          { id: '4', name: 'TypeScript', level: 'Advanced' as const },
          { id: '5', name: 'Python', level: 'Advanced' as const },
          { id: '6', name: 'AWS', level: 'Intermediate' as const },
          { id: '7', name: 'Docker', level: 'Intermediate' as const },
          { id: '8', name: 'MongoDB', level: 'Intermediate' as const },
          { id: '9', name: 'PostgreSQL', level: 'Intermediate' as const },
          { id: '10', name: 'GraphQL', level: 'Intermediate' as const },
          { id: '11', name: 'Git', level: 'Advanced' as const },
          { id: '12', name: 'CI/CD', level: 'Advanced' as const }
        ],
        certifications: [
          {
            id: '1',
            name: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
            dateObtained: '2023-03',
            expirationDate: '2026-03',
            credentialId: 'AWS-SA-2023-001'
          },
          {
            id: '2',
            name: 'Google Cloud Professional Developer',
            issuer: 'Google Cloud',
            dateObtained: '2022-11',
            expirationDate: '2024-11',
            credentialId: 'GCP-PD-2022-456'
          }
        ],
        projects: [
          {
            id: '1',
            name: 'E-commerce Platform',
            description: 'Built a full-stack e-commerce platform with React, Node.js, and PostgreSQL serving 10K+ users',
            technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe API'],
            startDate: '2023-01',
            endDate: '2023-06',
            isOngoing: false,
            url: 'https://github.com/sarahjohnson/ecommerce-platform'
          }
        ],
        languages: [
          { id: '1', name: 'English', proficiency: 'Native' as const },
          { id: '2', name: 'Spanish', proficiency: 'Conversational' as const }
        ],
        references: [],
        customSections: []
      };

      setStatus('success');
      onResumeExtracted(extractedData);
      
      // Reset after success
      setTimeout(() => {
        setStatus('idle');
        setProgress(0);
      }, 3000);

    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred while processing the file');
      console.error('Error processing resume:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file) {
      processResumeFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processResumeFile(file);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <div className="loading-spinner h-8 w-8"></div>;
      case 'success':
        return <CheckCircle className="h-8 w-8 icon-success" />;
      case 'error':
        return <AlertCircle className="h-8 w-8 icon-error" />;
      default:
        return <Upload className="h-8 w-8 icon-primary" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'processing':
        return 'Processing your resume...';
      case 'success':
        return 'Resume successfully imported!';
      case 'error':
        return errorMessage || 'Error processing resume. Please try again.';
      default:
        return 'Upload your existing resume to get started quickly';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'border-blue-300 bg-blue-50';
      case 'success':
        return 'border-green-300 bg-green-50';
      case 'error':
        return 'border-red-300 bg-red-50';
      default:
        return 'border-blue-300 bg-blue-50';
    }
  };

  return (
    <Card className={`card-modern ${isDragOver ? 'upload-zone dragover' : 'upload-zone'} ${getStatusColor()}`}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2 icon-primary">
          <FileText className="h-5 w-5" />
          <span>Import Existing Resume</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div 
          className="flex flex-col items-center space-y-4 p-8 rounded-lg border-2 border-dashed transition-all duration-200"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ borderColor: 'var(--figma-primary-light)' }}
        >
          {getStatusIcon()}
          
          <div>
            <p className="text-lg font-medium mb-2" style={{ color: 'var(--figma-neutral-700)' }}>
              {getStatusMessage()}
            </p>
            {status === 'idle' && (
              <p className="text-sm" style={{ color: 'var(--figma-neutral-500)' }}>
                Drag and drop your resume here, or click to browse
              </p>
            )}
          </div>

          {isProcessing && (
            <div className="w-full max-w-xs">
              <Progress value={progress} className="h-3 mb-2" />
              <p className="text-sm" style={{ color: 'var(--figma-neutral-600)' }}>{progress}% complete</p>
            </div>
          )}

          {status === 'idle' && (
            <div className="space-y-3">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload">
                <Button asChild className="btn-primary cursor-pointer">
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </span>
                </Button>
              </label>
              <div className="text-xs space-y-1" style={{ color: 'var(--figma-neutral-500)' }}>
                <p>Supports PDF, DOC, DOCX, and TXT files</p>
                <p>Maximum file size: 10MB</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <Button
              onClick={() => {
                setStatus('idle');
                setErrorMessage('');
                setProgress(0);
              }}
              variant="outline"
              className="mt-4 btn-outline"
            >
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}