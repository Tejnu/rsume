'use client';

import { FileText, Download, Share, Upload, Sparkles, Menu, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';

interface HeaderProps {
  onFileUpload?: (file: File) => void;
  onAIEnhance?: () => void;
  isAIProcessing?: boolean;
  onDownloadPDF?: () => void;
}

export function Header({ onFileUpload, onAIEnhance, isAIProcessing, onDownloadPDF }: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
      event.target.value = '';
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Resume - Built with Alumna',
          text: 'Check out my professional resume built with Alumna AI Resume Builder',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-2 w-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                Alumna
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">AI-Powered Resume Builder</p>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 rounded-xl"
            >
              <Upload className="h-4 w-4" />
              <span>Import Resume</span>
            </Button>

            <Button
              onClick={onAIEnhance}
              disabled={isAIProcessing}
              className="btn-primary flex items-center space-x-2"
            >
              {isAIProcessing ? (
                <div className="loading-spinner h-4 w-4" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              <span>{isAIProcessing ? 'Enhancing...' : 'AI Enhance'}</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center space-x-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 rounded-xl"
            >
              <Share className="h-4 w-4" />
              <span>Share</span>
            </Button>

            <Button
              onClick={onDownloadPDF}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-xl"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full justify-start border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-xl"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Resume
              </Button>

              <Button
                onClick={onAIEnhance}
                disabled={isAIProcessing}
                className="btn-primary w-full justify-start"
              >
                {isAIProcessing ? (
                  <div className="loading-spinner h-4 w-4 mr-2" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                {isAIProcessing ? 'Enhancing...' : 'AI Enhance'}
              </Button>

              <Button
                variant="outline"
                onClick={handleShare}
                className="w-full justify-start border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button
                onClick={onDownloadPDF}
                className="btn-secondary w-full justify-start"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}