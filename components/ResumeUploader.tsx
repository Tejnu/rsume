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
              text: `You are an expert resume parser. Analyze this resume text and extract information accurately. Follow these rules:

1. WORK EXPERIENCE: 
   - Extract job positions with company names and dates
   - Look for: "Position at Company", "Company - Position", "Position | Company"
   - Common patterns: Software Engineer at Google, Marketing Manager - Microsoft
   - Include start/end dates (MM/YYYY format preferred)
   - Extract job descriptions and responsibilities
   - DO NOT confuse education with work experience

2. SKILLS: 
   - Technical skills: programming languages, frameworks, tools
   - Software: Microsoft Office, Adobe Creative Suite, etc.
   - Certifications and technical competencies
   - EXCLUDE: job titles, company names, degrees, soft skills

3. EDUCATION: 
   - Universities, colleges, schools, institutions
   - Degree types: Bachelor's, Master's, PhD, Associate, Certificate
   - Fields of study: Computer Science, Business, Engineering, etc.
   - Graduation dates and GPAs if mentioned

4. PERSONAL INFO: 
   - Full name (usually at the top)
   - Email address, phone number
   - LinkedIn profile, personal website, GitHub
   - Location/address, professional summary

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
  "skills": ["skill1", "skill2", "skill3"],
  "certifications": ["cert1", "cert2"],
  "projects": [
    {
      "id": "string",
      "name": "string",
      "description": "string"
    }
  ]
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
    if (Array.isArray(parsed.certifications)) {
      result.certifications = parsed.certifications.slice(0, 10).map((c: any, i: number) => ({
        id: c.id || String(Date.now() + i),
        name: c.name || '',
        description: c.description || ''
      }));
    }
    if (Array.isArray(parsed.projects)) {
      result.projects = parsed.projects.slice(0, 10).map((p: any, i: number) => ({
        id: p.id || String(Date.now() + i),
        name: p.name || '',
        description: p.description || ''
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

  // Enhanced contact information extraction
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = text.match(/(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/);
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i);
  const urlMatch = text.match(/(?:https?:\/\/)?(?:www\.)?[\w-]+\.(?:com|net|org|io|dev|co)(?:\/[\w-]*)?/i);

  // Extract location information
  const locationMatch = text.match(/(.*?)(?:,\s*)?(?:Australia|India|USA|UK|Canada|Singapore|Germany|France|Japan|China|United States|New Zealand|South Africa)/i);
  let location = '';
  if (locationMatch) {
    location = locationMatch[0].trim();
  }

  // Enhanced name extraction - look for the first meaningful line that looks like a name
  let fullName = '';
  for (const l of lines.slice(0, 8)) {
    if (l && !l.includes('@') && !l.toLowerCase().includes('resume') && 
        !l.toLowerCase().includes('curriculum') && !l.startsWith('http') &&
        !l.match(/\d{4}/) && l.split(' ').length >= 2 && l.split(' ').length <= 5) {
      // Check if it looks like a name (title case, no special chars except apostrophes/hyphens)
      if (/^[A-Z][a-z]+(?:\s[A-Z][a-z'-]*)*$/.test(l) || 
          /^[A-Z][a-z]+(?:\s[A-Z]\.?)*(?:\s[A-Z][a-z'-]*)+$/.test(l)) {
        fullName = l.replace(/[^\p{L}\p{N}\s.'-]/gu, '').trim();
        break;
      }
    }
  }

  // Better section detection
  const sectionRegex = /(work experience|professional experience|experience|employment|career|education|academic|qualifications|skills|technical skills|competencies|abilities|certifications?|certificates?|licensed?|courses?|training|coursework|projects?|personal projects?|side projects?|extracurricular|activities|volunteer|achievements?|honors?|awards?)/i;
  const sections: Record<string, string[]> = {};
  let currentSection = 'intro';
  const foundSections = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Improved section header detection
    if (sectionRegex.test(line) || (line.length < 50 && line.toUpperCase() === line && line.length > 3 && !line.includes(' ') && !line.includes(':'))) {
      let identifiedSection = 'other';

      if (/^(experience|work|employment|career|professional)/i.test(line)) {
        identifiedSection = 'work';
      } else if (/^(education|academic|school|university|college)/i.test(line)) {
        identifiedSection = 'education';
      } else if (/^(skills|technical|abilities|competencies)/i.test(line)) {
        identifiedSection = 'skills';
      } else if (/^(personal|contact|profile|summary|objective)/i.test(line)) {
        identifiedSection = 'personal';
      } else if (/^(certifications?|certificates?|licensed?)/i.test(line)) {
        identifiedSection = 'certifications';
      } else if (/^(courses?|training|coursework)/i.test(line)) {
        identifiedSection = 'courses';
      } else if (/^(projects?|personal projects?|side projects?)/i.test(line)) {
        identifiedSection = 'projects';
      } else if (/^(extracurricular|activities|volunteer)/i.test(line)) {
        identifiedSection = 'extracurricular';
      } else if (/^(achievements?|honors?|awards?)/i.test(line)) {
        identifiedSection = 'achievements';
      }

      if (!foundSections.has(identifiedSection)) {
        currentSection = identifiedSection;
        foundSections.add(identifiedSection);
        sections[currentSection] = [];
      }
    } else if (line.length > 0) {
      if (!sections[currentSection]) sections[currentSection] = [];
      sections[currentSection].push(line);
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

  // Parse education entries with better school detection
  const education: Education[] = [];
  const eduLines = sections['education'] || [];
  if (eduLines.length) {
    // Split education entries by empty lines or clear separators
    const chunks = eduLines.join('\n').split(/\n\s*\n|\n(?=\d{4})/);
    for (let i = 0; i < chunks.length && education.length < 6; i++) {
      const c = chunks[i].trim();
      if (!c) continue;
      
      // Enhanced school name detection
      const schoolPatterns = [
        /^(.*?(?:University|College|Institute|School|Academy)[^\n,]*)/i,
        /^([A-Z][A-Za-z\s&,'-]+(?:University|College|Institute|School|Academy))/i,
        /^(.*?)(?:,|\n)/
      ];
      
      let school = '';
      for (const pattern of schoolPatterns) {
        const match = c.match(pattern);
        if (match && match[1] && match[1].length > 3) {
          school = match[1].trim();
          break;
        }
      }
      
      if (!school) {
        // Take the first meaningful line as school name
        const firstLine = c.split('\n')[0];
        if (firstLine && firstLine.length > 3) {
          school = firstLine.trim();
        }
      }
      
      if (!school) continue;
      
      // Enhanced degree detection
      const degreePatterns = [
        /(Bachelor[^,\n]*|Master[^,\n]*|B\.?Sc\.?[^,\n]*|M\.?Sc\.?[^,\n]*|Ph\.?D\.?[^,\n]*|Diploma[^,\n]*|Certificate[^,\n]*|Associate's[^,\n]*|High School Diploma)/i,
        /(B\.?A\.?|B\.?S\.?|M\.?A\.?|M\.?S\.?|MBA|PhD)[^,\n]*/i
      ];
      
      let degree = '';
      for (const pattern of degreePatterns) {
        const match = c.match(pattern);
        if (match) {
          degree = match[0].trim();
          break;
        }
      }
      
      // Enhanced field detection
      const fieldPatterns = [
        /(Computer Science|Information Technology|Software Engineering|Computer Engineering|Data Science|Artificial Intelligence|Machine Learning|Cybersecurity)/i,
        /(Business Administration|Management|Marketing|Finance|Economics|Accounting)/i,
        /(Engineering|Mechanical Engineering|Electrical Engineering|Civil Engineering)/i,
        /(Arts|Science|Mathematics|Physics|Chemistry|Biology|Psychology|Design)/i,
        /in\s+([A-Z][A-Za-z\s]+?)(?:,|\n|$)/i,
        /of\s+([A-Z][A-Za-z\s]+?)(?:,|\n|$)/i
      ];
      
      let field = '';
      for (const pattern of fieldPatterns) {
        const match = c.match(pattern);
        if (match) {
          field = match[1] || match[0];
          field = field.replace(/^(in|of)\s+/i, '').trim();
          break;
        }
      }
      
      // Enhanced date extraction
      const dateMatches = c.match(/(20\d{2}|19\d{2})/g);
      const year = dateMatches ? dateMatches[dateMatches.length - 1] : '';
      
      education.push({
        id: String(Date.now() + i),
        school: school.replace(/[,.]$/, ''),
        degree: degree.replace(/[,.]$/, ''),
        field: field.replace(/[,.]$/, ''),
        graduationDate: year ? `${year}-06` : '',
      });
    }
  }

  // Parse certifications
  const certifications = (sections['certifications'] || []).map((certText, i) => {
    const name = certText.split('\n')[0]?.trim() || '';
    const description = certText.split('\n').slice(1).join('\n').trim();
    return { id: String(Date.now() + i), name, description };
  }).slice(0, 10);

  // Parse projects
  const projects = (sections['projects'] || []).map((projText, i) => {
    const name = projText.split('\n')[0]?.trim() || '';
    const description = projText.split('\n').slice(1).join('\n').trim();
    return { id: String(Date.now() + i), name, description };
  }).slice(0, 10);

  // Parse experience entries - improved logic
  const workExperience: WorkExperience[] = [];
  const expLines = sections['work'] || [];

  if (expLines.length) {
    // Better job entry detection
    const jobEntries: string[] = [];
    let currentEntry = '';
    
    for (let i = 0; i < expLines.length; i++) {
      const line = expLines[i];
      const nextLine = expLines[i + 1] || '';
      
      // Check if this line starts a new job entry
      const isNewJobEntry = 
        // Position at Company format
        /^[A-Z][^.!?]*\s+(at|@|\|)\s+[A-Z][A-Za-z\s&.,'-]+$/i.test(line) ||
        // Company - Position format
        /^[A-Z][A-Za-z\s&.,'-]+\s+[-–]\s+[A-Z][^.!?]*$/i.test(line) ||
        // Company, Position format
        /^[A-Z][A-Za-z\s&.,'-]+,\s+[A-Z][^.!?]*$/i.test(line) ||
        // Company name patterns (with indicators)
        (/^[A-Z][A-Za-z\s&.,'-]*(?:Inc|LLC|Corp|Ltd|Co\.|Company|Group|Solutions|Technologies|Services|Consulting|Agency|Pty|Limited)\.?$/i.test(line) && 
         nextLine && /^[A-Z][^.!?]*$/.test(nextLine) && !nextLine.includes('•')) ||
        // Job title patterns followed by company
        (/^(?:Senior|Junior|Lead|Chief|Head of|VP|Vice President|President|Director|Manager|Analyst|Engineer|Developer|Designer|Specialist|Coordinator|Assistant|Intern)/i.test(line) && 
         !line.includes('•') && line.length < 80);

      // If this is a new job entry and we have content, save the current entry
      if (isNewJobEntry && currentEntry.trim()) {
        jobEntries.push(currentEntry.trim());
        currentEntry = line + '\n';
      } else {
        currentEntry += line + '\n';
      }
    }

    if (currentEntry.trim()) {
      jobEntries.push(currentEntry.trim());
    }

    // Parse each job entry
    for (let i = 0; i < Math.min(jobEntries.length, 6); i++) {
      const entry = jobEntries[i];
      const entryLines = entry.split('\n').map(l => l.trim()).filter(Boolean);

      if (entryLines.length === 0) continue;

      let position = '', company = '', startDate = '', endDate = '', isCurrentJob = false;
      let description = '';

      // Enhanced company and position extraction
      const firstLine = entryLines[0];
      const secondLine = entryLines[1] || '';

      // Pattern matching for first line
      if (firstLine.includes(' at ') || firstLine.includes(' @ ')) {
        const parts = firstLine.split(/ at | @ /i);
        position = parts[0]?.trim() || '';
        company = parts[1]?.trim().replace(/[,.]$/, '') || '';
      } else if (firstLine.includes(' - ') && !firstLine.includes('•')) {
        const parts = firstLine.split(' - ');
        if (parts.length === 2) {
          company = parts[0]?.trim() || '';
          position = parts[1]?.trim().replace(/[,.]$/, '') || '';
        }
      } else if (firstLine.includes(', ') && !firstLine.includes('•')) {
        const parts = firstLine.split(', ');
        if (parts.length === 2) {
          company = parts[0]?.trim() || '';
          position = parts[1]?.trim().replace(/[,.]$/, '') || '';
        }
      } else {
        // Check if first line is company or position based on patterns
        const hasCompanyIndicators = /\b(Inc|LLC|Corp|Ltd|Co\.|Company|Group|Solutions|Technologies|Services|Consulting|Agency)\b/i.test(firstLine);
        const hasPositionIndicators = /\b(Manager|Director|Developer|Engineer|Analyst|Specialist|Coordinator|Assistant|Lead|Senior|Junior|Intern|Chief|VP|President)\b/i.test(firstLine);

        if (hasCompanyIndicators && !hasPositionIndicators) {
          company = firstLine.replace(/[,.]$/, '');
          position = secondLine.replace(/[,.]$/, '') || 'Position';
        } else if (hasPositionIndicators && !hasCompanyIndicators) {
          position = firstLine.replace(/[,.]$/, '');
          company = secondLine.replace(/[,.]$/, '') || 'Company';
        } else {
          // Default: first line is position, second is company
          position = firstLine.replace(/[,.]$/, '');
          company = secondLine.replace(/[,.]$/, '') || 'Company';
        }
      }

      // Enhanced date extraction with multiple patterns
      const datePatterns = [
        /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4})\s*[-–to]+\s*(Present|Current|(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}))/i,
        /(\d{1,2}\/\d{4})\s*[-–to]+\s*(Present|Current|\d{1,2}\/\d{4})/i,
        /(\d{4})\s*[-–to]+\s*(Present|Current|\d{4})/i,
        /(20\d{2})\s*[-–to]+\s*(Present|Current|20\d{2})/i
      ];

      for (const pattern of datePatterns) {
        const dateMatch = entry.match(pattern);
        if (dateMatch) {
          startDate = convertDateToISO(dateMatch[1] || '');
          const endDateText = dateMatch[2] || '';
          isCurrentJob = /present|current/i.test(endDateText);
          if (!isCurrentJob && endDateText) {
            endDate = convertDateToISO(endDateText);
          }
          break;
        }
      }

      // Extract description - skip header lines and date lines
      const descriptionLines = entryLines.slice(2).filter(line => {
        const hasDate = datePatterns.some(pattern => pattern.test(line));
        return !hasDate && line.length > 5;
      });

      description = descriptionLines.join('\n').trim();

      // Ensure we have at least position or company
      if (!position && !company) {
        position = firstLine || 'Position';
        company = secondLine || 'Company';
      }

      workExperience.push({
        id: String(Date.now() + i),
        company: company || 'Company',
        position: position || 'Position',
        startDate: startDate || '',
        endDate: endDate || '',
        isCurrentJob,
        description: description || ''
      });
    }
  }


  // Fallbacks: if parsing is weak, put raw text into summary and a generic experience entry
  const hasAnyData = (fullName || emailMatch || phoneMatch || linkedinMatch || urlMatch || workExperience.length || education.length || skills.length || certifications.length || projects.length);
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
      location: location || '',
      linkedin: linkedinMatch?.[0] || '',
      website: urlMatch && (!linkedinMatch || urlMatch[0] !== linkedinMatch[0]) ? urlMatch[0] : '',
      summary: fallbackSummary
    },
    workExperience: normalizedWork,
    education,
    skills,
    certifications,
    projects,
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
          certifications: aiData.certifications?.length ? aiData.certifications : extractedData.certifications,
          projects: aiData.projects?.length ? aiData.projects : extractedData.projects
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