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
  filters: MarketplaceFilters;
  onFilterChange: (filters: MarketplaceFilters) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  freeShippingOnly: boolean;
  setFreeShippingOnly: (value: boolean) => void;
  verifiedSellersOnly: boolean;
  setVerifiedSellersOnly: (value: boolean) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export function MobileFilterDrawer({
  filters,
  onFilterChange,
  priceRange,
  setPriceRange,
  freeShippingOnly,
  setFreeShippingOnly,
  verifiedSellersOnly,
  setVerifiedSellersOnly,
  onApplyFilters,
  onResetFilters
}: MobileFilterDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </SheetTrigger>
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
            freeShippingOnly={freeShippingOnly}
            setFreeShippingOnly={setFreeShippingOnly}
            verifiedSellersOnly={verifiedSellersOnly}
            setVerifiedSellersOnly={setVerifiedSellersOnly}
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
