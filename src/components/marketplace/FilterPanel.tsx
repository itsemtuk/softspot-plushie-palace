
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Package, 
  Palette, 
  Shirt, 
  PawPrint,
  Box,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { MarketplaceFilters } from "@/types/marketplace";

const colors = [
  { label: "Red", value: "red" },
  { label: "Blue", value: "blue" },
  { label: "Pink", value: "pink" },
  { label: "Purple", value: "purple" },
  { label: "Brown", value: "brown" },
  { label: "White", value: "white" },
  { label: "Black", value: "black" },
];

const materials = [
  { label: "Cotton", value: "cotton" },
  { label: "Polyester", value: "polyester" },
  { label: "Minky", value: "minky" },
  { label: "Plush", value: "plush" },
  { label: "Fur", value: "fur" },
  { label: "Velvet", value: "velvet" },
];

const fillings = [
  { label: "Polyester Fill", value: "polyester-fill" },
  { label: "Cotton", value: "cotton" },
  { label: "Beans", value: "beans" },
  { label: "Foam", value: "foam" },
];

const species = [
  { label: "Bears", value: "bear" },
  { label: "Cats", value: "cat" },
  { label: "Dogs", value: "dog" },
  { label: "Rabbits", value: "rabbit" },
  { label: "Dragons", value: "dragon" },
  { label: "Unicorns", value: "unicorn" },
  { label: "Other", value: "other" },
];

const brands = [
  { label: "Build-A-Bear", value: "build-a-bear" },
  { label: "Squishmallows", value: "squishmallows" },
  { label: "Jellycat", value: "jellycat" },
  { label: "Gund", value: "gund" },
  { label: "Ty", value: "ty" },
  { label: "Other", value: "other" },
];

interface FilterPanelProps {
  filters: MarketplaceFilters;
  onFilterChange: (filters: MarketplaceFilters) => void;
  className?: string;
}

export function FilterPanel({ filters, onFilterChange, className = "" }: FilterPanelProps) {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const updateFilter = (category: keyof MarketplaceFilters, value: string) => {
    const currentValues = filters[category] as string[] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange({
      ...filters,
      [category]: newValues,
    });
  };

  const FilterSection = ({ 
    title, 
    icon: Icon, 
    items, 
    category 
  }: { 
    title: string;
    icon: React.ComponentType<any>;
    items: { label: string; value: string }[];
    category: keyof MarketplaceFilters;
  }) => {
    const isOpen = openSections.includes(title);
    
    return (
      <Collapsible open={isOpen} onOpenChange={() => toggleSection(title)}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between p-2 hover:bg-gray-100"
          >
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span>{title}</span>
            </div>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-2 space-y-2">
          {items.map(item => (
            <div key={item.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`${String(category)}-${item.value}`}
                checked={(filters[category] as string[] || []).includes(item.value)}
                onCheckedChange={() => updateFilter(category, item.value)}
              />
              <Label htmlFor={`${String(category)}-${item.value}`}>{item.label}</Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className={`space-y-2 p-4 bg-white rounded-lg shadow-sm ${className}`}>
      <FilterSection 
        title="Colors" 
        icon={Palette} 
        items={colors} 
        category="color"
      />
      <FilterSection 
        title="Materials" 
        icon={Shirt} 
        items={materials} 
        category="material"
      />
      <FilterSection 
        title="Fillings" 
        icon={Box} 
        items={fillings} 
        category="filling"
      />
      <FilterSection 
        title="Species" 
        icon={PawPrint} 
        items={species} 
        category="species"
      />
      <FilterSection 
        title="Brands" 
        icon={Package} 
        items={brands} 
        category="brands"
      />
    </div>
  );
}
