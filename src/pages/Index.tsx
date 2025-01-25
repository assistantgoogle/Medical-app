import React, { useState } from 'react';
import { ImageUploader } from '@/components/ImageUploader';
import { ImageViewer } from '@/components/ImageViewer';
import { DicomViewer } from '@/components/DicomViewer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDicom, setIsDicom] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleFileUpload = (file: File) => {
    setSelectedFile(file);
    setIsDicom(file.name.toLowerCase().endsWith('.dcm'));
    
    if (!isDicom) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  return (
    <div className="gradient-background min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-left slide-up-animation">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Medical Image Viewer
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Upload, view, and analyze medical images with ease
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 slide-up-animation" style={{ animationDelay: '0.1s' }}>
          <ImageUploader onFileUpload={handleFileUpload} />
        </Card>

        {selectedFile && (
          <div className="space-y-6 slide-up-animation" style={{ animationDelay: '0.2s' }}>
            {isDicom ? (
              <DicomViewer file={selectedFile} />
            ) : imageUrl && (
              <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50">
                <ImageViewer imageUrl={imageUrl} />
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;