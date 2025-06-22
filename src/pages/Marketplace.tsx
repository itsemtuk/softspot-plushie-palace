
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
import { MarketplaceHero } from "@/components/marketplace/MarketplaceHero";
import { MarketplaceNavigation } from "@/components/marketplace/MarketplaceNavigation";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
        
        // Fetch posts that are marked for sale
        const { data: posts, error } = await supabase
          .from('posts')
          .select(`
            *,
            users!inner(username, first_name, avatar_url)
          `)
          .eq('for_sale', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching marketplace items:", error);
          // Fall back to sample data
          setMarketplaceItems(samplePlushies);
          return;
        }

        if (posts && posts.length > 0) {
          const formattedItems: MarketplacePlushie[] = posts.map(post => ({
            id: post.id,
            title: post.title || 'Untitled Item',
            name: post.title || 'Untitled Item',
            price: post.price || 0,
            image: post.image || '/placeholder-plushie.jpg',
            brand: post.brand || 'Unknown',
            condition: post.condition || 'used',
            description: post.description || '',
            tags: post.brand ? [post.brand.toLowerCase()] : [],
            likes: 0,
            comments: 0,
            forSale: true,
            userId: post.user_id,
            username: post.users?.username || post.users?.first_name || 'User',
            timestamp: post.created_at,
            location: 'Online',
            material: post.material,
            filling: post.filling,
            species: post.species,
            deliveryMethod: post.delivery_method,
            deliveryCost: post.delivery_cost,
            size: post.size,
            color: post.color
          }));
          
          setMarketplaceItems(formattedItems);
        } else {
          // Show sample data if no real items
          setMarketplaceItems(samplePlushies);
        }
      } catch (error) {
        console.error("Error fetching marketplace items:", error);
        setMarketplaceItems(samplePlushies);
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
        <MarketplaceHeader 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
        
        <MarketplaceHero />
        <MarketplaceNavigation onFilterToggle={toggleFilterDrawer} />
        
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
