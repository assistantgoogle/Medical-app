import React, { useEffect, useState } from 'react';
import dicomParser from 'dicom-parser';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImageViewer } from './ImageViewer';

interface DicomViewerProps {
  file: File;
}

interface DicomMetadata {
  patientName?: string;
  patientId?: string;
  studyDate?: string;
  modality?: string;
  imageWidth?: number;
  imageHeight?: number;
  pixelSpacing?: string;
  sliceThickness?: string;
  acquisitionDate?: string;
  [key: string]: string | number | undefined;
}

export const DicomViewer: React.FC<DicomViewerProps> = ({ file }) => {
  const [metadata, setMetadata] = useState<DicomMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [pixelSpacingValue, setPixelSpacingValue] = useState<number>(0);

  useEffect(() => {
    const readDicomFile = async () => {
      try {
        console.log('Reading DICOM file:', file.name);
        const arrayBuffer = await file.arrayBuffer();
        const byteArray = new Uint8Array(arrayBuffer);
        const dataSet = dicomParser.parseDicom(byteArray);

        console.log('DICOM dataset parsed successfully');

        // Extract pixel spacing - typically stored as a string like "0.5\0.5"
        const pixelSpacing = dataSet.string('x00280030');
        const pixelSpacingNumber = pixelSpacing ? parseFloat(pixelSpacing.split('\\')[0]) : 1.0;
        setPixelSpacingValue(pixelSpacingNumber);

        const metadata: DicomMetadata = {
          patientName: dataSet.string('x00100010') || 'Unknown',
          patientId: dataSet.string('x00100020') || 'N/A',
          studyDate: dataSet.string('x00080020'),
          modality: dataSet.string('x00080060'),
          acquisitionDate: dataSet.string('x00080022'),
          imageWidth: dataSet.uint16('x00280011'),
          imageHeight: dataSet.uint16('x00280010'),
          pixelSpacing: pixelSpacing,
          sliceThickness: dataSet.string('x00180050')
        };

        console.log('Extracted DICOM Metadata:', metadata);
        setMetadata(metadata);
        setError(null);

        // Create object URL for image display
        const blob = new Blob([byteArray], { type: 'application/dicom' });
        const url = URL.createObjectURL(blob);
        setImageUrl(url);

      } catch (err) {
        console.error('Error parsing DICOM file:', err);
        setError('Error parsing DICOM file. Please ensure this is a valid DICOM file.');
        setMetadata(null);
      }
    };

    readDicomFile();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [file]);

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  const formatMetadataValue = (key: string, value: string | number | undefined) => {
    if (value === undefined) return 'N/A';
    
    switch (key) {
      case 'pixelSpacing':
        return `${value} mm/pixel`;
      case 'sliceThickness':
        return `${value} mm`;
      case 'imageWidth':
      case 'imageHeight':
        return `${value} pixels`;
      case 'studyDate':
      case 'acquisitionDate':
        if (!value) return 'N/A';
        try {
          // DICOM dates are in YYYYMMDD format
          const year = value.toString().substring(0, 4);
          const month = value.toString().substring(4, 6);
          const day = value.toString().substring(6, 8);
          return new Date(`${year}-${month}-${day}`).toLocaleDateString();
        } catch {
          return value.toString();
        }
      default:
        return value.toString();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">DICOM Metadata</h3>
        <ScrollArea className="h-[300px] rounded-md border p-4">
          {metadata && Object.entries(metadata).map(([key, value]) => (
            value && (
              <div key={key} className="flex justify-between py-2 border-b last:border-0">
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  {formatMetadataValue(key, value)}
                </span>
              </div>
            )
          ))}
        </ScrollArea>
      </Card>

      {imageUrl && (
        <Card className="p-6">
          <ImageViewer 
            imageUrl={imageUrl} 
            pixelSpacing={pixelSpacingValue}
          />
        </Card>
      )}
    </div>
  );
};