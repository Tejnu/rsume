'use client';

import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface ModernTemplateProps {
  resumeData: ResumeData;
}

export function ModernTemplate({ resumeData }: ModernTemplateProps) {
  // Safety check for resumeData
  if (!resumeData) {
    return (
      <div className="w-full h-96 flex items-center justify-center text-gray-500">
        Loading template...
      </div>
    );
  }

  const { personalInfo, workExperience, education, skills } = resumeData;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-white text-gray-900 p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="text-white p-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <h1 className="text-3xl font-bold mb-2">{personalInfo.fullName || 'Your Name'}</h1>
          <div className="flex flex-wrap gap-4 text-sm">
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
        </div>
      </header>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-purple-600 mb-3 border-b-2 border-purple-200 pb-1"></div>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-black mb-4 border-b-2 border-gray-300 pb-1">
            Work Experience
          </h2>
          <div className="space-y-6">
            {workExperience.map((exp) => (
              <div key={exp.id} className="border-l-4 border-purple-400 pl-4"></div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{exp.position}</h3>
                    <p className="text-gray-700 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-black mb-4 border-b-2 border-gray-300 pb-1">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="border-l-4 border-purple-400 pl-4"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-gray-700 font-medium">{edu.school}</p>
                    {edu.field && <p className="text-sm text-gray-600">{edu.field}</p>}
                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-sm text-gray-600">
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
          <h2 className="text-xl font-bold text-black mb-4 border-b-2 border-gray-300 pb-1">
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {['Expert', 'Advanced', 'Intermediate', 'Beginner'].map(level => {
              const levelSkills = skills.filter(skill => skill.level === level);
              if (levelSkills.length === 0) return null;
              
              return (
                <div key={level} className="mb-4">
                  <h3 className="font-medium text-gray-800 mb-2">{level}</h3>
                  <div className="flex flex-wrap gap-2">
                    {levelSkills.map(skill => (
                      <span
                        key={skill.id}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          level === 'Expert' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' :
                          level === 'Advanced' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                          level === 'Intermediate' ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white' :
                          'bg-purple-200 text-purple-800'
                        }`}</div>
                      >
                        {skill.name}
                      </span>
                    ))}
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