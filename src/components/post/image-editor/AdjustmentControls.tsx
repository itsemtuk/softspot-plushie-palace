
import React from 'react';
import { SunMedium, Contrast, Palette } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

interface AdjustmentControlsProps {
  brightness: number[];
  setBrightness: (value: number[]) => void;
  contrast: number[];
  setContrast: (value: number[]) => void;
  saturation: number[];
  setSaturation: (value: number[]) => void;
}

export const AdjustmentControls = ({
  brightness,
  setBrightness,
  contrast,
  setContrast,
  saturation,
  setSaturation
}: AdjustmentControlsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium flex items-center">
          <SunMedium className="h-4 w-4 mr-2" />
          Brightness
        </label>
        <Slider
          value={brightness}
          onValueChange={setBrightness}
          min={0}
          max={200}
          step={1}
          className="my-2"
        />
      </div>

      <div>
        <label className="text-sm font-medium flex items-center">
          <Contrast className="h-4 w-4 mr-2" />
          Contrast
        </label>
        <Slider
          value={contrast}
          onValueChange={setContrast}
          min={0}
          max={200}
          step={1}
          className="my-2"
        />
      </div>

      <div>
        <label className="text-sm font-medium flex items-center">
          <Palette className="h-4 w-4 mr-2" />
          Saturation
        </label>
        <Slider
          value={saturation}
          onValueChange={setSaturation}
          min={0}
          max={200}
          step={1}
          className="my-2"
        />
      </div>
    </div>
  );
};
