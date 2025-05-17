
import React from 'react';
import { Crop, RotateCcw, RotateCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CropControlsProps {
  aspectRatio: number | null;
  handleAspectRatioChange: (ratio: number | null) => void;
  handleRotateLeft: () => void;
  handleRotateRight: () => void;
  aspectRatios: Array<{ label: string; value: number | null }>;
}

export const CropControls = ({
  aspectRatio,
  handleAspectRatioChange,
  handleRotateLeft,
  handleRotateRight,
  aspectRatios
}: CropControlsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium flex items-center mb-2">
          <Crop className="h-4 w-4 mr-2" />
          Aspect Ratio
        </label>
        <div className="flex gap-2">
          {aspectRatios.map((ratio) => (
            <Button
              key={ratio.label}
              variant={aspectRatio === ratio.value ? "default" : "outline"}
              onClick={() => handleAspectRatioChange(ratio.value)}
              className="flex-1"
            >
              {ratio.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium flex items-center mb-2">
          Rotate Image
        </label>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRotateLeft} className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Rotate Left
          </Button>
          <Button variant="outline" onClick={handleRotateRight} className="flex-1">
            <RotateCw className="h-4 w-4 mr-2" />
            Rotate Right
          </Button>
        </div>
      </div>
    </div>
  );
};
