import { useState, useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { FilterPanel } from "@/components/marketplace/FilterPanel";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { SortOptions } from "@/components/marketplace/SortOptions";
import { MobileFilterDrawer } from "@/components/marketplace/MobileFilterDrawer";
import { VisualFilters } from "@/components/marketplace/VisualFilters";
import { InstantSearchBox } from "@/components/marketplace/InstantSearchBox";
import { QuickActionsFAB } from "@/components/navigation/mobile/QuickActionsFAB";
import { marketplacePlushies } from "@/data/plushies";
import { useIsMobile } from "@/hooks/use-mobile";
import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const isMobile = useIsMobile();

  const filteredPlushies = useMemo(() => {
    return marketplacePlushies.filter((plushie) => {
      const matchesSearch = plushie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           plushie.username.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.some(brand => 
        plushie.title.toLowerCase().includes(brand));
      const matchesPrice = plushie.price >= priceRange[0] && plushie.price <= priceRange[1];
      
      return matchesSearch && matchesBrand && matchesPrice;
    });
  }, [searchQuery, selectedBrands, selectedColors, selectedConditions, priceRange]);

  const sortedPlushies = useMemo(() => {
    const sorted = [...filteredPlushies];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "popular":
        return sorted.sort((a, b) => b.likes - a.likes);
      default:
        return sorted;
    }
  }, [filteredPlushies, sortBy]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handleConditionToggle = (condition: string) => {
    setSelectedConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedConditions([]);
    setPriceRange([0, 200]);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <MarketplaceHeader />
        
        {/* Enhanced Search Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <InstantSearchBox 
              placeholder="Search plushies, users, brands..."
              onSearchSelect={(result) => setSearchQuery(result.title)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <SortOptions sortBy={sortBy} onSortChange={setSortBy} />
            
            {!isMobile && (
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Filters */}
          {!isMobile && (
            <div className="lg:col-span-1 space-y-4">
              <VisualFilters
                selectedBrands={selectedBrands}
                selectedColors={selectedColors}
                selectedConditions={selectedConditions}
                onBrandToggle={handleBrandToggle}
                onColorToggle={handleColorToggle}
                onConditionToggle={handleConditionToggle}
                onClearAll={clearAllFilters}
              />
              <FilterPanel
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                onFiltersChange={() => {}}
              />
            </div>
          )}

          {/* Products Grid */}
          <div className={`${isMobile ? "col-span-1" : "lg:col-span-3"}`}>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {sortedPlushies.length} plushies found
              </p>
              
              {isMobile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobileFilters(true)}
                >
                  Filters ({selectedBrands.length + selectedColors.length + selectedConditions.length})
                </Button>
              )}
            </div>

            <div className={`grid gap-4 ${
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {sortedPlushies.map((plushie) => (
                <ProductCard
                  key={plushie.id}
                  plushie={plushie}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {sortedPlushies.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No plushies found matching your criteria
                </p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        <MobileFilterDrawer
          isOpen={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          onFiltersChange={() => {}}
        />

        {/* Quick Actions FAB for mobile */}
        {isMobile && <QuickActionsFAB />}
      </div>
    </MainLayout>
  );
};

export default Marketplace;
