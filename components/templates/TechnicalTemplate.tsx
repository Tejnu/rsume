
'use client';

import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Code, Terminal, Database } from 'lucide-react';

interface TechnicalTemplateProps {
  data: ResumeData;
}

export function TechnicalTemplate({ data }: TechnicalTemplateProps) {
  // Safety check for data
  if (!data) {
    return (
      <div className="w-full h-96 flex items-center justify-center text-gray-500">
        Loading template...
      </div>
    );
  }

  const { personalInfo, workExperience, education, skills } = data;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ minHeight: '1056px' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-mono font-bold mb-1">{data.personalInfo.fullName}</h1>
            <h2 className="text-lg text-pink-200 font-mono">{data.personalInfo.title}</h2>
            {data.personalInfo.summary && (
              <p className="text-gray-300 text-sm mt-3 max-w-xl font-mono">{data.personalInfo.summary}</p>
            )}
          </div>
          <div className="text-right space-y-1 text-sm font-mono">
            {data.personalInfo.email && (
              <div className="flex items-center justify-end">
                <Mail className="h-4 w-4 mr-2" />
                {data.personalInfo.email}
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center justify-end">
                <Phone className="h-4 w-4 mr-2" />
                {data.personalInfo.phone}
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center justify-end">
                <MapPin className="h-4 w-4 mr-2" />
                {data.personalInfo.location}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-6">
          {/* Skills Sidebar */}
          <div className="col-span-1 space-y-6">
            {data.skills.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-purple-600 mb-3 flex items-center font-mono">
                  <Terminal className="h-5 w-5 mr-2 text-purple-600" />
                  Skills
                </h3>
                <div className="space-y-3">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="border border-gray-200 rounded p-2">
                      <div className="text-sm font-mono font-semibold text-gray-800">{skill.name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        <div className="flex items-center">
                          <div className={`w-full bg-gray-200 rounded-full h-1.5 mr-2`}>
                            <div
                              className={`h-1.5 rounded-full ${
                                skill.level === 'expert' ? 'bg-purple-600 w-full' :
                                skill.level === 'advanced' ? 'bg-purple-500 w-4/5' :
                                skill.level === 'intermediate' ? 'bg-pink-500 w-3/5' :
                                'bg-pink-400 w-2/5'
                              }`}
                            />
                          </div>
                          <span className="text-xs capitalize">{skill.level}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.education.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3 font-mono">Education</h3>
                <div className="space-y-3">
                  {data.education.map((edu, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-semibold text-gray-800">{edu.degree}</div>
                      <div className="text-gray-600">{edu.school}</div>
                      {edu.graduationDate && (
                        <div className="text-gray-500 text-xs">{edu.graduationDate}</div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Main Content */}
          <div className="col-span-3 space-y-6">
            {/* Experience */}
            {data.workExperience.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-purple-600 mb-4 flex items-center font-mono">
                  <Code className="h-6 w-6 mr-2 text-purple-600" />
                  Experience
                </h3>
                <div className="space-y-5">
                  {data.workExperience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-4 rounded-r">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 font-mono">{exp.position}</h4>
                          <p className="text-gray-700 font-medium">{exp.company}</p>
                        </div>
                        <div className="text-right text-sm text-gray-600 font-mono">
                          <div>{exp.startDate} - {exp.endDate || 'Present'}</div>
                          {exp.location && <div className="mt-1">{exp.location}</div>}
                        </div>
                      </div>
                      {exp.description && (
                        <div className="text-gray-700 text-sm leading-relaxed font-mono bg-white p-3 rounded border">
                          {exp.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-purple-600 mb-4 flex items-center font-mono">
                  <Database className="h-6 w-6 mr-2 text-purple-600" />
                  Certifications
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {data.certifications.map((cert, index) => (
                    <div key={index} className="border border-gray-200 rounded p-3 bg-gray-50">
                      <div className="font-semibold text-gray-800 font-mono">{cert.name}</div>
                      <div className="text-gray-600 text-sm">{cert.issuer}</div>
                      {cert.date && <div className="text-gray-500 text-xs font-mono">{cert.date}</div>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
