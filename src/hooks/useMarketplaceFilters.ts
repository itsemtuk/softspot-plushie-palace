
import { useState } from "react";
import { MarketplaceFilters, MarketplacePlushie } from "@/types/marketplace";

export function useMarketplaceFilters() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [filters, setFilters] = useState<MarketplaceFilters>({
    brands: [],
    conditions: [],
    materials: [],
    fillings: [],
    species: [],
    sizes: [],
    deliveryMethods: [],
    brand: [],
    condition: [],
    material: [],
    filling: [],
    color: [],
    size: [],
    deliveryMethod: []
  });
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [verifiedSellersOnly, setVerifiedSellersOnly] = useState(false);

  const handlePriceRangeChange = (range: number[]) => {
    setPriceRange([range[0] || 0, range[1] || 200]);
  };

  const handleBrandChange = (brands: string[]) => {
    setSelectedBrands(brands);
  };

  const handleConditionChange = (conditions: string[]) => {
    setSelectedConditions(conditions);
  };

  const handleFilterChange = (newFilters: MarketplaceFilters) => {
    setFilters(newFilters);
  };

  const applyFilters = (plushies: MarketplacePlushie[], searchQuery: string) => {
    return plushies.filter(plushie => {
      // Search filter
      if (searchQuery && !plushie.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Price filter
      if (plushie.price < priceRange[0] || plushie.price > priceRange[1]) {
        return false;
      }
      
      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(plushie.brand || '')) {
        return false;
      }
      
      // Condition filter
      if (selectedConditions.length > 0 && !selectedConditions.includes(plushie.condition || '')) {
        return false;
      }
      
      return true;
    });
  };

  return {
    priceRange,
    setPriceRange,
    selectedBrands,
    selectedConditions,
    filters,
    freeShippingOnly,
    setFreeShippingOnly,
    verifiedSellersOnly,
    setVerifiedSellersOnly,
    handlePriceRangeChange,
    handleBrandChange,
    handleConditionChange,
    handleFilterChange,
    applyFilters
  };
}
