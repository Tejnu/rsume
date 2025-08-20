
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
'use client';

import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface CreativeTemplateProps {
  resumeData: ResumeData;
}

export function CreativeTemplate({ resumeData }: CreativeTemplateProps) {
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
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900 p-8 max-w-4xl mx-auto">
      {/* Creative Header */}
      <header className="mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl transform -rotate-1"></div>
        <div className="relative bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {personalInfo?.fullName || 'Your Name'}
          </h1>
          {personalInfo?.title && (
            <p className="text-2xl text-gray-700 mb-4 font-light">{personalInfo.title}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {personalInfo?.email && (
              <div className="flex items-center bg-purple-100 px-3 py-1 rounded-full">
                <Mail className="h-4 w-4 mr-2 text-purple-600" />
                {personalInfo.email}
              </div>
            )}
            {personalInfo?.phone && (
              <div className="flex items-center bg-pink-100 px-3 py-1 rounded-full">
                <Phone className="h-4 w-4 mr-2 text-pink-600" />
                {personalInfo.phone}
              </div>
            )}
            {personalInfo?.location && (
              <div className="flex items-center bg-orange-100 px-3 py-1 rounded-full">
                <MapPin className="h-4 w-4 mr-2 text-orange-600" />
                {personalInfo.location}
              </div>
            )}
            {personalInfo?.linkedin && (
              <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
                LinkedIn
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Creative Summary */}
      {personalInfo?.summary && (
        <section className="mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        </section>
      )}

      {/* Experience */}
      {workExperience && workExperience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Experience
          </h2>
          <div className="space-y-6">
            {workExperience.map((exp, index) => (
              <div key={exp.id} className={`bg-white rounded-xl p-6 shadow-lg transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform duration-300`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">{exp.position}</h3>
                    <p className="text-purple-600 font-semibold">{exp.company}</p>
                    {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
                  </div>
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full text-sm text-purple-800">
                    {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
            Creative Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div key={project.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className={`w-full h-2 bg-gradient-to-r ${
                  index % 3 === 0 ? 'from-purple-500 to-pink-500' :
                  index % 3 === 1 ? 'from-pink-500 to-orange-500' :
                  'from-orange-500 to-yellow-500'
                } rounded-t-xl mb-4`}></div>
                <h3 className="font-bold text-lg mb-2">{project.name}</h3>
                {project.description && (
                  <p className="text-gray-700 text-sm mb-3">{project.description}</p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs rounded-full">
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

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex flex-wrap gap-3 justify-center">
              {skills.map((skill, index) => (
                <span
                  key={skill.id}
                  className={`px-4 py-2 rounded-full text-white font-medium shadow-lg transform hover:scale-110 transition-transform duration-200 ${
                    index % 4 === 0 ? 'bg-gradient-to-r from-purple-500 to-purple-700' :
                    index % 4 === 1 ? 'bg-gradient-to-r from-pink-500 to-pink-700' :
                    index % 4 === 2 ? 'bg-gradient-to-r from-orange-500 to-orange-700' :
                    'bg-gradient-to-r from-yellow-500 to-yellow-700'
                  }`}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-blue-500">
                <div className="text-center">
                  <h3 className="font-bold text-lg">{edu.degree}</h3>
                  <p className="text-blue-600 font-semibold">{edu.school}</p>
                  {edu.field && <p className="text-gray-600">{edu.field}</p>}
                  <p className="text-sm text-gray-500">{formatDate(edu.graduationDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
