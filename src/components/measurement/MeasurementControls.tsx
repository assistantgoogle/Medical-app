import React from 'react';
import { Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MeasurementControlsProps {
  isActive: boolean;
  hasStartPoint: boolean;
  hasEndPoint: boolean;
  measurement: { pixels: number; mm: number } | null;
  onToggle: () => void;
  onReset: () => void;
}

export const MeasurementControls: React.FC<MeasurementControlsProps> = ({
  isActive,
  hasStartPoint,
  hasEndPoint,
  measurement,
  onToggle,
  onReset,
}) => {
  return (
    <div className="measurement-tool">
      <Button
        variant={isActive ? "secondary" : "outline"}
        size="sm"
        onClick={onToggle}
        className="flex items-center gap-2"
      >
        <Ruler className="w-4 h-4" />
        {isActive ? 'Cancel Measurement' : 'Measure Distance'}
      </Button>

      {isActive && !hasStartPoint && (
        <Badge variant="outline" className="ml-2">
          Click to set start point
        </Badge>
      )}

      {isActive && hasStartPoint && !hasEndPoint && (
        <Badge variant="outline" className="ml-2">
          Click to set end point
        </Badge>
      )}

      {measurement && (
        <div className="mt-2 space-y-1">
          <p className="text-sm text-muted-foreground">
            Distance: {measurement.pixels} pixels ({measurement.mm} mm)
          </p>
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset
          </Button>
        </div>
      )}
    </div>
  );
};