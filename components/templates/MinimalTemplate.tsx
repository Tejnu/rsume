'use client';

import { ResumeData } from '@/types/resume';

interface MinimalTemplateProps {
  resumeData: ResumeData;
}

export function MinimalTemplate({ resumeData }: MinimalTemplateProps) {
  const { personalInfo, workExperience, education, skills } = resumeData;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-white text-gray-900 p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-5xl font-light mb-6 tracking-wide">{personalInfo.fullName || 'Your Name'}</h1>
        <div className="text-sm text-gray-600 space-y-1">
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
          {personalInfo.website && <div>{personalInfo.website}</div>}
          {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
        </div>
      </header>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <section className="mb-12">
          <p className="text-gray-700 leading-relaxed text-lg font-light">{personalInfo.summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-light mb-8 tracking-wide">Experience</h2>
          <div className="space-y-8">
            {workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-3">
                  <div>
                    <h3 className="text-xl font-medium">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} – {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 leading-relaxed font-light">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-light mb-8 tracking-wide">Education</h2>
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-2">
                  <div>
                    <h3 className="text-xl font-medium">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.school}</p>
                    {edu.field && <p className="text-sm text-gray-500">{edu.field}</p>}
                    {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(edu.graduationDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-2xl font-light mb-8 tracking-wide">Skills</h2>
          <div className="space-y-6">
            {['Expert', 'Advanced', 'Intermediate', 'Beginner'].map(level => {
              const levelSkills = skills.filter(skill => skill.level === level);
              if (levelSkills.length === 0) return null;
              
              return (
                <div key={level}>
                  <h3 className="font-medium text-gray-800 mb-3">{level}</h3>
                  <div className="text-gray-700 font-light">
                    {levelSkills.map(skill => skill.name).join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}