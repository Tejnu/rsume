
'use client';

import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Calendar, GraduationCap, Award, Star } from 'lucide-react';

interface ExecutiveTemplateProps {
  data: ResumeData;
}

export function ExecutiveTemplate({ data }: ExecutiveTemplateProps) {
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
    <div className="max-w-4xl mx-auto bg-white shadow-2xl" style={{ minHeight: '1056px' }}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{personalInfo.fullName}</h1>
            <h2 className="text-xl text-slate-200 mb-4">{personalInfo.title}</h2>
            {personalInfo.summary && (
              <p className="text-slate-100 text-sm leading-relaxed max-w-2xl">{personalInfo.summary}</p>
            )}
          </div>
          <div className="ml-8">
            <div className="space-y-2 text-sm">
              {personalInfo.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-slate-300" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-slate-300" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-slate-300" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Experience */}
            {workExperience.length > 0 && (
              <section>
                <h3 className="text-2xl font-bold text-purple-600 mb-4 border-b-2 border-purple-200 pb-2">
                  Executive Experience
                </h3>
                <div className="space-y-6">
                  {workExperience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-pink-500 pl-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900">{exp.position}</h4>
                          <p className="text-slate-700 font-medium">{exp.company}</p>
                        </div>
                        <div className="text-right text-sm text-slate-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {exp.startDate} - {exp.endDate || 'Present'}
                          </div>
                          {exp.location && <div className="mt-1">{exp.location}</div>}
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-slate-700 text-sm leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            {skills.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-purple-600 mb-3 flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Core Competencies
                </h3>
                <div className="space-y-2">
                  {skills.map((skill, index) => (
                    <div key={index} className="bg-purple-50 p-2 rounded">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-800">{skill.name}</span>
                        <span className="text-xs text-purple-600 capitalize">{skill.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-purple-600 mb-3 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Education
                </h3>
                <div className="space-y-3">
                  {education.map((edu, index) => (
                    <div key={index} className="border-b border-purple-200 pb-3 last:border-b-0">
                      <h4 className="font-semibold text-slate-800 text-sm">{edu.degree}</h4>
                      <p className="text-slate-600 text-xs">{edu.school}</p>
                      {edu.graduationDate && (
                        <p className="text-slate-500 text-xs">{edu.graduationDate}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-purple-600 mb-3 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Certifications
                </h3>
                <div className="space-y-2">
                  {data.certifications.map((cert, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium text-slate-800">{cert.name}</p>
                      <p className="text-slate-600 text-xs">{cert.issuer}</p>
                      {cert.date && <p className="text-slate-500 text-xs">{cert.date}</p>}
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
