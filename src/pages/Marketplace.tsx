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
import { MarketplaceFilters, MarketplacePlushie } from "@/types/marketplace";

// Sample data - replace with actual data fetching
const samplePlushies: MarketplacePlushie[] = [
  {
    id: "1",
    imageUrl: "/placeholder.svg",
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
    brand: "Jellycat",
    location: "New York",
    deliveryCost: 0,
    discount: 0
  },
  // Add more sample data as needed
];

const Marketplace = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleFilterChange = (newFilters: MarketplaceFilters) => {
    setFilters(newFilters);
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

  const handleProductClick = (product: MarketplacePlushie) => {
    console.log("Product clicked:", product);
  };

  const handleWishlistToggle = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log("Wishlist toggled for:", id);
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
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  priceRange={priceRange}
                  onPriceRangeChange={handlePriceRangeChange}
                  selectedBrands={selectedBrands}
                  onBrandChange={handleBrandChange}
                  selectedConditions={selectedConditions}
                  onConditionChange={handleConditionChange}
                  freeShippingOnly={freeShippingOnly}
                  setFreeShippingOnly={setFreeShippingOnly}
                  verifiedSellersOnly={verifiedSellersOnly}
                  setVerifiedSellersOnly={setVerifiedSellersOnly}
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
                    product={item}
                    onProductClick={handleProductClick}
                    onWishlistToggle={handleWishlistToggle}
                    isWishlisted={false}
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
          filters={filters}
          onFilterChange={handleFilterChange}
          priceRange={priceRange}
          onPriceRangeChange={handlePriceRangeChange}
          selectedBrands={selectedBrands}
          onBrandChange={handleBrandChange}
          selectedConditions={selectedConditions}
          onConditionChange={handleConditionChange}
          freeShippingOnly={freeShippingOnly}
          setFreeShippingOnly={setFreeShippingOnly}
          verifiedSellersOnly={verifiedSellersOnly}
          setVerifiedSellersOnly={setVerifiedSellersOnly}
        />
      </div>
    </MainLayout>
  );
};

export default Marketplace;
