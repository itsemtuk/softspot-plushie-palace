import { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ImageEditorOptions } from "@/types/ui";

interface ImageEditorProps {
  imageUrl: string;
  onSave: (options: ImageEditorOptions) => void;
  onCancel: () => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, onSave, onCancel }) => {
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(100);
  const [cropHeight, setCropHeight] = useState(100);

  const imageRef = useRef<HTMLImageElement>(null);

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
  };

  const handleContrastChange = (value: number) => {
    setContrast(value);
  };

  const handleSaturationChange = (value: number) => {
    setSaturation(value);
  };

  const handleSave = useCallback(() => {
    const options: ImageEditorOptions = {
      brightness: brightness,
      contrast: contrast,
      saturation: saturation,
      cropX: cropX,
      cropY: cropY,
      cropWidth: cropWidth,
      cropHeight: cropHeight,
    };
    onSave(options);
  }, [brightness, contrast, saturation, cropX, cropY, cropWidth, cropHeight, onSave]);

  const applyFilters = () => {
    if (imageRef.current) {
      imageRef.current.style.filter = `
        brightness(${brightness}%)
        contrast(${contrast}%)
        saturate(${saturation}%)
      `;
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="space-y-4">
        <div className="relative">
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Editable"
            style={{
              filter: `
                brightness(${brightness}%)
                contrast(${contrast}%)
                saturate(${saturation}%)
              `,
              objectFit: 'cover',
              width: '100%',
              height: 'auto',
              maxHeight: '400px',
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="brightness" className="text-sm font-medium">
              Brightness:
            </label>
            <span className="text-sm text-gray-500">{brightness}%</span>
          </div>
          <Slider
            id="brightness"
            defaultValue={[brightness]}
            min={0}
            max={200}
            step={1}
            onValueChange={(value) => {
              handleBrightnessChange(value[0]);
              applyFilters();
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="contrast" className="text-sm font-medium">
              Contrast:
            </label>
            <span className="text-sm text-gray-500">{contrast}%</span>
          </div>
          <Slider
            id="contrast"
            defaultValue={[contrast]}
            min={0}
            max={200}
            step={1}
            onValueChange={(value) => {
              handleContrastChange(value[0]);
              applyFilters();
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="saturation" className="text-sm font-medium">
              Saturation:
            </label>
            <span className="text-sm text-gray-500">{saturation}%</span>
          </div>
          <Slider
            id="saturation"
            defaultValue={[saturation]}
            min={0}
            max={200}
            step={1}
            onValueChange={(value) => {
              handleSaturationChange(value[0]);
              applyFilters();
            }}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </CardContent>
    </Card>
  );
};
