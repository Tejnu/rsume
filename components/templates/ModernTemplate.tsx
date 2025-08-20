
'use client';

import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

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

  const { personalInfo, workExperience = [], education = [], skills = [], projects = [], certifications = [], languages = [] } = resumeData;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 font-sans text-gray-800">
      {/* Header */}
      <div className="mb-8 pb-6 border-b-2 border-gradient-to-r from-blue-500 to-purple-600">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {personalInfo?.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {personalInfo.email}
            </div>
          )}
          {personalInfo?.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {personalInfo.phone}
            </div>
          )}
          {personalInfo?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {personalInfo.location}
            </div>
          )}
          {personalInfo?.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              {personalInfo.website}
            </div>
          )}
          {personalInfo?.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </div>
          )}
        </div>
        
        {personalInfo?.summary && (
          <p className="mt-4 text-gray-700 leading-relaxed">
            {personalInfo.summary}
          </p>
        )}
      </div>

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-blue-500 pl-3">
            Experience
          </h2>
          {workExperience.map((job) => (
            <div key={job.id} className="mb-6 last:mb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{job.position}</h3>
                  <p className="text-blue-600 font-medium">{job.company}</p>
                </div>
                <div className="text-sm text-gray-500 text-right">
                  {formatDate(job.startDate)} - {job.isCurrentJob ? 'Present' : formatDate(job.endDate)}
                </div>
              </div>
              {job.description && (
                <div className="text-gray-700 ml-4">
                  {job.description.split('\n').map((line, idx) => (
                    <p key={idx} className="mb-1">{line}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-blue-500 pl-3">
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-4 last:mb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-blue-600">{edu.school}</p>
                  {edu.field && <p className="text-gray-600">{edu.field}</p>}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(edu.graduationDate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-blue-500 pl-3">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-blue-500 pl-3">
            Projects
          </h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-4 last:mb-0">
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              {project.description && (
                <p className="text-gray-700 mt-1">{project.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-blue-500 pl-3">
            Certifications
          </h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-2 last:mb-0">
              <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
              {cert.description && (
                <p className="text-gray-700">{cert.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white text-gray-900 p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="text-white p-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
          <h1 className="text-3xl font-bold mb-2">{personalInfo.fullName || 'Your Name'}</h1>
          {personalInfo.title && <p className="text-xl mb-4">{personalInfo.title}</p>}
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
            {personalInfo.github && (
              <div className="flex items-center">
                <Github className="h-4 w-4 mr-1" />
                GitHub
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-purple-600 mb-3 border-b-2 border-purple-200 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {workExperience && workExperience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-black mb-4 border-b-2 border-gray-300 pb-1">
            Work Experience
          </h2>
          <div className="space-y-6">
            {workExperience.map((exp) => (
              <div key={exp.id} className="border-l-4 border-purple-400 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{exp.position}</h3>
                    <p className="text-gray-700 font-medium">{exp.company}</p>
                    {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
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
      {education && education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-black mb-4 border-b-2 border-gray-300 pb-1">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="border-l-4 border-purple-400 pl-4">
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

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-black mb-4 border-b-2 border-gray-300 pb-1">
            Projects
          </h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border-l-4 border-purple-400 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.url && (
                      <p className="text-sm text-purple-600 mt-1">{project.url}</p>
                    )}
                  </div>
                  {(project.startDate || project.endDate) && (
                    <div className="text-sm text-gray-600">
                      {project.startDate && formatDate(project.startDate)} 
                      {project.startDate && project.endDate && ' - '}
                      {project.endDate && formatDate(project.endDate)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-black mb-4 border-b-2 border-gray-300 pb-1">
            Certifications
          </h2>
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id} className="border-l-4 border-purple-400 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{cert.name}</h3>
                    <p className="text-sm text-gray-700">{cert.issuer}</p>
                    {cert.url && <p className="text-sm text-purple-600">{cert.url}</p>}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(cert.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-black mb-4 border-b-2 border-gray-300 pb-1">
            Languages
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {languages.map((lang) => (
              <div key={lang.id} className="flex justify-between items-center">
                <span className="font-medium">{lang.name}</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                  {lang.proficiency}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
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
                        }`}
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
