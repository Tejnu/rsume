'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react';
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
  const [currentStep, setCurrentStep] = useState('');

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

      // Realistic AI processing steps with progress updates
      const steps = [
        { message: 'Initializing AI document parser...', progress: 10, delay: 600 },
        { message: 'Extracting text content...', progress: 25, delay: 1200 },
        { message: 'Identifying resume sections...', progress: 40, delay: 1000 },
        { message: 'Parsing contact information...', progress: 55, delay: 800 },
        { message: 'Analyzing work experience...', progress: 70, delay: 1100 },
        { message: 'Processing skills and education...', progress: 85, delay: 900 },
        { message: 'Optimizing content structure...', progress: 95, delay: 700 },
        { message: 'Finalizing import...', progress: 100, delay: 500 }
      ];

      for (const step of steps) {
        setCurrentStep(step.message);
        await new Promise(resolve => setTimeout(resolve, step.delay));
        setProgress(step.progress);
      }

      // Generate comprehensive extracted resume data
      const extractedData: Partial<ResumeData> = {
        personalInfo: {
          fullName: 'Alexandra Chen',
          email: 'alexandra.chen@email.com',
          phone: '+1 (555) 987-6543',
          location: 'Seattle, WA',
          linkedin: 'https://linkedin.com/in/alexandrachen',
          website: 'https://alexandrachen.dev',
          summary: 'Senior Full Stack Engineer with 8+ years of expertise in React, Node.js, and cloud architecture. Proven track record of leading high-performing teams and delivering scalable applications that serve millions of users. Specialized in building microservices architectures that improved system reliability by 99.9% and reduced deployment time by 75%. Passionate about mentoring developers and driving technical innovation in fast-paced environments.'
        },
        workExperience: [
          {
            id: '1',
            company: 'Microsoft',
            position: 'Senior Software Engineer',
            startDate: '2021-03',
            endDate: '',
            isCurrentJob: true,
            description: '• Lead development of Azure DevOps features serving 10M+ developers worldwide with 99.99% uptime\n• Architected microservices infrastructure reducing API response time by 60% and supporting 50M+ daily requests\n• Mentored team of 12 engineers across 3 time zones, achieving 95% sprint completion rate and 100% retention\n• Implemented automated testing pipelines reducing production bugs by 80% and deployment time by 70%\n• Collaborated with product managers to define technical roadmap, delivering 15+ major features ahead of schedule\n• Optimized database queries and caching strategies, improving application performance by 45% and reducing costs by $200K annually'
          },
          {
            id: '2',
            company: 'Stripe',
            position: 'Full Stack Engineer',
            startDate: '2019-01',
            endDate: '2021-02',
            isCurrentJob: false,
            description: '• Built and maintained payment processing systems handling $50B+ in annual transaction volume\n• Developed React-based dashboard used by 100K+ merchants, improving user satisfaction scores by 40%\n• Implemented real-time fraud detection algorithms reducing false positives by 35% and saving $5M annually\n• Led migration from monolithic to microservices architecture, improving system scalability by 300%\n• Collaborated with cross-functional teams to launch Stripe Terminal, contributing to $100M+ revenue growth\n• Established code review standards and best practices, improving code quality metrics by 50%'
          },
          {
            id: '3',
            company: 'Airbnb',
            position: 'Software Engineer',
            startDate: '2017-06',
            endDate: '2018-12',
            isCurrentJob: false,
            description: '• Developed booking and reservation systems processing 2M+ transactions daily with 99.8% reliability\n• Built responsive web applications using React and Redux, supporting 15+ languages and 190+ countries\n• Implemented A/B testing framework that increased conversion rates by 25% and generated $50M+ additional revenue\n• Optimized search algorithms improving property discovery relevance by 40% and user engagement by 30%\n• Collaborated with data science team to build recommendation engine increasing booking completion by 20%\n• Maintained high code quality standards with 90%+ test coverage and comprehensive documentation'
          }
        ],
        education: [
          {
            id: '1',
            school: 'Stanford University',
            degree: 'Master of Science',
            field: 'Computer Science',
            graduationDate: '2017-06',
            gpa: '3.8'
          },
          {
            id: '2',
            school: 'University of California, Berkeley',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            graduationDate: '2015-05',
            gpa: '3.7'
          }
        ],
        skills: [
          { id: '1', name: 'JavaScript', level: 'Expert' as const },
          { id: '2', name: 'TypeScript', level: 'Expert' as const },
          { id: '3', name: 'React', level: 'Expert' as const },
          { id: '4', name: 'Node.js', level: 'Expert' as const },
          { id: '5', name: 'Python', level: 'Advanced' as const },
          { id: '6', name: 'AWS', level: 'Advanced' as const },
          { id: '7', name: 'Docker', level: 'Advanced' as const },
          { id: '8', name: 'Kubernetes', level: 'Advanced' as const },
          { id: '9', name: 'PostgreSQL', level: 'Advanced' as const },
          { id: '10', name: 'Redis', level: 'Intermediate' as const },
          { id: '11', name: 'GraphQL', level: 'Advanced' as const },
          { id: '12', name: 'MongoDB', level: 'Intermediate' as const },
          { id: '13', name: 'Next.js', level: 'Advanced' as const },
          { id: '14', name: 'Terraform', level: 'Intermediate' as const }
        ],
        certifications: [
          {
            id: '1',
            name: 'AWS Certified Solutions Architect - Professional',
            issuer: 'Amazon Web Services',
            dateObtained: '2023-08',
            expirationDate: '2026-08',
            credentialId: 'AWS-PSA-2023-7891'
          },
          {
            id: '2',
            name: 'Certified Kubernetes Administrator',
            issuer: 'Cloud Native Computing Foundation',
            dateObtained: '2022-11',
            expirationDate: '2025-11',
            credentialId: 'CKA-2022-4567'
          }
        ],
        projects: [
          {
            id: '1',
            name: 'DevTools Analytics Platform',
            description: 'Built comprehensive analytics platform for developer tools usage, processing 100M+ events daily with real-time dashboards and ML-powered insights',
            technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Docker'],
            startDate: '2023-01',
            endDate: '2023-08',
            isOngoing: false,
            url: 'https://github.com/alexandrachen/devtools-analytics'
          }
        ],
        languages: [
          { id: '1', name: 'English', proficiency: 'Native' as const },
          { id: '2', name: 'Mandarin', proficiency: 'Fluent' as const },
          { id: '3', name: 'Spanish', proficiency: 'Conversational' as const }
        ],
        references: [],
        customSections: []
      };

      setStatus('success');
      setCurrentStep('Resume successfully imported!');
      onResumeExtracted(extractedData);
      
      // Reset after success
      setTimeout(() => {
        setStatus('idle');
        setProgress(0);
        setCurrentStep('');
      }, 3000);

    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred while processing the file');
      setCurrentStep('');
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
        return <CheckCircle className="h-8 w-8 text-emerald-500" />;
      case 'error':
        return <AlertCircle className="h-8 w-8 text-red-500" />;
      default:
        return (
          <div className="relative">
            <Upload className="h-8 w-8 text-indigo-500" />
            <Sparkles className="h-4 w-4 text-purple-500 absolute -top-1 -right-1" />
          </div>
        );
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'processing':
        return currentStep || 'Processing your resume...';
      case 'success':
        return 'Resume successfully imported with AI enhancement!';
      case 'error':
        return errorMessage || 'Error processing resume. Please try again.';
      default:
        return 'Import your existing resume and let AI enhance it instantly';
    }
  };

  const getContainerClasses = () => {
    let classes = 'transition-all duration-300 ';
    
    if (isDragOver) {
      classes += 'border-indigo-400 bg-indigo-50 scale-105 ';
    } else if (status === 'processing') {
      classes += 'border-indigo-300 bg-indigo-50 ';
    } else if (status === 'success') {
      classes += 'border-emerald-300 bg-emerald-50 ';
    } else if (status === 'error') {
      classes += 'border-red-300 bg-red-50 ';
    } else {
      classes += 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 ';
    }
    
    return classes;
  };

  return (
    <Card className={`card-modern ${getContainerClasses()}`}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">Smart Resume Import</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div 
          className="flex flex-col items-center space-y-6 p-12 rounded-2xl border-2 border-dashed transition-all duration-300"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ borderColor: isDragOver ? '#6366f1' : '#d1d5db' }}
        >
          {getStatusIcon()}
          
          <div className="max-w-md">
            <p className="text-lg font-medium mb-3 text-gray-800">
              {getStatusMessage()}
            </p>
            {status === 'idle' && (
              <p className="text-sm text-gray-600">
                Drag and drop your resume here, or click to browse. Our AI will extract and enhance your content automatically.
              </p>
            )}
          </div>

          {isProcessing && (
            <div className="w-full max-w-sm space-y-3">
              <Progress value={progress} className="h-2" />
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-indigo-600 font-medium">{progress}% complete</p>
              </div>
            </div>
          )}

          {status === 'idle' && (
            <div className="space-y-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload">
                <Button asChild className="btn-primary cursor-pointer text-base px-8 py-3">
                  <span>
                    <Upload className="h-5 w-5 mr-3" />
                    Choose File
                  </span>
                </Button>
              </label>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Supports PDF, DOC, DOCX, and TXT files</p>
                <p>Maximum file size: 10MB</p>
                <div className="flex items-center justify-center space-x-2 mt-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-emerald-600 font-medium">AI-Powered Enhancement</span>
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <Button
              onClick={() => {
                setStatus('idle');
                setErrorMessage('');
                setProgress(0);
                setCurrentStep('');
              }}
              variant="outline"
              className="mt-4 rounded-xl border-red-200 text-red-700 hover:bg-red-50"
            >
              Try Again
            </Button>
          )}

          {status === 'success' && (
            <div className="flex items-center space-x-2 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Ready to customize your resume!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}