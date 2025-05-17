
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ImageEditorOptions } from "@/types/marketplace";
import { Crop, Move, SunMedium, Contrast, Palette, RotateCcw, RotateCw, Sparkles, Sliders } from "lucide-react";
import { Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';

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
  const cropperRef = useRef<any>(null);
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
    canvas.width = data.naturalWidth;
    canvas.height = data.naturalHeight;

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
          <Cropper
            ref={cropperRef}
            src={imageUrl}
            className="cropper"
            aspectRatio={aspectRatio as any}
            stencilProps={{
              handlers: true,
              lines: true,
              movable: true,
              resizable: true,
            }}
            style={{
              width: '100%',
              height: '100%',
            }}
            imageRestriction="stencil"
            defaultSize={{
              width: 0.8,
              height: 0.8,
            }}
            backgroundProps={{
              style: {
                filter: activePreset !== "Normal" || brightness[0] !== 100 || contrast[0] !== 100 || saturation[0] !== 100 ?
                  `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%) ${FILTER_PRESETS.find(p => p.name === activePreset)?.filter || ""}` : ""
              }
            }}
          />
        </div>
        
        <TabsContent value="crop">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium flex items-center mb-2">
                <Crop className="h-4 w-4 mr-2" />
                Aspect Ratio
              </label>
              <div className="flex gap-2">
                {ASPECT_RATIOS.map((ratio) => (
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
        </TabsContent>
        
        <TabsContent value="adjust">
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
        </TabsContent>
        
        <TabsContent value="filters">
          <div className="space-y-4">
            <label className="text-sm font-medium">Presets</label>
            <div className="grid grid-cols-3 gap-2">
              {FILTER_PRESETS.map((preset) => (
                <div 
                  key={preset.name}
                  onClick={() => handleFilterPresetChange(preset.name)}
                  className={`cursor-pointer transition-all ${activePreset === preset.name ? 'ring-2 ring-softspot-500 ring-offset-2' : 'hover:opacity-80'} overflow-hidden rounded-md`}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={imageUrl} 
                      alt={preset.name}
                      className="object-cover w-full h-full"
                      style={{ filter: preset.filter }}
                    />
                  </div>
                  <p className="text-xs font-medium text-center mt-1">{preset.name}</p>
                </div>
              ))}
            </div>
            
            {activePreset !== "Normal" && (
              <div>
                <label className="text-sm font-medium flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Filter Intensity
                </label>
                <Slider
                  value={filterIntensity}
                  onValueChange={setFilterIntensity}
                  min={0}
                  max={100}
                  step={1}
                  className="my-2"
                />
              </div>
            )}
          </div>
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
