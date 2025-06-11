
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { FilterPanel } from "./FilterPanel";
import { Filter } from "lucide-react";
import { MarketplaceFilters } from "@/types/marketplace";

interface MobileFilterDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  filters?: MarketplaceFilters;
  onFilterChange?: (filters: MarketplaceFilters) => void;
  priceRange?: [number, number];
  setPriceRange?: (range: [number, number]) => void;
  onPriceRangeChange?: (range: number[]) => void;
  freeShippingOnly?: boolean;
  setFreeShippingOnly?: (value: boolean) => void;
  verifiedSellersOnly?: boolean;
  setVerifiedSellersOnly?: (value: boolean) => void;
  selectedBrands?: string[];
  onBrandChange?: (brands: string[]) => void;
  selectedConditions?: string[];
  onConditionChange?: (conditions: string[]) => void;
  onApplyFilters?: () => void;
  onResetFilters?: () => void;
}

export function MobileFilterDrawer({
  isOpen = false,
  onClose,
  filters,
  onFilterChange,
  priceRange = [0, 100],
  setPriceRange,
  onPriceRangeChange,
  freeShippingOnly = false,
  setFreeShippingOnly,
  verifiedSellersOnly = false,
  setVerifiedSellersOnly,
  selectedBrands = [],
  onBrandChange,
  selectedConditions = [],
  onConditionChange,
  onApplyFilters,
  onResetFilters
}: MobileFilterDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-full sm:max-w-md overflow-auto">
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
        </SheetHeader>
        
        <div className="py-4">
          <FilterPanel
            filters={filters}
            onFilterChange={onFilterChange}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            onPriceRangeChange={onPriceRangeChange}
            freeShippingOnly={freeShippingOnly}
            setFreeShippingOnly={setFreeShippingOnly}
            verifiedSellersOnly={verifiedSellersOnly}
            setVerifiedSellersOnly={setVerifiedSellersOnly}
            selectedBrands={selectedBrands}
            onBrandChange={onBrandChange}
            selectedConditions={selectedConditions}
            onConditionChange={onConditionChange}
          />
        </div>
        
        <SheetFooter className="flex flex-row gap-4 sm:gap-6">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={onResetFilters}
          >
            Reset
          </Button>
          <Button 
            variant="default"
            className="flex-1 bg-softspot-500 hover:bg-softspot-600"
            onClick={onApplyFilters}
          >
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
