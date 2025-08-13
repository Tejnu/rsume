'use client';

import { FileText, Download, Share, Upload, Sparkles, Zap, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';

interface HeaderProps {
  onFileUpload?: (file: File) => void;
  onAIEnhance?: () => void;
  isAIProcessing?: boolean;
}

export function Header({ onFileUpload, onAIEnhance, isAIProcessing }: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDownloadPDF = () => {
    // PDF download functionality
    window.print();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
      // Reset the input
      event.target.value = '';
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Resume',
          text: 'Check out my resume built with Resume Builder Pro',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg gradient-primary">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Resume Builder Pro
              </h1>
              <p className="text-sm text-slate-600 hidden sm:block">Create professional resumes with AI assistance</p>
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
              className="flex items-center space-x-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Resume</span>
            </Button>
            <Button
              onClick={onAIEnhance}
              disabled={isAIProcessing}
              className="btn-primary flex items-center space-x-2"
            >
              {isAIProcessing ? (
                <div className="loading-spinner h-4 w-4" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>{isAIProcessing ? 'Enhancing...' : 'AI Enhance'}</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center space-x-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
            >
              <Share className="h-4 w-4" />
              <span>Share</span>
            </Button>
            <Button
              onClick={handleDownloadPDF}
              className="btn-success flex items-center space-x-2"
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
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-slate-200">
            <div className="flex flex-col space-y-2">
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
                className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Resume
              </Button>
              <Button
                onClick={onAIEnhance}
                disabled={isAIProcessing}
                className="btn-primary w-full justify-start"
              >
                {isAIProcessing ? (
                  <div className="loading-spinner h-4 w-4 mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {isAIProcessing ? 'Enhancing...' : 'AI Enhance'}
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                onClick={handleDownloadPDF}
                className="btn-success w-full justify-start"
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