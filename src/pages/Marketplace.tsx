
import MainLayout from "@/components/layout/MainLayout";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { FilterPanel } from "@/components/marketplace/FilterPanel";
import { MobileFilterDrawer } from "@/components/marketplace/MobileFilterDrawer";
import { MarketplaceControls } from "@/components/marketplace/MarketplaceControls";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMarketplaceFilters } from "@/hooks/useMarketplaceFilters";
import { useMarketplaceView } from "@/hooks/useMarketplaceView";
import { MarketplacePlushie } from "@/types/marketplace";
import { MarketplaceHero } from "@/components/marketplace/MarketplaceHero";
import { MarketplaceNavigation } from "@/components/marketplace/MarketplaceNavigation";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Marketplace = () => {
  const isMobile = useIsMobile();
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplacePlushie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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

  // Fetch marketplace items from Supabase
  useEffect(() => {
    const fetchMarketplaceItems = async () => {
      try {
        setIsLoading(true);
        
        // Fetch from marketplace_listings table
        const { data: listings, error } = await supabase
          .from('marketplace_listings')
          .select(`
            *,
            users!inner(username, first_name, avatar_url)
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching marketplace items:", error);
          setMarketplaceItems([]);
          return;
        }

        if (listings && listings.length > 0) {
          const formattedItems: MarketplacePlushie[] = listings.map(listing => ({
            id: listing.id,
            title: listing.title || 'Untitled Item',
            name: listing.title || 'Untitled Item',
            price: listing.price || 0,
            image: listing.image_urls?.[0] || '',
            brand: listing.brand || 'Unknown',
            condition: listing.condition || 'used',
            description: listing.description || '',
            tags: listing.brand ? [listing.brand.toLowerCase()] : [],
            likes: 0,
            comments: 0,
            forSale: true,
            userId: listing.user_id,
            username: listing.users?.username || listing.users?.first_name || 'User',
            timestamp: listing.created_at,
            location: 'Online',
            material: 'N/A',
            filling: 'N/A', 
            species: 'N/A',
            deliveryMethod: 'N/A',
            deliveryCost: 0,
            size: 'N/A',
            color: 'N/A'
          }));
          
          setMarketplaceItems(formattedItems);
        } else {
          setMarketplaceItems([]);
        }
      } catch (error) {
        console.error("Error fetching marketplace items:", error);
        setMarketplaceItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketplaceItems();
  }, []);

  const handleProductClick = (product: MarketplacePlushie) => {
    console.log("Product clicked:", product);
  };

  const handleWishlistToggle = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log("Wishlist toggled for:", id);
  };

  const filteredPlushies = applyFilters(marketplaceItems, searchQuery);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-softspot-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading marketplace...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header with search and CTA */}
        <MarketplaceHeader 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
        
        {/* Hero Section */}
        <MarketplaceHero />
        
        {/* Navigation */}
        <MarketplaceNavigation onFilterToggle={toggleFilterDrawer} />
        
        {/* Mobile Wishlist Link */}
        {isMobile && (
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <Link to="/wishlist">
              <Button variant="outline" className="w-full">
                <Heart className="h-4 w-4 mr-2" />
                View My Wishlist
              </Button>
            </Link>
          </div>
        )}
        
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Controls */}
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
              {filteredPlushies.length > 0 ? (
                <ProductGrid
                  plushies={filteredPlushies}
                  viewMode={viewMode}
                  onProductClick={handleProductClick}
                  onWishlistToggle={handleWishlistToggle}
                />
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No items found</h3>
                  <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or check back later for new listings.</p>
                </div>
              )}
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
