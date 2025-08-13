'use client';

import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface ClassicTemplateProps {
  resumeData: ResumeData;
}

export function ClassicTemplate({ resumeData }: ClassicTemplateProps) {
  const { personalInfo, workExperience, education, skills } = resumeData;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-white text-gray-900 p-8 max-w-4xl mx-auto font-serif">
      {/* Header */}
      <header className="text-center mb-8 border-b-2 border-gray-300 pb-6">
        <h1 className="text-4xl font-bold mb-3">{personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex justify-center flex-wrap gap-6 text-sm text-gray-600">
          {personalInfo.email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              {personalInfo.email}
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              {personalInfo.phone}
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {personalInfo.location}
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-1" />
              {personalInfo.website}
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center">
              <Linkedin className="h-4 w-4 mr-1" />
              LinkedIn
            </div>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-center">PROFESSIONAL SUMMARY</h2>
          <div className="border-t border-b border-gray-300 py-4">
            <p className="text-gray-700 leading-relaxed text-center italic">{personalInfo.summary}</p>
          </div>
        </section>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">PROFESSIONAL EXPERIENCE</h2>
          <div className="space-y-6">
            {workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{exp.position}</h3>
                    <p className="font-semibold text-gray-700">{exp.company}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 text-sm leading-relaxed mt-2">{exp.description}</p>
                )}
                <hr className="mt-4 border-gray-200" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">EDUCATION</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{edu.degree}</h3>
                    <p className="font-semibold text-gray-700">{edu.school}</p>
                    {edu.field && <p className="text-sm text-gray-600">{edu.field}</p>}
                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {formatDate(edu.graduationDate)}
                  </div>
                </div>
                <hr className="mt-3 border-gray-200" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-center">SKILLS</h2>
          <div className="text-center">
            {['Expert', 'Advanced', 'Intermediate', 'Beginner'].map(level => {
              const levelSkills = skills.filter(skill => skill.level === level);
              if (levelSkills.length === 0) return null;
              
              return (
                <div key={level} className="mb-4">
                  <h3 className="font-bold text-gray-800 mb-2">{level.toUpperCase()}</h3>
                  <p className="text-gray-700">
                    {levelSkills.map(skill => skill.name).join(' • ')}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}