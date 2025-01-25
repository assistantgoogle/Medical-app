import React, { useState } from 'react';
import { MeasurementControls } from './measurement/MeasurementControls';
import { MeasurementCanvas } from './measurement/MeasurementCanvas';

interface Point {
  x: number;
  y: number;
}

interface MeasurementToolProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  pixelSpacing: number;
}

export const MeasurementTool: React.FC<MeasurementToolProps> = ({ 
  canvasRef, 
  pixelSpacing 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const [measurement, setMeasurement] = useState<{ pixels: number; mm: number } | null>(null);

  const handlePointSet = (point: Point) => {
    if (!startPoint) {
      console.log('Setting start point:', point);
      setStartPoint(point);
    } else if (!endPoint) {
      console.log('Setting end point:', point);
      setEndPoint(point);
      
      // Calculate pixel distance
      const pixelDistance = Math.sqrt(
        Math.pow(point.x - startPoint.x, 2) + Math.pow(point.y - startPoint.y, 2)
      );
      
      // Convert to millimeters using pixel spacing
      const mmDistance = pixelDistance * pixelSpacing;
      
      console.log('Measurement calculated:', {
        pixels: pixelDistance,
        mm: mmDistance,
        pixelSpacing
      });

      setMeasurement({
        pixels: Math.round(pixelDistance),
        mm: Number(mmDistance.toFixed(2))
      });
    }
  };

  const resetMeasurement = () => {
    console.log('Resetting measurement');
    setStartPoint(null);
    setEndPoint(null);
    setMeasurement(null);
  };

  const toggleMeasurement = () => {
    console.log('Toggling measurement tool:', !isActive);
    setIsActive(!isActive);
    resetMeasurement();
  };

  return (
    <>
      <MeasurementControls
        isActive={isActive}
        hasStartPoint={!!startPoint}
        hasEndPoint={!!endPoint}
        measurement={measurement}
        onToggle={toggleMeasurement}
        onReset={resetMeasurement}
      />
      
      <MeasurementCanvas
        canvasRef={canvasRef}
        isActive={isActive}
        startPoint={startPoint}
        endPoint={endPoint}
        onPointSet={handlePointSet}
      />
    </>
  );
};