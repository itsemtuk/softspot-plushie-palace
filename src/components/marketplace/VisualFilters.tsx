
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface VisualFiltersProps {
  selectedBrands: string[];
  selectedColors: string[];
  selectedConditions: string[];
  onBrandToggle: (brand: string) => void;
  onColorToggle: (color: string) => void;
  onConditionToggle: (condition: string) => void;
  onClearAll: () => void;
}

const BRAND_COLORS = {
  "jellycat": "bg-green-100 text-green-800 border-green-200",
  "squishmallows": "bg-pink-100 text-pink-800 border-pink-200",
  "pokemon": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "sanrio": "bg-purple-100 text-purple-800 border-purple-200",
  "disney": "bg-blue-100 text-blue-800 border-blue-200",
  "build-a-bear": "bg-orange-100 text-orange-800 border-orange-200"
};

const COLORS = [
  { name: "Pink", value: "pink", style: "bg-pink-400" },
  { name: "Blue", value: "blue", style: "bg-blue-400" },
  { name: "Purple", value: "purple", style: "bg-purple-400" },
  { name: "Green", value: "green", style: "bg-green-400" },
  { name: "Yellow", value: "yellow", style: "bg-yellow-400" },
  { name: "Brown", value: "brown", style: "bg-amber-600" },
  { name: "White", value: "white", style: "bg-gray-100 border border-gray-300" },
  { name: "Black", value: "black", style: "bg-gray-900" }
];

const CONDITIONS = ["New", "Like New", "Good", "Fair"];
const BRANDS = ["Jellycat", "Squishmallows", "Pokemon", "Sanrio", "Disney", "Build-a-Bear"];

export function VisualFilters({
  selectedBrands,
  selectedColors,
  selectedConditions,
  onBrandToggle,
  onColorToggle,
  onConditionToggle,
  onClearAll
}: VisualFiltersProps) {
  const hasActiveFilters = selectedBrands.length > 0 || selectedColors.length > 0 || selectedConditions.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="text-gray-500 hover:text-gray-700">
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Brand Filters */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brands</h4>
        <div className="flex flex-wrap gap-2">
          {BRANDS.map((brand) => {
            const isSelected = selectedBrands.includes(brand.toLowerCase());
            const brandKey = brand.toLowerCase().replace(/\s+/g, '-') as keyof typeof BRAND_COLORS;
            const colorClass = BRAND_COLORS[brandKey] || "bg-gray-100 text-gray-800 border-gray-200";
            
            return (
              <Badge
                key={brand}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  isSelected ? colorClass : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => onBrandToggle(brand.toLowerCase())}
              >
                {brand}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Color Filters */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Colors</h4>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => {
            const isSelected = selectedColors.includes(color.value);
            return (
              <button
                key={color.value}
                onClick={() => onColorToggle(color.value)}
                className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${
                  color.style
                } ${
                  isSelected 
                    ? "ring-2 ring-softspot-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800" 
                    : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-offset-gray-800"
                }`}
                title={color.name}
              />
            );
          })}
        </div>
      </div>

      {/* Condition Filters */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Condition</h4>
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map((condition) => {
            const isSelected = selectedConditions.includes(condition.toLowerCase());
            return (
              <Badge
                key={condition}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  isSelected 
                    ? "bg-softspot-500 text-white border-softspot-500" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => onConditionToggle(condition.toLowerCase())}
              >
                {condition}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
