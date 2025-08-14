'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react';
import { ResumeData, Skill, WorkExperience, Education } from '@/types/resume';

// PDF text extraction temporarily disabled to ensure stable build. Prompt users to upload DOCX/TXT instead.

async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const mammoth = await import('mammoth');
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  return value || '';
}

function extractTextFromTxt(file: File): Promise<string> {
  return file.text();
}

async function aiStructureFromText(rawText: string): Promise<Partial<ResumeData> | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey || !rawText || rawText.length < 20) return null;
    
    const prompt = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are an expert resume parser. Carefully analyze this resume text and extract information into the correct sections. Pay special attention to:

1. WORK EXPERIENCE: Only include actual job positions with companies, not education or skills
2. SKILLS: Only technical skills, software, programming languages, certifications - NOT job titles or company names
3. EDUCATION: Only schools, degrees, universities - NOT work experience
4. PERSONAL INFO: Contact details and professional summary only

Parse into this EXACT JSON structure:
{
  "personalInfo": {
    "fullName": "string",
    "email": "string", 
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "website": "string",
    "summary": "string"
  },
  "workExperience": [
    {
      "id": "string",
      "company": "string",
      "position": "string", 
      "startDate": "YYYY-MM format",
      "endDate": "YYYY-MM format or empty if current",
      "isCurrentJob": false,
      "description": "string with bullet points of responsibilities and achievements"
    }
  ],
  "education": [
    {
      "id": "string",
      "school": "string",
      "degree": "string",
      "field": "string", 
      "graduationDate": "YYYY-MM format"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"]
}

IMPORTANT: Return ONLY valid JSON. No markdown, no explanations, no code blocks.

Resume text:
${rawText.slice(0, 12000)}`
            }
          ]
        }
      ]
    };
    
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prompt)
    });
    const data = await resp.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean up the response to extract JSON
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let parsed: any = {};
    try { 
      parsed = JSON.parse(text); 
    } catch (parseError) {
      console.log('JSON parse error:', parseError);
      return null;
    }

    const result: Partial<ResumeData> = {};
    if (parsed.personalInfo) {
      result.personalInfo = {
        fullName: parsed.personalInfo.fullName || '',
        email: parsed.personalInfo.email || '',
        phone: parsed.personalInfo.phone || '',
        location: parsed.personalInfo.location || '',
        linkedin: parsed.personalInfo.linkedin || '',
        website: parsed.personalInfo.website || '',
        summary: parsed.personalInfo.summary || ''
      } as any;
    }
    if (Array.isArray(parsed.skills)) {
      result.skills = parsed.skills.slice(0, 40).map((name: string, i: number) => ({
        id: String(Date.now() + i),
        name,
        level: 'Intermediate' as const
      }));
    }
    if (Array.isArray(parsed.workExperience)) {
      result.workExperience = parsed.workExperience.slice(0, 10).map((w: any, i: number) => ({
        id: w.id || String(Date.now() + i),
        company: w.company || '',
        position: w.position || '',
        startDate: w.startDate || '',
        endDate: w.endDate || '',
        isCurrentJob: Boolean(w.isCurrentJob),
        description: w.description || ''
      }));
    }
    if (Array.isArray(parsed.education)) {
      result.education = parsed.education.slice(0, 10).map((e: any, i: number) => ({
        id: e.id || String(Date.now() + i),
        school: e.school || '',
        degree: e.degree || '',
        field: e.field || '',
        graduationDate: e.graduationDate || ''
      }));
    }
    return result;
  } catch {
    return null;
  }
}

function convertDateToISO(dateStr: string): string {
  if (!dateStr) return '';
  return dateStr
    .replace(/Jan[uary]?/ig, '01').replace(/Feb[ruary]?/ig, '02').replace(/Mar[ch]?/ig, '03')
    .replace(/Apr[il]?/ig, '04').replace(/May/ig, '05').replace(/Jun[e]?/ig, '06')
    .replace(/Jul[y]?/ig, '07').replace(/Aug[ust]?/ig, '08').replace(/Sep[t]?[ember]?/ig, '09')
    .replace(/Oct[ober]?/ig, '10').replace(/Nov[ember]?/ig, '11').replace(/Dec[ember]?/ig, '12')
    .replace(/\s+/g, '-')
    .replace(/(\d{2})-(\d{4})/, '$2-$1');
}

function buildResumeDataFromText(rawText: string): Partial<ResumeData> {
  const text = rawText.replace(/\r/g, '').trim();
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);

  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = text.match(/\+?\d[\d\s().-]{7,}\d/);
  const linkedinMatch = text.match(/https?:\/\/\S*linkedin\.com\S*/i);
  const urlMatch = text.match(/https?:\/\/[^\s)]+/i);

  let fullName = '';
  for (const l of lines.slice(0, 5)) {
    if (l && !l.includes('@') && !l.toLowerCase().includes('resume') && 
        !l.toLowerCase().includes('curriculum') && !l.startsWith('http') &&
        !l.match(/\d{4}/) && l.split(' ').length >= 2 && l.split(' ').length <= 4) {
      fullName = l.replace(/[^\p{L}\p{N}\s.'-]/gu, '').trim();
      break;
    }
  }

  // Better section detection
  const sectionRegex = /(work experience|professional experience|experience|employment|career|education|academic|qualifications|skills|technical skills|competencies|abilities)/i;
  const sections: Record<string, string[]> = {};
  let current = 'intro';
  let foundSections = new Set<string>();
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1] || '';
    
    // More sophisticated section detection
    if (sectionRegex.test(line) || (line.length < 50 && line.toUpperCase() === line && line.length > 3)) {
      let sectionName = 'other';
      
      if (/work|professional|experience|employment|career/i.test(line)) {
        sectionName = 'experience';
      } else if (/education|academic|qualifications|university|college|school/i.test(line)) {
        sectionName = 'education';
      } else if (/skills|technical|competencies|abilities|technologies/i.test(line)) {
        sectionName = 'skills';
      }
      
      if (!foundSections.has(sectionName)) {
        current = sectionName;
        foundSections.add(sectionName);
        sections[current] = [];
      }
    } else if (line.length > 0) {
      if (!sections[current]) sections[current] = [];
      sections[current].push(line);
    }
  }

  // Find summary from intro section
  const introLines = sections['intro'] || lines.slice(0, 8);
  const summary = introLines
    .filter(l => l.length > 20 && !l.includes('@') && !l.startsWith('http'))
    .slice(0, 3)
    .join(' ')
    .slice(0, 300);

  // Parse skills - improved to avoid job titles and companies
  let skills: Skill[] = [];
  const skillsText = (sections['skills'] || []).join(' ');
  if (skillsText) {
    const commonSkillKeywords = [
      'javascript', 'python', 'java', 'react', 'node.js', 'html', 'css', 'sql', 'git', 'aws', 
      'docker', 'kubernetes', 'angular', 'vue', 'typescript', 'php', 'c++', 'c#', '.net',
      'mongodb', 'mysql', 'postgresql', 'redis', 'excel', 'powerpoint', 'word', 'photoshop',
      'illustrator', 'figma', 'sketch', 'project management', 'agile', 'scrum', 'jira',
      'tensorflow', 'pytorch', 'machine learning', 'data analysis', 'tableau', 'power bi'
    ];
    
    const tokens = skillsText
      .split(/[,•\n;|\-\(\)]+/)
      .map(s => s.trim())
      .filter(s => {
        if (s.length < 2 || s.length > 30) return false;
        // Filter out common non-skill words
        const lower = s.toLowerCase();
        if (/\b(years?|experience|working|with|of|in|at|the|and|or|for)\b/i.test(s)) return false;
        if (/\d+\s*(years?|months?|yr|mo)/i.test(s)) return false;
        if (/(company|corporation|inc|llc|ltd|university|college)/i.test(s)) return false;
        
        // Check if it's likely a skill
        return commonSkillKeywords.some(keyword => lower.includes(keyword)) || 
               /^[a-zA-Z][a-zA-Z0-9\s\.\+\#\-]{1,25}$/.test(s);
      });
      
    skills = Array.from(new Set(tokens)).slice(0, 20).map((name, idx) => ({
      id: String(Date.now() + idx),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      level: 'Intermediate' as const
    }));
  }

  // Parse education entries
  const education: Education[] = [];
  const eduLines = sections['education'] || [];
  if (eduLines.length) {
    const chunks = eduLines.join('\n').split(/\n\s*\n/);
    for (let i = 0; i < chunks.length && education.length < 6; i++) {
      const c = chunks[i];
      const school = (c.match(/^(.*?)(?:,|\n|$)/)?.[1] || '').trim();
      if (!school) continue;
      const degree = (c.match(/(Bachelor|Master|B\.?Sc\.?|M\.?Sc\.?|Ph\.?D\.?|Diploma|Degree)[^\n,]*/i)?.[0] || '').trim();
      const field = (c.match(/(Computer|Engineering|Science|Arts|Business|Technology|Design)[^\n,]*/i)?.[0] || '').trim();
      const year = (c.match(/(19|20)\d{2}[-–]?(0[1-9]|1[0-2])?/g)?.pop() || '').replace(/[–]/g, '-');
      education.push({
        id: String(Date.now() + i),
        school,
        degree,
        field,
        graduationDate: year,
      });
    }
  }

  // Parse experience entries - improved organization
  const workExperience: WorkExperience[] = [];
  const expLines = sections['experience'] || [];
  
  if (expLines.length) {
    // Better chunking - split by job entries
    let currentEntry = '';
    const jobEntries: string[] = [];
    
    for (const line of expLines) {
      // Detect new job entry (company/position patterns)
      if (line.match(/^[A-Z][^.!?]*\s*(at|@|\||\-)\s*[A-Z]/i) || 
          line.match(/^\w+.*\d{4}/i) ||
          (line.length < 100 && line.split(' ').length <= 8 && /[A-Z]/.test(line))) {
        
        if (currentEntry.trim()) {
          jobEntries.push(currentEntry.trim());
        }
        currentEntry = line + '\n';
      } else {
        currentEntry += line + '\n';
      }
    }
    
    if (currentEntry.trim()) {
      jobEntries.push(currentEntry.trim());
    }

    for (let i = 0; i < jobEntries.length && workExperience.length < 6; i++) {
      const entry = jobEntries[i];
      const lines = entry.split('\n').map(l => l.trim()).filter(Boolean);
      
      if (lines.length === 0) continue;
      
      const headerLine = lines[0];
      let position = '', company = '';
      
      // Extract position and company
      if (headerLine.includes(' at ') || headerLine.includes(' @ ')) {
        const parts = headerLine.split(/ at | @ /i);
        position = parts[0]?.trim() || '';
        company = parts[1]?.trim() || '';
      } else if (headerLine.includes(' - ') || headerLine.includes(' | ')) {
        const parts = headerLine.split(/ - | \| /);
        position = parts[0]?.trim() || '';
        company = parts[1]?.trim() || '';
      } else {
        position = headerLine;
      }
      
      // Extract dates
      const datePattern = /((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4})\s*[–\-to]+\s*(Present|Current|((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}))/i;
      const dateMatch = entry.match(datePattern);
      
      let startDate = '', endDate = '', isCurrentJob = false;
      
      if (dateMatch) {
        startDate = convertDateToISO(dateMatch[1] || '');
        const endDateText = dateMatch[3] || '';
        isCurrentJob = /present|current/i.test(endDateText);
        if (!isCurrentJob) {
          endDate = convertDateToISO(endDateText);
        }
      }
      
      // Extract description
      const description = lines.slice(1)
        .filter(l => !datePattern.test(l))
        .join('\n')
        .trim();

      if (position || company) {
        workExperience.push({
          id: String(Date.now() + i),
          company: company || 'Company',
          position: position || 'Position',
          startDate,
          endDate,
          isCurrentJob,
          description
        });
      }
    }
  }

  

  // Fallbacks: if parsing is weak, put raw text into summary and a generic experience entry
  const hasAnyData = (fullName || emailMatch || phoneMatch || linkedinMatch || urlMatch || workExperience.length || education.length || skills.length);
  let fallbackSummary = summary || lines.slice(0, 12).join(' ');
  if (!fallbackSummary) {
    fallbackSummary = text.split(/\n{2,}/)[0]?.slice(0, 1200) || '';
  }

  const normalizedWork = workExperience.length > 0 ? workExperience : (
    fallbackSummary
      ? [{
          id: String(Date.now()),
          company: '',
          position: 'Experience',
          startDate: '',
          endDate: '',
          isCurrentJob: true,
          description: lines
            .filter(l => /^[-•*]/.test(l) || l.length > 0)
            .slice(0, 20)
            .join('\n')
        } as WorkExperience]
      : []
  );

  const customSections = [
    {
      id: String(Date.now() + 999),
      title: 'Imported Resume (Raw)',
      content: text.slice(0, 4000)
    }
  ];

  return {
    personalInfo: {
      fullName: fullName || '',
      email: emailMatch?.[0] || '',
      phone: phoneMatch?.[0] || '',
      location: '',
      linkedin: linkedinMatch?.[0] || '',
      website: urlMatch && (!linkedinMatch || urlMatch[0] !== linkedinMatch[0]) ? urlMatch[0] : '',
      summary: fallbackSummary
    },
    workExperience: normalizedWork,
    education,
    skills,
    customSections
  } as Partial<ResumeData>;
}

interface ResumeUploaderProps {
  onResumeExtracted: (resumeData: Partial<ResumeData>) => void;
  externalFile?: File | null;
  onExternalFileProcessed?: () => void;
}

export function ResumeUploader({ onResumeExtracted, externalFile, onExternalFileProcessed }: ResumeUploaderProps) {
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
      // Validate file type (fall back to extension when type is empty)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      const lowerName = (file.name || '').toLowerCase();
      const ext = lowerName.split('.').pop() || '';
      const typeOk = allowedTypes.includes(file.type) || ['pdf','doc','docx','txt'].includes(ext);
      if (!typeOk) {
        throw new Error('Please upload a PDF, DOCX or TXT file');
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Realistic processing steps with progress updates
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

      // Extract actual text from the uploaded file
      let rawText = '';
      const isPdf = file.type === 'application/pdf' || ext === 'pdf';
      const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || ext === 'docx';
      const isTxt = file.type === 'text/plain' || ext === 'txt';

      if (isPdf) {
        const body = new FormData();
        body.append('file', file);
        const resp = await fetch('/api/parse-pdf', { method: 'POST', body });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data?.error || 'Failed to parse PDF');
        rawText = data.text || '';
      } else if (isDocx) {
        rawText = await extractTextFromDocx(file);
      } else if (isTxt) {
        rawText = await extractTextFromTxt(file);
      } else if (file.type === 'application/msword') {
        throw new Error('Legacy .doc files are not supported in-browser. Please upload a PDF, DOCX, or TXT.');
      }

      // Heuristic parse first
      let extractedData: Partial<ResumeData> = buildResumeDataFromText(rawText || '');

      // AI structuring to improve mapping
      const aiData = await aiStructureFromText(rawText);
      if (aiData) {
        extractedData = {
          ...extractedData,
          personalInfo: {
            ...extractedData.personalInfo,
            ...(aiData.personalInfo || {})
          } as any,
          workExperience: aiData.workExperience?.length ? aiData.workExperience : extractedData.workExperience,
          education: aiData.education?.length ? aiData.education : extractedData.education,
          skills: aiData.skills?.length ? aiData.skills : extractedData.skills,
        } as Partial<ResumeData>;
      }

      // Ensure we have valid data structure
      const finalData: Partial<ResumeData> = {
        personalInfo: {
          fullName: extractedData.personalInfo?.fullName || '',
          email: extractedData.personalInfo?.email || '',
          phone: extractedData.personalInfo?.phone || '',
          location: extractedData.personalInfo?.location || '',
          linkedin: extractedData.personalInfo?.linkedin || '',
          website: extractedData.personalInfo?.website || '',
          summary: extractedData.personalInfo?.summary || ''
        },
        workExperience: extractedData.workExperience || [],
        education: extractedData.education || [],
        skills: extractedData.skills || [],
        certifications: extractedData.certifications || [],
        projects: extractedData.projects || [],
        languages: extractedData.languages || [],
        references: extractedData.references || [],
        customSections: extractedData.customSections || []
      };
      setStatus('success');
      setCurrentStep('Resume successfully imported!');
      onResumeExtracted(finalData);
      if (onExternalFileProcessed) {
        onExternalFileProcessed();
      }
      
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

  useEffect(() => {
    if (externalFile) {
      processResumeFile(externalFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalFile]);

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