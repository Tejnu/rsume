'use client';

import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface ExecutiveTemplateProps {
  resumeData: ResumeData;
}

export function ExecutiveTemplate({ resumeData }: ExecutiveTemplateProps) {
  if (!resumeData) {
    return (
      <div className="w-full h-96 flex items-center justify-center text-gray-500">
        Loading template...
      </div>
    );
  }

  const { personalInfo, workExperience = [], education = [], skills = [], projects = [], certifications = [], languages = [] } = resumeData;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-white text-gray-900 p-8 max-w-4xl mx-auto font-serif">
      {/* Executive Header */}
      <header className="border-b-2 border-gray-900 pb-6 mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-wide">
            {personalInfo?.fullName || 'Executive Name'}
          </h1>
          {personalInfo?.title && (
            <p className="text-xl text-gray-700 mb-4 font-light italic">{personalInfo.title}</p>
          )}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            {personalInfo?.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                {personalInfo.email}
              </div>
            )}
            {personalInfo?.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                {personalInfo.phone}
              </div>
            )}
            {personalInfo?.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {personalInfo.location}
              </div>
            )}
            {personalInfo?.linkedin && (
              <div className="flex items-center">
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Executive Summary */}
      {personalInfo?.summary && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
            EXECUTIVE SUMMARY
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg font-light italic">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Professional Experience */}
      {workExperience && workExperience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="space-y-8">
            {workExperience.map((exp) => (
              <div key={exp.id} className="border-l-4 border-gray-300 pl-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-lg text-gray-700 font-semibold">{exp.company}</p>
                    {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
                  </div>
                  <div className="text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded">
                    {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-gray-700 leading-relaxed">
                    {exp.description.split('\n').map((line, index) => (
                      <p key={index} className="mb-2">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
            EDUCATION
          </h2>
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id} className="border-l-4 border-gray-300 pl-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700 font-semibold">{edu.school}</p>
                    {edu.field && <p className="text-gray-600">{edu.field}</p>}
                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {formatDate(edu.graduationDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Core Competencies */}
      {skills && skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
            CORE COMPETENCIES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="bg-gray-50 p-3 rounded border-l-4 border-gray-400">
                <div className="font-semibold text-gray-900">{skill.name}</div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">{skill.level}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
            KEY PROJECTS & INITIATIVES
          </h2>
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="border-l-4 border-gray-300 pl-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{project.name}</h3>
                {project.description && (
                  <p className="text-gray-700 mb-3">{project.description}</p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Certifications */}
      {certifications && certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
            PROFESSIONAL CERTIFICATIONS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="bg-gray-50 p-4 rounded border-l-4 border-gray-600">
                <div className="font-bold text-gray-900">{cert.name}</div>
                <div className="text-gray-700">{cert.issuer}</div>
                <div className="text-sm text-gray-600">{formatDate(cert.date)}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
            LANGUAGES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {languages.map((lang) => (
              <div key={lang.id} className="text-center bg-gray-50 p-3 rounded">
                <div className="font-semibold text-gray-900">{lang.name}</div>
                <div className="text-sm text-gray-600">{lang.proficiency}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}