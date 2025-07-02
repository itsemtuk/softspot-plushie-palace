import React, { useRef, useState, useCallback } from 'react';
import { Cropper, CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Crop, 
  RotateCcw, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Maximize2, 
  Square, 
  Monitor,
  Smartphone,
  Download,
  Undo,
  Redo
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface AdvancedImageEditorProps {
  image: string;
  onSave: (editedImage: string) => void;
  onCancel: () => void;
}

export const AdvancedImageEditor: React.FC<AdvancedImageEditorProps> = ({
  image,
  onSave,
  onCancel
}) => {
  const cropperRef = useRef<CropperRef>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [history, setHistory] = useState<string[]>([image]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const aspectRatios = [
    { label: 'Free', value: null, icon: Move },
    { label: '1:1', value: 1, icon: Square },
    { label: '4:5', value: 4/5, icon: Smartphone },
    { label: '16:9', value: 16/9, icon: Monitor },
    { label: '3:4', value: 3/4, icon: Maximize2 },
  ];

  const addToHistory = useCallback((newImage: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newImage);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  }, [historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  }, [historyIndex, history.length]);

  const handleRotateLeft = useCallback(() => {
    const newRotation = rotation - 90;
    setRotation(newRotation);
    // Note: Manual rotation handling would need to be implemented
    // The react-advanced-cropper doesn't expose rotate method directly
  }, [rotation]);

  const handleRotateRight = useCallback(() => {
    const newRotation = rotation + 90;
    setRotation(newRotation);
    // Note: Manual rotation handling would need to be implemented
    // The react-advanced-cropper doesn't expose rotate method directly
  }, [rotation]);

  const handleZoomChange = useCallback((value: number[]) => {
    const newZoom = value[0];
    setZoom(newZoom);
    // Note: Zoom would be handled via transform styles
  }, []);

  const applyFilters = useCallback(() => {
    if (!cropperRef.current) {
      console.warn('Cropper ref is null');
      return;
    }
    
    try {
      const canvas = cropperRef.current.getCanvas();
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          addToHistory(dataUrl);
        }
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      toast({
        variant: "destructive",
        title: "Filter Error",
        description: "Could not apply filters to image"
      });
    }
  }, [brightness, contrast, saturation, addToHistory]);

  const handleSave = useCallback(() => {
    if (!cropperRef.current) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No image editor available"
      });
      return;
    }

    try {
      const canvas = cropperRef.current.getCanvas();
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Apply all filters before saving
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          onSave(dataUrl);
          toast({
            title: "Image saved!",
            description: "Your edited image has been saved."
          });
        }
      }
    } catch (error) {
      console.error('Error saving image:', error);
      toast({
        variant: "destructive",
        title: "Save Error",
        description: "Could not save the edited image"
      });
    }
  }, [brightness, contrast, saturation, onSave]);

  const resetAll = useCallback(() => {
    setAspectRatio(null);
    setRotation(0);
    setZoom(1);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setHistoryIndex(0);
    try {
      if (cropperRef.current) {
        cropperRef.current.reset();
      }
    } catch (error) {
      console.warn('Could not reset cropper:', error);
    }
  }, []);

  const currentImage = history[historyIndex] || image;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/80">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex === 0}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex === history.length - 1}>
            <Redo className="h-4 w-4" />
          </Button>
          <Badge variant="outline">
            {historyIndex + 1} / {history.length}
          </Badge>
        </div>
        
        <h2 className="text-lg font-semibold">Advanced Image Editor</h2>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={resetAll}>
            Reset All
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Editor Area */}
        <div className="flex-1 flex items-center justify-center p-4 bg-muted/20">
          <div className="w-full h-full max-w-4xl max-h-[70vh] relative">
            {currentImage ? (
              <Cropper
                ref={cropperRef}
                src={currentImage}
                className="w-full h-full"
                stencilProps={{
                  aspectRatio: aspectRatio,
                  grid: true,
                  movable: true,
                  resizable: true,
                  lines: true
                }}
                backgroundWrapperProps={{
                  scaleImage: false,
                  moveImage: true
                }}
                imageRestriction={"stencil" as any}
                style={{
                  filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image to edit
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 border-l border-border/50 bg-background/50 overflow-y-auto">
          <Tabs defaultValue="crop" className="h-full">
            <TabsList className="grid w-full grid-cols-3 m-2">
              <TabsTrigger value="crop">Crop</TabsTrigger>
              <TabsTrigger value="adjust">Adjust</TabsTrigger>
              <TabsTrigger value="transform">Transform</TabsTrigger>
            </TabsList>

            <TabsContent value="crop" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Crop className="h-4 w-4" />
                    Aspect Ratio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {aspectRatios.map((ratio) => {
                    const Icon = ratio.icon;
                    return (
                      <Button
                        key={ratio.label}
                        variant={aspectRatio === ratio.value ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setAspectRatio(ratio.value)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {ratio.label}
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="adjust" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Color Adjustments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Brightness: {brightness}%
                    </label>
                    <Slider
                      value={[brightness]}
                      onValueChange={(value) => setBrightness(value[0])}
                      min={0}
                      max={200}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Contrast: {contrast}%
                    </label>
                    <Slider
                      value={[contrast]}
                      onValueChange={(value) => setContrast(value[0])}
                      min={0}
                      max={200}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Saturation: {saturation}%
                    </label>
                    <Slider
                      value={[saturation]}
                      onValueChange={(value) => setSaturation(value[0])}
                      min={0}
                      max={200}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <Button onClick={applyFilters} className="w-full">
                    Apply Filters
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transform" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Rotate & Zoom</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button onClick={handleRotateLeft} variant="outline" className="flex-1">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Rotate Left
                    </Button>
                    <Button onClick={handleRotateRight} variant="outline" className="flex-1">
                      <RotateCw className="h-4 w-4 mr-2" />
                      Rotate Right
                    </Button>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <ZoomIn className="h-4 w-4" />
                      Zoom: {zoom.toFixed(1)}x
                    </label>
                    <Slider
                      value={[zoom]}
                      onValueChange={handleZoomChange}
                      min={0.1}
                      max={3}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};