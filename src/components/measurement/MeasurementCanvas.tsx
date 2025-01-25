import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface MeasurementCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isActive: boolean;
  startPoint: Point | null;
  endPoint: Point | null;
  onPointSet: (point: Point) => void;
}

export const MeasurementCanvas: React.FC<MeasurementCanvasProps> = ({
  canvasRef,
  isActive,
  startPoint,
  endPoint,
  onPointSet,
}) => {
  const imageRef = useRef<HTMLImageElement | null>(null);

  const redrawImage = () => {
    if (!canvasRef.current || !imageRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(imageRef.current, 0, 0);

    if (startPoint && endPoint) {
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  const handleCanvasClick = (event: MouseEvent) => {
    if (!isActive || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    if (!startPoint) {
      const img = new Image();
      img.src = canvasRef.current.toDataURL();
      imageRef.current = img;
    }

    onPointSet(point);
  };

  const handleCanvasMouseMove = (event: MouseEvent) => {
    if (!isActive || !canvasRef.current || !startPoint || endPoint) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    redrawImage();
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    
    if (isActive) {
      canvas.addEventListener('click', handleCanvasClick);
      canvas.addEventListener('mousemove', handleCanvasMouseMove);
    }

    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
      canvas.removeEventListener('mousemove', handleCanvasMouseMove);
    };
  }, [isActive, startPoint, endPoint]);

  return null;
};