
import MainLayout from "@/components/layout/MainLayout";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { FilterPanel } from "@/components/marketplace/FilterPanel";
import { MobileFilterDrawer } from "@/components/marketplace/MobileFilterDrawer";
import { QuickSellBanner } from "@/components/marketplace/QuickSellBanner";
import { TrendingCarousel } from "@/components/marketplace/TrendingCarousel";
import { MarketplaceControls } from "@/components/marketplace/MarketplaceControls";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMarketplaceFilters } from "@/hooks/useMarketplaceFilters";
import { useMarketplaceView } from "@/hooks/useMarketplaceView";
import { MarketplacePlushie } from "@/types/marketplace";
import { samplePlushies } from "@/data/sampleMarketplaceData";

const Marketplace = () => {
  const isMobile = useIsMobile();
  
  const {
    priceRange,
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
  } = useMarketplaceFilters();

  const {
    viewMode,
    sortBy,
    searchQuery,
    isFilterOpen,
    handleSearchChange,
    handleSortChange,
    handleViewModeChange,
    toggleFilterDrawer,
    closeFilterDrawer
  } = useMarketplaceView();

  const handleProductClick = (product: MarketplacePlushie) => {
    console.log("Product clicked:", product);
  };

  const handleWishlistToggle = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log("Wishlist toggled for:", id);
  };

  const filteredPlushies = applyFilters(samplePlushies, searchQuery);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <MarketplaceHeader 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
        <QuickSellBanner />
        <TrendingCarousel />
        
        <div className="max-w-7xl mx-auto px-4 py-6">
          <MarketplaceControls
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onFilterToggle={() => toggleFilterDrawer()}
            isMobile={isMobile}
          />

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
              <ProductGrid
                plushies={filteredPlushies}
                viewMode={viewMode}
                onProductClick={handleProductClick}
                onWishlistToggle={handleWishlistToggle}
              />
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        <MobileFilterDrawer
          isOpen={isFilterOpen}
          onClose={closeFilterDrawer}
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
