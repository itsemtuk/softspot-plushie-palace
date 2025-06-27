
import { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Brand {
  id: string;
  name: string;
  count: number;
}

const brands: Brand[] = [
  { id: "jellycat", name: "Jellycat", count: 45 },
  { id: "squishmallows", name: "Squishmallows", count: 38 },
  { id: "pokemon", name: "Pokémon", count: 52 },
  { id: "sanrio", name: "Sanrio", count: 31 },
  { id: "disney", name: "Disney", count: 29 },
  { id: "build-a-bear", name: "Build-A-Bear", count: 22 }
];

const categories = [
  { id: "all", name: "All", count: 217 },
  { id: "bears", name: "Bears", count: 45 },
  { id: "bunnies", name: "Bunnies", count: 38 },
  { id: "cats", name: "Cats", count: 32 },
  { id: "dogs", name: "Dogs", count: 28 },
  { id: "fantasy", name: "Fantasy", count: 41 }
];

interface MobileMarketplaceNavProps {
  activeBrand?: string;
  activeCategory?: string;
  onBrandSelect?: (brandId: string) => void;
  onCategorySelect?: (categoryId: string) => void;
}

export function MobileMarketplaceNav({ 
  activeBrand, 
  activeCategory = "all",
  onBrandSelect,
  onCategorySelect 
}: MobileMarketplaceNavProps) {
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Categories - Horizontal Scroll - Optimized for mobile */}
      <div className="p-3 pb-2">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                className={`flex-shrink-0 h-8 px-3 text-xs ${
                  activeCategory === category.id 
                    ? "bg-softspot-500 hover:bg-softspot-600 text-white" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                onClick={() => onCategorySelect?.(category.id)}
              >
                {category.name}
                <span className="ml-1 text-xs opacity-75">({category.count})</span>
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
      </div>

      {/* Brands - Collapsible - Mobile optimized */}
      <Collapsible open={isBrandsOpen} onOpenChange={setIsBrandsOpen}>
        <div className="px-3 pb-2">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between h-9 text-left font-medium text-gray-900 dark:text-white"
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm">Brands</span>
                {activeBrand && (
                  <span className="px-2 py-1 bg-softspot-100 dark:bg-softspot-900 text-softspot-700 dark:text-softspot-300 rounded-full text-xs">
                    {brands.find(b => b.id === activeBrand)?.name}
                  </span>
                )}
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isBrandsOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="px-3 pb-3">
          <div className="grid grid-cols-2 gap-2">
            {brands.map((brand) => (
              <Button
                key={brand.id}
                variant={activeBrand === brand.id ? "default" : "outline"}
                size="sm"
                className={`justify-between text-left h-8 text-xs ${
                  activeBrand === brand.id 
                    ? "bg-softspot-500 hover:bg-softspot-600 text-white" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                onClick={() => onBrandSelect?.(brand.id)}
              >
                <span className="truncate">{brand.name}</span>
                <span className="text-xs opacity-75 ml-1">({brand.count})</span>
              </Button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
