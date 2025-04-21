
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ImageEditorOptions } from "@/types/marketplace";
import { Crop } from "lucide-react";

interface ImageEditorProps {
  imageUrl: string;
  options?: ImageEditorOptions;
  onSave: (editedImage: string) => void;
}

export const ImageEditor = ({ imageUrl, options, onSave }: ImageEditorProps) => {
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [scale, setScale] = useState([100]);
  const imageRef = useRef<HTMLImageElement>(null);

  const applyFilters = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx || !imageRef.current) return;
    
    const img = imageRef.current;
    
    // Set canvas dimensions
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    // Apply scaling and centering if needed
    const scaleValue = scale[0] / 100;
    
    // Apply filters
    ctx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`;
    
    // Draw the image with proper scaling
    ctx.drawImage(
      img,
      0, 0,
      img.naturalWidth, img.naturalHeight,
      0, 0,
      canvas.width, canvas.height
    );
    
    // Get the edited image as base64
    const editedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
    onSave(editedImageUrl);
  };

  return (
    <Card className="p-4">
      <div className="aspect-square relative mb-4 overflow-hidden rounded-lg">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Edit preview"
          className="w-full h-full object-cover rounded-lg"
          style={{
            filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`,
            transform: `scale(${scale[0] / 100})`,
          }}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium flex items-center">
            <Crop className="h-4 w-4 mr-2" />
            Scale
          </label>
          <Slider
            value={scale}
            onValueChange={setScale}
            min={100}
            max={200}
            step={1}
          />
        </div>

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
