import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { FilterPanel } from "@/components/marketplace/FilterPanel";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { SortOptions } from "@/components/marketplace/SortOptions";
import { MobileFilterDrawer } from "@/components/marketplace/MobileFilterDrawer";
import { QuickSellBanner } from "@/components/marketplace/QuickSellBanner";
import { TrendingCarousel } from "@/components/marketplace/TrendingCarousel";
import { InstantSearchBox } from "@/components/marketplace/InstantSearchBox";
import { Button } from "@/components/ui/button";
import { Grid3X3, List, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample data - replace with actual data fetching
const samplePlushies = [
  {
    id: "1",
    image: "/placeholder.svg",
    title: "Jellycat Bashful Bunny",
    username: "plushielover23",
    likes: 24,
    comments: 8,
    price: 35,
    forSale: true,
    condition: "Like New",
    description: "Adorable cream bunny in perfect condition",
    color: "Cream",
    material: "Polyester",
    filling: "Polyester fiberfill",
    species: "Bunny",
    brand: "Jellycat"
  },
  // Add more sample data as needed
];

const Marketplace = () => {
  const [viewMode, setViewMode<"grid" | "list">] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  // Filtering logic
  const handlePriceRangeChange = (range: number[]) => {
    setPriceRange([range[0] || 0, range[1] || 200]);
  };

  const handleBrandChange = (brands: string[]) => {
    setSelectedBrands(brands);
  };

  const handleConditionChange = (conditions: string[]) => {
    setSelectedConditions(conditions);
  };

  const toggleFilterDrawer = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const closeFilterDrawer = () => {
    setIsFilterOpen(false);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  const filteredPlushies = samplePlushies.filter(plushie => {
    // Search filter
    if (searchQuery && !plushie.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Price filter
    if (plushie.price < priceRange[0] || plushie.price > priceRange[1]) {
      return false;
    }
    
    // Brand filter
    if (selectedBrands.length > 0 && !selectedBrands.includes(plushie.brand)) {
      return false;
    }
    
    // Condition filter
    if (selectedConditions.length > 0 && !selectedConditions.includes(plushie.condition)) {
      return false;
    }
    
    return true;
  });

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <MarketplaceHeader />
        <QuickSellBanner />
        <TrendingCarousel />
        
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Search and Controls */}
          <div className="mb-6 space-y-4">
            <InstantSearchBox 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search for plushies..."
            />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                {isMobile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </Button>
                )}
                
                <SortOptions 
                  value={sortBy}
                  onValueChange={setSortBy}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Desktop Filters */}
            {!isMobile && (
              <div className="w-80 flex-shrink-0">
                <FilterPanel
                  priceRange={priceRange}
                  onPriceRangeChange={handlePriceRangeChange}
                  selectedBrands={selectedBrands}
                  onBrandChange={handleBrandChange}
                  selectedConditions={selectedConditions}
                  onConditionChange={handleConditionChange}
                />
              </div>
            )}

            {/* Products Grid/List */}
            <div className="flex-1">
              <div className={cn(
                "grid gap-4",
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1"
              )}>
                {filteredPlushies.map((item) => (
                  <ProductCard
                    key={item.id}
                    id={item.id}
                    image={item.image}
                    title={item.title}
                    username={item.username}
                    likes={item.likes}
                    comments={item.comments}
                    price={item.price}
                    forSale={item.forSale}
                    condition={item.condition}
                    description={item.description}
                    color={item.color}
                    material={item.material}
                    filling={item.filling}
                    species={item.species}
                    brand={item.brand}
                    viewMode={viewMode}
                  />
                ))}
              </div>
              
              {filteredPlushies.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No plushies found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        <MobileFilterDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          priceRange={priceRange}
          onPriceRangeChange={handlePriceRangeChange}
          selectedBrands={selectedBrands}
          onBrandChange={handleBrandChange}
          selectedConditions={selectedConditions}
          onConditionChange={handleConditionChange}
        />
      </div>
    </MainLayout>
  );
};

export default Marketplace;
