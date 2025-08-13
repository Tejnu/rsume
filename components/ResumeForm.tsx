'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { WorkExperienceForm } from './forms/WorkExperienceForm';
import { EducationForm } from './forms/EducationForm';
import { SkillsForm } from './forms/SkillsForm';
import { CertificationsForm } from './forms/CertificationsForm';
import { ResumeData } from '@/types/resume';
import { User, Briefcase, GraduationCap, Code, Award, FolderOpen } from 'lucide-react';

interface ResumeFormProps {
  resumeData: ResumeData;
  onUpdate: (updates: Partial<ResumeData>) => void;
}

export function ResumeForm({ resumeData, onUpdate }: ResumeFormProps) {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="personal" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Experience</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Education</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center space-x-2">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Skills</span>
          </TabsTrigger>
          <TabsTrigger value="certifications" className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Certs</span>
          </TabsTrigger>
          <TabsTrigger value="additional" className="flex items-center space-x-2">
            <FolderOpen className="h-4 w-4" />
            <span className="hidden sm:inline">More</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="personal" className="space-y-4">
            <PersonalInfoForm
              personalInfo={resumeData.personalInfo}
              onUpdate={(personalInfo) => onUpdate({ personalInfo })}
            />
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            <WorkExperienceForm
              workExperience={resumeData.workExperience}
              onUpdate={(workExperience) => onUpdate({ workExperience })}
            />
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <EducationForm
              education={resumeData.education}
              onUpdate={(education) => onUpdate({ education })}
            />
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <SkillsForm
              skills={resumeData.skills}
              onUpdate={(skills) => onUpdate({ skills })}
            />
          </TabsContent>
          
          <TabsContent value="certifications" className="space-y-4">
            <CertificationsForm
              certifications={resumeData.certifications}
              onUpdate={(certifications) => onUpdate({ certifications })}
            />
          </TabsContent>
          
          <TabsContent value="additional" className="space-y-4">
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Additional sections coming soon!</p>
              <p className="text-sm text-gray-400 mt-2">Projects, Languages, References, and Custom Sections</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}