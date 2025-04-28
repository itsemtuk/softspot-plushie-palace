
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ImageEditorOptions } from "@/types/marketplace";
import { Crop, Move, SunMedium, Contrast, Palette } from "lucide-react";

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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset position when scale changes
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
  }, [scale]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    // Calculate new position
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Calculate boundaries to prevent image from being dragged too far
    const maxOffset = (scale[0] / 100 - 1) * 50; // This creates a boundary based on scale
    
    const clampedX = Math.max(Math.min(newX, maxOffset), -maxOffset);
    const clampedY = Math.max(Math.min(newY, maxOffset), -maxOffset);
    
    setPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    
    // Calculate new position
    const newX = e.touches[0].clientX - dragStart.x;
    const newY = e.touches[0].clientY - dragStart.y;
    
    // Calculate boundaries to prevent image from being dragged too far
    const maxOffset = (scale[0] / 100 - 1) * 50; // This creates a boundary based on scale
    
    const clampedX = Math.max(Math.min(newX, maxOffset), -maxOffset);
    const clampedY = Math.max(Math.min(newY, maxOffset), -maxOffset);
    
    setPosition({ x: clampedX, y: clampedY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const applyFilters = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx || !imageRef.current) return;
    
    const img = imageRef.current;
    
    // Get the dimensions of the displayed image
    const container = containerRef.current;
    if (!container) return;
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Set canvas dimensions to match the container
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    // Calculate scaling and position adjustments
    const scaleValue = scale[0] / 100;
    
    // Apply filters
    ctx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`;
    
    // Calculate source and destination dimensions
    const scaledWidth = img.naturalWidth / scaleValue;
    const scaledHeight = img.naturalHeight / scaleValue;
    
    // Calculate positioning
    const sourceX = ((scaledWidth - img.naturalWidth) / 2) - (position.x * img.naturalWidth / containerWidth);
    const sourceY = ((scaledHeight - img.naturalHeight) / 2) - (position.y * img.naturalHeight / containerHeight);
    
    // Draw the image with proper scaling and positioning
    ctx.drawImage(
      img,
      Math.max(0, sourceX), Math.max(0, sourceY),
      Math.min(scaledWidth, img.naturalWidth), Math.min(scaledHeight, img.naturalHeight),
      0, 0,
      canvas.width, canvas.height
    );
    
    // Get the edited image as base64
    const editedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
    onSave(editedImageUrl);
  };

  return (
    <Card className="p-4">
      <div 
        ref={containerRef}
        className="aspect-square relative mb-4 overflow-hidden rounded-lg bg-gray-200"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Edit preview"
          className="w-full h-full object-cover rounded-lg cursor-move"
          style={{
            filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`,
            transform: `scale(${scale[0] / 100}) translate(${position.x}px, ${position.y}px)`,
            transformOrigin: 'center center'
          }}
        />
        {scale[0] > 100 && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
            <Move className="h-3 w-3 inline mr-1" />
            Drag to position
          </div>
        )}
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
            className="my-2"
          />
          <p className="text-xs text-gray-500">Scale up to crop your image, then drag to position</p>
        </div>

        <div>
          <label className="text-sm font-medium flex items-center">
            <SunMedium className="h-4 w-4 mr-2" />
            Brightness
          </label>
          <Slider
            value={brightness}
            onValueChange={setBrightness}
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
            max={200}
            step={1}
            className="my-2"
          />
        </div>

        <Button onClick={applyFilters} className="w-full">
          Apply Changes
        </Button>
      </div>
    </Card>
  );
};
