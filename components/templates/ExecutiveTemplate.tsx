
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

  const { personalInfo, workExperience, education, skills, projects, certifications, languages } = resumeData;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white" style={{ minHeight: '1056px' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-3">{personalInfo.fullName || 'Your Name'}</h1>
          {personalInfo.title && (
            <p className="text-2xl font-light mb-6">{personalInfo.title}</p>
          )}
          <div className="flex justify-center flex-wrap gap-6 text-sm">
            {personalInfo.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                {personalInfo.phone}
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {personalInfo.location}
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                {personalInfo.website}
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center">
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Executive Summary */}
        {personalInfo.summary && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center uppercase tracking-wider">
              Executive Summary
            </h2>
            <div className="bg-slate-50 p-6 rounded-lg border-l-4 border-slate-600">
              <p className="text-gray-700 leading-relaxed text-lg font-light italic text-center">
                {personalInfo.summary}
              </p>
            </div>
          </section>
        )}

        {/* Professional Experience */}
        {workExperience && workExperience.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center uppercase tracking-wider">
              Professional Experience
            </h2>
            <div className="space-y-8">
              {workExperience.map((exp) => (
                <div key={exp.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{exp.position}</h3>
                      <p className="text-lg text-slate-700 font-semibold">{exp.company}</p>
                      {exp.location && <p className="text-slate-600">{exp.location}</p>}
                    </div>
                    <div className="text-slate-600 text-right">
                      <p className="font-medium">
                        {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                      </p>
                    </div>
                  </div>
                  {exp.description && (
                    <div className="border-t border-slate-100 pt-4">
                      <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center uppercase tracking-wider">
              Education
            </h2>
            <div className="grid gap-6">
              {education.map((edu) => (
                <div key={edu.id} className="bg-slate-50 p-6 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{edu.degree}</h3>
                      <p className="text-lg text-slate-700 font-semibold">{edu.school}</p>
                      {edu.field && <p className="text-slate-600">{edu.field}</p>}
                      {edu.gpa && <p className="text-slate-600">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-slate-600">
                      <p className="font-medium">{formatDate(edu.graduationDate)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center uppercase tracking-wider">
              Key Projects
            </h2>
            <div className="grid gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white border border-slate-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-slate-900">{project.name}</h3>
                    {(project.startDate || project.endDate) && (
                      <span className="text-slate-600">
                        {project.startDate && formatDate(project.startDate)} 
                        {project.startDate && project.endDate && ' - '}
                        {project.endDate && formatDate(project.endDate)}
                      </span>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-gray-700 mb-4">{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-slate-600 mb-2">TECHNOLOGIES:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {project.url && (
                    <p className="text-slate-600">{project.url}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Core Competencies */}
          {skills && skills.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-wider">
                Core Competencies
              </h2>
              <div className="space-y-4">
                {['Expert', 'Advanced', 'Intermediate', 'Beginner'].map(level => {
                  const levelSkills = skills.filter(skill => skill.level === level);
                  if (levelSkills.length === 0) return null;
                  
                  return (
                    <div key={level}>
                      <h3 className="font-bold text-slate-700 mb-2">{level}</h3>
                      <div className="space-y-1">
                        {levelSkills.map(skill => (
                          <div key={skill.id} className="text-sm text-gray-700">
                            • {skill.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-wider">
                Certifications
              </h2>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <h3 className="font-semibold text-slate-900 text-sm">{cert.name}</h3>
                    <p className="text-sm text-slate-700">{cert.issuer}</p>
                    <p className="text-xs text-slate-600">{formatDate(cert.date)}</p>
                    {cert.url && (
                      <p className="text-xs text-slate-600">{cert.url}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-wider">
                Languages
              </h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center">
                    <span className="font-medium text-slate-900">{lang.name}</span>
                    <span className="text-sm text-slate-600">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
