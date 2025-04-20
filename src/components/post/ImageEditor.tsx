
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ImageEditorOptions } from "@/types/marketplace";

interface ImageEditorProps {
  imageUrl: string;
  options?: ImageEditorOptions;
  onSave: (editedImage: string) => void;
}

export const ImageEditor = ({ imageUrl, options, onSave }: ImageEditorProps) => {
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);

  const applyFilters = () => {
    // In a real app, we'd apply the filters here
    // For now, we'll just pass the original image
    onSave(imageUrl);
  };

  return (
    <Card className="p-4">
      <div className="aspect-square relative mb-4">
        <img
          src={imageUrl}
          alt="Edit preview"
          className="w-full h-full object-cover rounded-lg"
          style={{
            filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`
          }}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Brightness</label>
          <Slider
            value={brightness}
            onValueChange={setBrightness}
            max={200}
            step={1}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Contrast</label>
          <Slider
            value={contrast}
            onValueChange={setContrast}
            max={200}
            step={1}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Saturation</label>
          <Slider
            value={saturation}
            onValueChange={setSaturation}
            max={200}
            step={1}
          />
        </div>

        <Button onClick={applyFilters} className="w-full">
          Apply Changes
        </Button>
      </div>
    </Card>
  );
};
