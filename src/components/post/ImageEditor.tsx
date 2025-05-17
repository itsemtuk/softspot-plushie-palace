import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ImageEditorOptions } from "@/types/marketplace";
import { Crop, Sliders, Sparkles } from "lucide-react";
import { CropControls } from "./image-editor/CropControls";
import { AdjustmentControls } from "./image-editor/AdjustmentControls";
import { FilterPresets } from "./image-editor/FilterPresets";
import { ImageCropper } from "./image-editor/ImageCropper";
import { CropperRef } from 'react-advanced-cropper';

interface ImageEditorProps {
  imageUrl: string;
  options?: ImageEditorOptions;
  onSave: (editedImage: string) => void;
  onCancel: () => void;
}

// Predefined filter presets
const FILTER_PRESETS = [
  { name: "Normal", filter: "" },
  { name: "Vintage", filter: "sepia(0.5) contrast(1.1)" },
  { name: "Dramatic", filter: "contrast(1.3) brightness(0.9) saturate(1.2)" },
  { name: "Cinematic", filter: "contrast(1.1) brightness(0.95) saturate(1.1) hue-rotate(5deg)" },
  { name: "Warm", filter: "brightness(1.1) sepia(0.3) saturate(1.3)" },
  { name: "Cool", filter: "brightness(1.1) hue-rotate(330deg) saturate(1.3)" },
  { name: "Grayscale", filter: "grayscale(1)" },
  { name: "High Contrast", filter: "contrast(1.5) brightness(0.9)" },
  { name: "Soft", filter: "contrast(0.9) brightness(1.1) saturate(0.9)" },
];

// Aspect ratio presets
const ASPECT_RATIOS = [
  { label: "1:1", value: 1 },
  { label: "4:5", value: 4/5 },
  { label: "16:9", value: 16/9 },
  { label: "Free", value: null },
];

export const ImageEditor = ({ imageUrl, options, onSave, onCancel }: ImageEditorProps) => {
  // Cropper state
  const cropperRef = useRef<CropperRef>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(1); // Default to 1:1 square
  const [rotation, setRotation] = useState(0);
  
  // Filter states
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [activePreset, setActivePreset] = useState<string>("Normal");
  const [filterIntensity, setFilterIntensity] = useState([100]);

  // Image preview with applied filters
  const imageRef = useRef<HTMLImageElement>(null);

  // Current tab
  const [activeTab, setActiveTab] = useState('crop');

  const handleAspectRatioChange = (ratio: number | null) => {
    setAspectRatio(ratio);
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFilterPresetChange = (preset: string) => {
    setActivePreset(preset);
    // Reset sliders to default when changing presets
    if (preset === "Normal") {
      setBrightness([100]);
      setContrast([100]);
      setSaturation([100]);
    }
  };

  // Function to apply the current filters to a canvas
  const applyFilters = () => {
    // Get the crop data
    if (!cropperRef.current) return imageUrl;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx || !imageRef.current) return imageUrl;
    
    // Get cropped coordinates from cropper
    const data = cropperRef.current.getCanvas();
    if (!data) return imageUrl;
    
    // Set canvas dimensions to match the cropped area
    canvas.width = data.width; // Use width instead of naturalWidth
    canvas.height = data.height; // Use height instead of naturalHeight

    // Apply filters
    let filterString = "";
    
    // Apply preset filter (if any)
    const preset = FILTER_PRESETS.find(p => p.name === activePreset);
    if (preset && preset.filter) {
      filterString += preset.filter + " ";
    }
    
    // Apply manual adjustments
    filterString += `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`;
    
    // Apply filter intensity
    const intensity = filterIntensity[0] / 100;
    if (intensity !== 1 && preset && preset.name !== "Normal") {
      // Blend the filtered image with the original based on intensity
      ctx.filter = "none";
      ctx.drawImage(data, 0, 0, canvas.width, canvas.height);
      
      // Create a temporary canvas for the filtered version
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      
      if (tempCtx) {
        tempCtx.filter = filterString;
        tempCtx.drawImage(data, 0, 0, canvas.width, canvas.height);
        
        // Apply the filtered version with opacity for blending
        ctx.globalAlpha = intensity;
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.globalAlpha = 1.0;
      }
    } else {
      // Apply filters directly if intensity is 100%
      ctx.filter = filterString;
      ctx.drawImage(data, 0, 0, canvas.width, canvas.height);
    }
    
    // Return the edited image as a data URL
    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const handleSave = () => {
    const editedImageUrl = applyFilters();
    onSave(editedImageUrl);
  };

  const getCurrentFilter = () => {
    if (activePreset === "Normal" && brightness[0] === 100 && contrast[0] === 100 && saturation[0] === 100) {
      return "";
    }

    let filterString = "";
    const preset = FILTER_PRESETS.find(p => p.name === activePreset);
    if (preset && preset.filter) {
      filterString += preset.filter + " ";
    }
    
    filterString += `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`;
    return filterString;
  };

  return (
    <Card className="p-4 max-w-md mx-auto">
      <Tabs defaultValue="crop" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="crop" className="flex items-center gap-1">
            <Crop className="h-4 w-4" />
            <span>Crop</span>
          </TabsTrigger>
          <TabsTrigger value="adjust" className="flex items-center gap-1">
            <Sliders className="h-4 w-4" />
            <span>Adjust</span>
          </TabsTrigger>
          <TabsTrigger value="filters" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span>Filters</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="aspect-square relative mb-6 overflow-hidden rounded-lg bg-gray-200">
          {/* Hidden reference image to apply filters preview */}
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Original image"
            className="hidden"
          />
          
          {/* Cropper component */}
          <ImageCropper
            ref={cropperRef}
            image={imageUrl}
            onCrop={(cropper) => {}} // Add empty function to satisfy prop requirements
            aspectRatio={aspectRatio || undefined}
          />
        </div>
        
        <TabsContent value="crop">
          <CropControls
            aspectRatio={aspectRatio}
            handleAspectRatioChange={handleAspectRatioChange}
            handleRotateLeft={handleRotateLeft}
            handleRotateRight={handleRotateRight}
            aspectRatios={ASPECT_RATIOS}
          />
        </TabsContent>
        
        <TabsContent value="adjust">
          <AdjustmentControls
            brightness={brightness}
            setBrightness={setBrightness}
            contrast={contrast}
            setContrast={setContrast}
            saturation={saturation}
            setSaturation={setSaturation}
          />
        </TabsContent>
        
        <TabsContent value="filters">
          <FilterPresets
            imageUrl={imageUrl}
            activePreset={activePreset}
            handleFilterPresetChange={handleFilterPresetChange}
            filterIntensity={filterIntensity}
            setFilterIntensity={setFilterIntensity}
            filterPresets={FILTER_PRESETS}
          />
        </TabsContent>
      </Tabs>

      <div className="flex gap-2 mt-6">
        <Button onClick={handleSave} className="flex-1">
          Apply Changes
        </Button>
        <Button onClick={onCancel} variant="outline" className="flex-1">
          Cancel
        </Button>
      </div>
    </Card>
  );
};
