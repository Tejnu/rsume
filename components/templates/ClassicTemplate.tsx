
import React from 'react';
import { ResumeData } from '@/types/resume';

interface ClassicTemplateProps {
  data: ResumeData;
}

export function ClassicTemplate({ data }: ClassicTemplateProps) {
  const { personalInfo, workExperience, education, skills, certifications, projects } = data;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    if (!year || !month) return dateStr;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="bg-white text-gray-900 p-8 max-w-4xl mx-auto font-serif">
      {/* Header */}
      <header className="text-center mb-8 border-b-2 border-purple-300 pb-6">
        <h1 className="text-4xl font-bold mb-3">{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.title && (
          <h2 className="text-xl text-purple-600 mb-4 font-medium">{personalInfo.title}</h2>
        )}
        <div className="text-sm text-gray-600 space-y-1">
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
          {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
          {personalInfo.website && <div>{personalInfo.website}</div>}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-3 text-purple-700 border-b border-purple-200 pb-1">Professional Summary</h3>
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-purple-700 border-b border-purple-200 pb-1">Professional Experience</h3>
          <div className="space-y-6">
            {workExperience.map((exp) => (
              <div key={exp.id} className="border-l-2 border-purple-200 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-lg">{exp.position}</h4>
                    <p className="text-purple-600 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-sm text-gray-600 text-right">
                    <div>{formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}</div>
                    {exp.location && <div>{exp.location}</div>}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-gray-700 text-sm leading-relaxed">
                    {exp.description.split('\n').map((line, idx) => (
                      <div key={idx} className="mb-1">{line}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-purple-700 border-b border-purple-200 pb-1">Education</h3>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{edu.degree}</h4>
                    <p className="text-purple-600">{edu.school}</p>
                    {edu.field && <p className="text-sm text-gray-600">{edu.field}</p>}
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
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-purple-700 border-b border-purple-200 pb-1">Skills</h3>
          <div className="grid grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="flex justify-between">
                <span className="text-gray-700">{skill.name}</span>
                <span className="text-sm text-purple-600">{skill.level}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-purple-700 border-b border-purple-200 pb-1">Certifications</h3>
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{cert.name}</h4>
                    {cert.issuer && <p className="text-purple-600 text-sm">{cert.issuer}</p>}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(cert.date || cert.dateObtained || '')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-purple-700 border-b border-purple-200 pb-1">Projects</h3>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id}>
                <h4 className="font-semibold">{project.name}</h4>
                <p className="text-gray-700 text-sm mt-1">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
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
    </div>
  );
}
