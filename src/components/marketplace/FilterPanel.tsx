
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider"; 
import { 
  Package, 
  Palette, 
  Shirt, 
  PawPrint,
  Box,
  ChevronDown,
  ChevronRight,
  Truck,
  CheckCircle,
  Zap
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

const conditions = [
  { label: "New with tags", value: "new-with-tags" },
  { label: "New", value: "new" },
  { label: "Like New", value: "like-new" },
  { label: "Good", value: "good" },
  { label: "Fair", value: "fair" },
  { label: "Poor", value: "poor" },
];

interface FilterPanelProps {
  filters: MarketplaceFilters;
  onFilterChange: (filters: MarketplaceFilters) => void;
  className?: string;
  priceRange?: [number, number];
  setPriceRange?: (range: [number, number]) => void;
  freeShippingOnly?: boolean;
  setFreeShippingOnly?: (value: boolean) => void;
  verifiedSellersOnly?: boolean;
  setVerifiedSellersOnly?: (value: boolean) => void;
}

export function FilterPanel({ 
  filters, 
  onFilterChange, 
  className = "",
  priceRange = [0, 100],
  setPriceRange,
  freeShippingOnly = false,
  setFreeShippingOnly,
  verifiedSellersOnly = false,
  setVerifiedSellersOnly
}: FilterPanelProps) {
  const [openSections, setOpenSections] = useState<string[]>(["price", "condition"]);

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
    const isOpen = openSections.includes(title.toLowerCase());
    
    return (
      <Collapsible 
        open={isOpen} 
        onOpenChange={() => toggleSection(title.toLowerCase())}
        className="border-b border-gray-100 py-3"
      >
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between p-0 hover:bg-transparent"
          >
            <div className="flex items-center gap-2 text-gray-700">
              <Icon className="h-4 w-4 text-softspot-400" />
              <span>{title}</span>
            </div>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-1 space-y-2">
          {items.map(item => (
            <div key={item.value} className="flex items-center space-x-2 py-1">
              <Checkbox 
                id={`${String(category)}-${item.value}`}
                checked={(filters[category] as string[] || []).includes(item.value)}
                onCheckedChange={() => updateFilter(category, item.value)}
              />
              <Label 
                htmlFor={`${String(category)}-${item.value}`}
                className="text-sm text-gray-700 cursor-pointer"
              >
                {item.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <div className="mb-4">
        <Label htmlFor="search" className="text-sm font-medium mb-1.5 block">Search within results</Label>
        <div className="relative">
          <Input 
            id="search"
            placeholder="Search plushies..."
            className="pl-9"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-400"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
          </div>
        </div>
      </div>

      {/* Price Range Section */}
      <Collapsible 
        open={openSections.includes("price")} 
        onOpenChange={() => toggleSection("price")}
        className="border-b border-gray-100 py-3"
      >
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between p-0 hover:bg-transparent"
          >
            <div className="flex items-center gap-2 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-softspot-400"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v12"></path><path d="M8 12h8"></path></svg>
              <span>Price Range</span>
            </div>
            {openSections.includes("price") ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 pb-2">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-700">${priceRange[0]}</span>
              <span className="text-sm text-gray-700">${priceRange[1]}</span>
            </div>
            {setPriceRange && (
              <Slider
                defaultValue={priceRange}
                max={200}
                step={5}
                onValueChange={(values) => setPriceRange(values as [number, number])}
                className="mt-1"
              />
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <FilterSection 
        title="Condition" 
        icon={() => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-softspot-400"><path d="M8.8 19A9 9 0 1 0 4 12.8L2 22Z"></path></svg>} 
        items={conditions} 
        category="condition"
      />
      
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

      <div className="mt-4 space-y-4">
        {setFreeShippingOnly && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-softspot-400" />
              <Label htmlFor="free-shipping" className="text-sm text-gray-700">Free Shipping</Label>
            </div>
            <Switch 
              id="free-shipping" 
              checked={freeShippingOnly} 
              onCheckedChange={setFreeShippingOnly}
            />
          </div>
        )}

        {setVerifiedSellersOnly && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-softspot-400" />
              <Label htmlFor="verified-sellers" className="text-sm text-gray-700">Verified Sellers</Label>
            </div>
            <Switch 
              id="verified-sellers" 
              checked={verifiedSellersOnly}
              onCheckedChange={setVerifiedSellersOnly}
            />
          </div>
        )}
      </div>

      <Button className="w-full mt-6 bg-softspot-500 hover:bg-softspot-600">
        Apply Filters
      </Button>
    </div>
  );
}
