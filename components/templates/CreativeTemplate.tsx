
'use client';

import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface CreativeTemplateProps {
  resumeData: ResumeData;
}

export function CreativeTemplate({ resumeData }: CreativeTemplateProps) {
  // Safety check for resumeData
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
    <div className="bg-white text-gray-900 p-0 max-w-4xl mx-auto">
      <div className="grid grid-cols-3 min-h-full">
        {/* Left Sidebar */}
        <div className="bg-gradient-to-b from-purple-500 to-pink-600 text-white p-8 col-span-1">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">{personalInfo.fullName || 'Your Name'}</h1>
            {personalInfo.title && <p className="text-lg mb-4">{personalInfo.title}</p>}
            <div className="w-12 h-1 bg-yellow-400 mb-6"></div>
          </div>

          {/* Contact */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 uppercase">Contact</h2>
            <div className="space-y-3 text-sm">
              {personalInfo.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="break-all">{personalInfo.email}</span>
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
                  <span className="break-all">{personalInfo.website}</span>
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

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 uppercase">Skills</h2>
              <div className="space-y-4">
                {['Expert', 'Advanced', 'Intermediate', 'Beginner'].map(level => {
                  const levelSkills = skills.filter(skill => skill.level === level);
                  if (levelSkills.length === 0) return null;
                  
                  return (
                    <div key={level}>
                      <h3 className="font-semibold mb-2">{level}</h3>
                      <div className="space-y-1">
                        {levelSkills.map(skill => (
                          <div key={skill.id} className="text-sm">
                            {skill.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 uppercase">Languages</h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="text-sm">
                    <div className="font-medium">{lang.name}</div>
                    <div className="text-xs opacity-90">{lang.proficiency}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-4 uppercase">Certifications</h2>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id} className="text-sm">
                    <div className="font-medium">{cert.name}</div>
                    <div className="text-xs opacity-90">{cert.issuer}</div>
                    <div className="text-xs opacity-75">{formatDate(cert.date)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="col-span-2 p-8">
          {/* Summary */}
          {personalInfo.summary && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-purple-600 mb-4 uppercase tracking-wider">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}

          {/* Work Experience */}
          {workExperience && workExperience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-purple-600 mb-6 uppercase tracking-wider">
                Experience
              </h2>
              <div className="space-y-6">
                {workExperience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                        <p className="text-purple-600 font-semibold">{exp.company}</p>
                        {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                      </div>
                      <div className="text-sm text-gray-500">
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
              <h2 className="text-xl font-bold text-purple-600 mb-6 uppercase tracking-wider">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                        <p className="text-purple-600 font-semibold">{edu.school}</p>
                        {edu.field && <p className="text-sm text-gray-600">{edu.field}</p>}
                        {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
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

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-purple-600 mb-6 uppercase tracking-wider">
                Projects
              </h2>
              <div className="space-y-6">
                {projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{project.name}</h3>
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
                        <div className="text-sm text-gray-500">
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
        </div>
      </div>
    </div>
  );
}
