
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { MarketplaceFilters } from "@/types/marketplace";
import { ChevronRight } from "lucide-react";

interface FilterPanelProps {
  filters: MarketplaceFilters;
  onFilterChange: (filters: MarketplaceFilters) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  freeShippingOnly: boolean;
  setFreeShippingOnly: (value: boolean) => void;
  verifiedSellersOnly: boolean;
  setVerifiedSellersOnly: (value: boolean) => void;
}

const colorOptions = [
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "yellow", label: "Yellow" },
  { value: "purple", label: "Purple" },
  { value: "pink", label: "Pink" },
  { value: "brown", label: "Brown" },
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "multi", label: "Multicolor" },
];

const materialOptions = [
  { value: "plush", label: "Plush" },
  { value: "cotton", label: "Cotton" },
  { value: "polyester", label: "Polyester" },
  { value: "minky", label: "Minky" },
  { value: "fleece", label: "Fleece" },
  { value: "fur", label: "Fur" },
  { value: "wool", label: "Wool" },
];

const fillingOptions = [
  { value: "cotton", label: "Cotton" },
  { value: "polyester", label: "Polyester Fiberfill" },
  { value: "memory foam", label: "Memory Foam" },
  { value: "beans", label: "Beans" },
  { value: "pellets", label: "Pellets" },
];

const speciesOptions = [
  { value: "bear", label: "Bear" },
  { value: "cat", label: "Cat" },
  { value: "dog", label: "Dog" },
  { value: "rabbit", label: "Rabbit" },
  { value: "dinosaur", label: "Dinosaur" },
  { value: "bird", label: "Bird" },
  { value: "mythical", label: "Mythical Creature" },
  { value: "other", label: "Other" },
];

const brandOptions = [
  { value: "jellycat", label: "Jellycat" },
  { value: "sanrio", label: "Sanrio" },
  { value: "squishmallows", label: "Squishmallows" },
  { value: "build-a-bear", label: "Build-A-Bear" },
  { value: "ty", label: "TY" },
  { value: "gund", label: "GUND" },
  { value: "steiff", label: "Steiff" },
];

const conditionOptions = [
  { value: "new", label: "New with Tags" },
  { value: "like new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "vintage", label: "Vintage" },
];

export function FilterPanel({
  filters,
  onFilterChange,
  priceRange,
  setPriceRange,
  freeShippingOnly,
  setFreeShippingOnly,
  verifiedSellersOnly,
  setVerifiedSellersOnly,
}: FilterPanelProps) {
  const handleFilterChange = (category: keyof MarketplaceFilters, value: string, isChecked: boolean) => {
    const currentValues = filters[category] || [];
    
    let newValues;
    if (isChecked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }
    
    onFilterChange({
      ...filters,
      [category]: newValues
    });
  };
  
  const handleResetFilters = () => {
    onFilterChange({});
    setPriceRange([0, 100]);
    setFreeShippingOnly(false);
    setVerifiedSellersOnly(false);
  };
  
  const isFilterSelected = (category: keyof MarketplaceFilters, value: string) => {
    return (filters[category] || []).includes(value);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Button 
          onClick={handleResetFilters} 
          variant="link" 
          className="text-gray-500 hover:text-softspot-500 p-0 h-auto text-sm"
        >
          Reset All
        </Button>
      </div>
      
      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Price Range</h4>
        <div className="mb-4 px-1">
          <Slider
            defaultValue={[priceRange[0], priceRange[1]]}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            min={0}
            max={100}
            step={1}
            className="mb-2"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">${priceRange[0]}</span>
            <span className="text-sm font-medium">${priceRange[1]}</span>
          </div>
        </div>
      </div>
      
      <Separator className="mb-4" />
      
      {/* Shipping Options */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Shipping Options</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="free-shipping"
              checked={freeShippingOnly}
              onCheckedChange={setFreeShippingOnly}
            />
            <Label htmlFor="free-shipping" className="text-sm font-normal cursor-pointer">Free Shipping Only</Label>
          </div>
        </div>
      </div>
      
      <Separator className="mb-4" />
      
      {/* Seller Options */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Seller Options</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="verified-sellers"
              checked={verifiedSellersOnly}
              onCheckedChange={setVerifiedSellersOnly}
            />
            <Label htmlFor="verified-sellers" className="text-sm font-normal cursor-pointer">Verified Sellers Only</Label>
          </div>
        </div>
      </div>
      
      <Separator className="mb-4" />
      
      {/* Color Filter */}
      <Accordion type="multiple" defaultValue={["colors"]} className="w-full">
        <AccordionItem value="colors" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline">
            <h4 className="font-medium">Colors</h4>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-2">
            <div className="space-y-2">
              {colorOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`color-${option.value}`}
                    checked={isFilterSelected("color", option.value)}
                    onCheckedChange={(checked) => 
                      handleFilterChange("color", option.value, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`color-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Separator className="my-2" />
      
      {/* Material Filter */}
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="materials" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline">
            <h4 className="font-medium">Materials</h4>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-2">
            <div className="space-y-2">
              {materialOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`material-${option.value}`}
                    checked={isFilterSelected("material", option.value)}
                    onCheckedChange={(checked) => 
                      handleFilterChange("material", option.value, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`material-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Separator className="my-2" />
      
      {/* Filling Filter */}
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="filling" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline">
            <h4 className="font-medium">Filling</h4>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-2">
            <div className="space-y-2">
              {fillingOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`filling-${option.value}`}
                    checked={isFilterSelected("filling", option.value)}
                    onCheckedChange={(checked) => 
                      handleFilterChange("filling", option.value, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`filling-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Separator className="my-2" />
      
      {/* Species Filter */}
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="species" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline">
            <h4 className="font-medium">Species</h4>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-2">
            <div className="space-y-2">
              {speciesOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`species-${option.value}`}
                    checked={isFilterSelected("species", option.value)}
                    onCheckedChange={(checked) => 
                      handleFilterChange("species", option.value, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`species-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Separator className="my-2" />
      
      {/* Brands Filter */}
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="brands" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline">
            <h4 className="font-medium">Brands</h4>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-2">
            <div className="space-y-2">
              {brandOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`brand-${option.value}`}
                    checked={isFilterSelected("brands", option.value)}
                    onCheckedChange={(checked) => 
                      handleFilterChange("brands", option.value, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`brand-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Separator className="my-2" />
      
      {/* Condition Filter */}
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="condition" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline">
            <h4 className="font-medium">Condition</h4>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-2">
            <div className="space-y-2">
              {conditionOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`condition-${option.value}`}
                    checked={isFilterSelected("condition", option.value)}
                    onCheckedChange={(checked) => 
                      handleFilterChange("condition", option.value, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`condition-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Separator className="my-4" />
      
      <Button 
        className="w-full bg-softspot-500 hover:bg-softspot-600"
        size="lg"
      >
        Apply Filters
      </Button>
    </div>
  );
}
