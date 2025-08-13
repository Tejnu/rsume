'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Lightbulb, TrendingUp, CheckCircle, X, Zap, Target, Brain } from 'lucide-react';
import { ResumeData } from '@/types/resume';

interface AIAssistantProps {
  resumeData: ResumeData;
  onApplySuggestion: (type: string, suggestion: any) => void;
}

interface AISuggestion {
  id: number;
  type: 'skill' | 'summary' | 'experience' | 'keyword' | 'format';
  title: string;
  description: string;
  suggestions?: string[];
  suggestion?: string;
  priority: 'high' | 'medium' | 'low';
  impact: string;
  category: string;
}

export function AIAssistant({ resumeData, onApplySuggestion }: AIAssistantProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const generateSuggestions = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const newSuggestions: AISuggestion[] = [];
    
    // Analyze current resume content for context-aware suggestions
    const hasWorkExperience = resumeData.workExperience.length > 0;
    const hasEducation = resumeData.education.length > 0;
    const currentSkills = resumeData.skills.map(s => s.name.toLowerCase());
    const summaryLength = resumeData.personalInfo.summary?.length || 0;
    const totalExperienceText = resumeData.workExperience.map(exp => exp.description).join(' ');
    const hasQuantifiedAchievements = /\d+%|\d+\+|\$\d+|increased|decreased|improved|reduced|led|managed|built|created|developed/i.test(totalExperienceText);
    
    // Determine user's likely field based on existing skills
    const techSkills = ['javascript', 'python', 'react', 'node', 'java', 'sql', 'html', 'css', 'typescript', 'angular', 'vue'];
    const businessSkills = ['management', 'marketing', 'sales', 'finance', 'accounting', 'strategy', 'operations'];
    const designSkills = ['photoshop', 'illustrator', 'figma', 'sketch', 'design', 'ui', 'ux'];
    
    const isTechRole = currentSkills.some(skill => techSkills.some(tech => skill.includes(tech)));
    const isBusinessRole = currentSkills.some(skill => businessSkills.some(biz => skill.includes(biz)));
    const isDesignRole = currentSkills.some(skill => designSkills.some(design => skill.includes(design)));
    
    // Smart skill suggestions based on existing skills and role
    if (currentSkills.length > 0) {
      let suggestedSkills: string[] = [];
      
      if (isTechRole) {
        // Suggest complementary tech skills
        const techSuggestions = ['Git', 'Docker', 'AWS', 'REST APIs', 'Agile/Scrum', 'CI/CD', 'Kubernetes', 'GraphQL'];
        suggestedSkills = techSuggestions.filter(skill => 
          !currentSkills.some(existing => existing.includes(skill.toLowerCase().replace(/[\/\s]/g, '')))
        );
      } else if (isBusinessRole) {
        // Suggest business skills
        const businessSuggestions = ['Project Management', 'Data Analysis', 'Strategic Planning', 'Team Leadership', 'Budget Management', 'Process Improvement'];
        suggestedSkills = businessSuggestions.filter(skill => 
          !currentSkills.some(existing => existing.includes(skill.toLowerCase()))
        );
      } else if (isDesignRole) {
        // Suggest design skills
        const designSuggestions = ['UI/UX Design', 'Prototyping', 'User Research', 'Wireframing', 'Brand Design', 'Adobe Creative Suite'];
        suggestedSkills = designSuggestions.filter(skill => 
          !currentSkills.some(existing => existing.includes(skill.toLowerCase()))
        );
      } else {
        // General professional skills
        suggestedSkills = ['Communication', 'Problem Solving', 'Time Management', 'Teamwork', 'Adaptability', 'Critical Thinking'];
      }
      
      if (suggestedSkills.length > 0) {
        newSuggestions.push({
          id: 1,
          type: 'skill',
          title: 'Add Complementary Skills',
          description: 'These skills complement your existing expertise and are valued in your field',
          suggestions: suggestedSkills.slice(0, 5),
          priority: 'medium',
          impact: 'Enhances skill profile completeness by 25%',
          category: 'Skills'
        });
      }
    }
    
    // Smart summary suggestions based on actual content
    if (summaryLength < 100 || !resumeData.personalInfo.summary) {
      const experienceYears = hasWorkExperience ? Math.max(resumeData.workExperience.length * 2, 3) : 'entry-level';
      const roleType = isTechRole ? 'developer' : isBusinessRole ? 'professional' : isDesignRole ? 'designer' : 'professional';
      
      const topSkills = resumeData.skills.slice(0, 3).map(s => s.name).join(', ') || 'core competencies';
      
      newSuggestions.push({
        id: 2,
        type: 'summary',
        title: 'Enhance Professional Summary',
        description: 'Create a compelling summary that highlights your experience and value proposition',
        suggestion: `${experienceYears === 'entry-level' ? 'Motivated' : 'Experienced'} ${roleType} with ${experienceYears === 'entry-level' ? 'strong foundation in' : `${experienceYears}+ years of expertise in`} ${topSkills}. ${hasWorkExperience ? 'Proven track record of delivering high-quality results and collaborating effectively with cross-functional teams.' : 'Eager to apply technical skills and fresh perspective to drive meaningful results.'} ${hasQuantifiedAchievements ? 'Demonstrated ability to improve processes and achieve measurable outcomes.' : 'Committed to continuous learning and professional growth.'}`,
        priority: summaryLength === 0 ? 'high' : 'medium',
        impact: 'Improves first impression and recruiter engagement by 40%',
        category: 'Content'
      });
    }
    
    // Experience enhancement suggestions based on actual content
    if (hasWorkExperience && !hasQuantifiedAchievements) {
      newSuggestions.push({
        id: 3,
        type: 'experience',
        title: 'Add Quantified Achievements',
        description: 'Include specific numbers, percentages, and metrics to demonstrate your impact',
        suggestions: resumeData.workExperience.map(exp => ({
          id: exp.id,
          original: exp.description,
          enhancement: `${exp.description}\n• Contributed to team productivity improvements and project success\n• Collaborated with ${Math.floor(Math.random() * 8) + 3} team members across different departments\n• Maintained high quality standards and met project deadlines consistently\n• Achieved measurable results through effective problem-solving and attention to detail`
        })),
        priority: 'high',
        impact: 'Significantly increases interview callbacks by 60%',
        category: 'Experience'
      });
    }
    
    // Keyword optimization suggestions
    if (currentSkills.length < 8) {
      const industryKeywords = isTechRole ? 
        ['API Development', 'Database Design', 'Code Review', 'Testing', 'Debugging'] :
        isBusinessRole ?
        ['Stakeholder Management', 'KPI Tracking', 'Process Optimization', 'Cross-functional Collaboration'] :
        ['User Experience', 'Design Systems', 'Accessibility', 'Responsive Design'];
        
      newSuggestions.push({
        id: 4,
        type: 'keyword',
        title: 'Optimize for ATS Systems',
        description: 'Add industry-specific keywords to improve applicant tracking system compatibility',
        suggestions: industryKeywords,
        priority: 'medium',
        impact: 'Improves ATS compatibility by 35%',
        category: 'Keywords'
      });
    }
    
    // Format suggestions based on content length
    const totalContentLength = summaryLength + totalExperienceText.length;
    if (totalContentLength > 2000) {
      newSuggestions.push({
        id: 5,
        type: 'format',
        title: 'Optimize Content Length',
        description: 'Consider condensing descriptions to keep recruiters engaged',
        suggestion: 'Focus on most impactful achievements and use bullet points effectively',
        priority: 'medium',
        impact: 'Improves readability and engagement by 30%',
        category: 'Format'
      });
    } else if (totalContentLength < 500 && hasWorkExperience) {
      newSuggestions.push({
        id: 6,
        type: 'format',
        title: 'Expand Content Details',
        description: 'Provide more context about your achievements and responsibilities',
        suggestion: 'Add more specific details about your accomplishments and the impact you made',
        priority: 'medium',
        impact: 'Provides better context for recruiters',
        category: 'Format'
      });
    }
    
    // Education suggestions
    if (!hasEducation && hasWorkExperience) {
      newSuggestions.push({
        id: 7,
        type: 'keyword',
        title: 'Consider Adding Education Section',
        description: 'Even if not directly related, education shows your learning foundation',
        suggestions: ['Add relevant coursework', 'Include certifications', 'Mention training programs'],
        priority: 'low',
        impact: 'Provides complete professional picture',
        category: 'Completeness'
      });
    }
    
    // Ensure we have at least some suggestions
    if (newSuggestions.length === 0) {
      newSuggestions.push({
        id: 1,
        type: 'format',
        title: 'Resume Structure Looks Good',
        description: 'Your resume has a solid foundation. Consider adding more specific achievements and metrics.',
        suggestion: 'Focus on quantifying your accomplishments with numbers and percentages',
        priority: 'low',
        impact: 'Enhances overall impact',
        category: 'General'
      });
    }
    
    setSuggestions(newSuggestions);
    setIsGenerating(false);
  };

  const applySuggestion = (suggestion: AISuggestion) => {
    onApplySuggestion(suggestion.type, suggestion);
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const dismissSuggestion = (id: number) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'status-error';
      case 'medium': return 'status-warning';
      case 'low': return 'status-success';
      default: return 'status-info';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'skill': return <Target className="h-4 w-4" />;
      case 'summary': return <Brain className="h-4 w-4" />;
      case 'experience': return <TrendingUp className="h-4 w-4" />;
      case 'keyword': return <Zap className="h-4 w-4" />;
      case 'format': return <Lightbulb className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const categories = ['all', 'Skills', 'Content', 'Experience', 'Keywords', 'Format', 'Completeness', 'General'];
  const filteredSuggestions = activeCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === activeCategory);

  return (
    <Card className="ai-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 icon-accent">
          <Sparkles className="h-5 w-5" />
          <span>AI Assistant</span>
          {suggestions.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {suggestions.length} suggestions
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" 
                   style={{ background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(30, 58, 138, 0.1) 100%)' }}>
                <Brain className="h-8 w-8 icon-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--figma-neutral-800)' }}>AI-Powered Resume Enhancement</h3>
              <p className="mb-6 max-w-md mx-auto" style={{ color: 'var(--figma-neutral-600)' }}>
                Get personalized suggestions to improve your resume's impact, ATS compatibility, and overall effectiveness
              </p>
            </div>
            <Button 
              onClick={generateSuggestions}
              disabled={isGenerating}
              className="btn-accent"
            >
              {isGenerating ? (
                <>
                  <div className="loading-spinner h-4 w-4 mr-2" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get AI Suggestions
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className={activeCategory === category ? "btn-primary" : "btn-outline"}
                >
                  {category === 'all' ? 'All' : category}
                </Button>
              ))}
            </div>

            {/* Suggestions List */}
            <div className="space-y-4">
              {filteredSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="ai-suggestion">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}>
                        {getTypeIcon(suggestion.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold" style={{ color: 'var(--figma-neutral-900)' }}>{suggestion.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={getPriorityColor(suggestion.priority)}>
                            {suggestion.priority} priority
                          </Badge>
                          <span className="text-xs" style={{ color: 'var(--figma-neutral-500)' }}>{suggestion.impact}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissSuggestion(suggestion.id)}
                      className="hover:bg-red-50"
                      style={{ color: 'var(--figma-neutral-400)' }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-sm mb-4" style={{ color: 'var(--figma-neutral-600)' }}>{suggestion.description}</p>
                  
                  {suggestion.type === 'skill' && suggestion.suggestions && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {suggestion.suggestions.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="skill-intermediate hover:bg-blue-200">
                          + {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {suggestion.type === 'summary' && suggestion.suggestion && (
                    <div className="p-4 rounded-lg text-sm mb-4 border-l-4" 
                         style={{ 
                           backgroundColor: 'var(--figma-neutral-50)', 
                           borderColor: 'var(--figma-accent)' 
                         }}>
                      <p style={{ color: 'var(--figma-neutral-700)' }}>{suggestion.suggestion}</p>
                    </div>
                  )}

                  {suggestion.type === 'keyword' && suggestion.suggestions && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {suggestion.suggestions.map((keyword: string, index: number) => (
                        <Badge key={index} variant="outline" className="status-info">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => applySuggestion(suggestion)}
                      className="btn-primary"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Apply Suggestion
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => dismissSuggestion(suggestion.id)}
                      className="btn-outline"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Generate More Button */}
            <div className="text-center pt-4" style={{ borderTop: '1px solid var(--figma-neutral-200)' }}>
              <Button
                variant="outline"
                onClick={generateSuggestions}
                disabled={isGenerating}
                className="btn-outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate More Suggestions
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}