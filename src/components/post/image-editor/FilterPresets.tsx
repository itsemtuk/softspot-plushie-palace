
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

interface FilterPresetsProps {
  imageUrl: string;
  activePreset: string;
  handleFilterPresetChange: (preset: string) => void;
  filterIntensity: number[];
  setFilterIntensity: (value: number[]) => void;
  filterPresets: Array<{ name: string; filter: string }>;
}

export const FilterPresets = ({ 
  imageUrl, 
  activePreset, 
  handleFilterPresetChange, 
  filterIntensity, 
  setFilterIntensity,
  filterPresets
}: FilterPresetsProps) => {
  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">Presets</label>
      <div className="grid grid-cols-3 gap-2">
        {filterPresets.map((preset) => (
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
  );
};
