import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onFileUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.dcm'],
    },
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
  });

  return (
    <div 
      {...getRootProps()} 
      className={`upload-zone ${isDragging ? 'dragging' : ''}`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500" />
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
          Drop your image here, or click to select
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Supports JPEG, PNG and DICOM files
        </p>
      </div>
    </div>
  );
};