import React, { useEffect, useRef, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, Sun, Contrast } from 'lucide-react';
import { MeasurementTool } from './MeasurementTool';

interface ImageViewerProps {
  imageUrl: string;
  pixelSpacing?: number;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ 
  imageUrl,
  pixelSpacing = 1.0 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas dimensions to match image
      canvas.width = image.width;
      canvas.height = image.height;

      console.log('Image loaded with dimensions:', {
        width: image.width,
        height: image.height,
        pixelSpacing
      });

      // Apply transformations
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      
      // Calculate zoom
      const scale = zoom / 100;
      ctx.scale(scale, scale);
      
      // Draw image
      ctx.drawImage(image, 0, 0);
    };
  }, [imageUrl, brightness, contrast, zoom]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="image-controls space-y-4">
        <MeasurementTool 
          canvasRef={canvasRef}
          pixelSpacing={pixelSpacing}
        />

        <div className="flex items-center gap-2">
          <ZoomOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <Slider
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0])}
            min={50}
            max={200}
            step={1}
            className="w-24"
          />
          <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </div>

        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <Slider
            value={[brightness]}
            onValueChange={(value) => setBrightness(value[0])}
            min={0}
            max={200}
            step={1}
            className="w-24"
          />
        </div>

        <div className="flex items-center gap-2">
          <Contrast className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <Slider
            value={[contrast]}
            onValueChange={(value) => setContrast(value[0])}
            min={0}
            max={200}
            step={1}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};