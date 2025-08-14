'use client';

import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

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

  const { personalInfo, workExperience, education, skills } = resumeData;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-white text-gray-900 p-0 max-w-4xl mx-auto">
      <div className="grid grid-cols-3 min-h-full">
        {/* Left Sidebar */}
        <div className="bg-gradient-to-b from-purple-600 to-purple-800 text-white p-8 col-span-1">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">{personalInfo.fullName || 'Your Name'}</h1>
            <div className="w-12 h-1 bg-yellow-400 mb-6"></div>
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-yellow-300">CONTACT</h2>
            <div className="space-y-3 text-sm">
              {personalInfo.email && (
                <div className="flex items-start">
                  <Mail className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="break-all">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-start">
                  <Globe className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="break-all">{personalInfo.website}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-start">
                  <Linkedin className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0" />
                  <span>LinkedIn</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 text-yellow-300">SKILLS</h2>
              <div className="space-y-4">
                {['Expert', 'Advanced', 'Intermediate', 'Beginner'].map(level => {
                  const levelSkills = skills.filter(skill => skill.level === level);
                  if (levelSkills.length === 0) return null;
                  
                  return (
                    <div key={level}>
                      <h3 className="text-sm font-medium mb-2 text-purple-200">{level}</h3>
                      <div className="space-y-1">
                        {levelSkills.map(skill => (
                          <div key={skill.id} className="text-sm">
                            <div className="flex justify-between mb-1">
                              <span>{skill.name}</span>
                            </div>
                            <div className="w-full bg-purple-400 rounded-full h-1">
                              <div 
                                className="bg-yellow-400 h-1 rounded-full"
                                style={{ 
                                  width: level === 'Expert' ? '100%' : 
                                         level === 'Advanced' ? '75%' : 
                                         level === 'Intermediate' ? '50%' : '25%' 
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-yellow-300">EDUCATION</h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-medium text-sm">{edu.degree}</h3>
                    <p className="text-purple-200 text-xs">{edu.school}</p>
                    {edu.field && <p className="text-purple-200 text-xs">{edu.field}</p>}
                    <p className="text-xs text-purple-300">{formatDate(edu.graduationDate)}</p>
                    {edu.gpa && <p className="text-xs text-purple-300">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="col-span-2 p-8">
          {/* Professional Summary */}
          {personalInfo.summary && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-800 relative">
                ABOUT ME
                <div className="absolute bottom-0 left-0 w-16 h-1 bg-yellow-400"></div>
              </h2>
              <p className="text-gray-700 leading-relaxed mt-6">{personalInfo.summary}</p>
            </section>
          )}

          {/* Work Experience */}
          {workExperience.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-purple-800 relative">
                EXPERIENCE
                <div className="absolute bottom-0 left-0 w-16 h-1 bg-yellow-400"></div>
              </h2>
              <div className="space-y-6 mt-6">
                {workExperience.map((exp, index) => (
                  <div key={exp.id} className="relative">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-3 h-3 bg-yellow-400 rounded-full mt-2 relative z-10">
                      </div>
                      {index < workExperience.length - 1 && (
                        <div className="absolute left-1.5 top-5 w-0.5 h-full bg-purple-200"></div>
                      )}
                      <div className="ml-6 flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg text-purple-800">{exp.position}</h3>
                            <p className="text-purple-600 font-medium">{exp.company}</p>
                          </div>
                          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                            {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                          </div>
                        </div>
                        {exp.description && (
                          <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
                        )}
                      </div>
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