import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { FilterPanel } from "@/components/marketplace/FilterPanel";
import { MarketplaceNav } from "@/components/marketplace/MarketplaceNav";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { MobileFilterDrawer } from "@/components/marketplace/MobileFilterDrawer";
import { SortOptions } from "@/components/marketplace/SortOptions";
import { FilterChips } from "@/components/marketplace/FilterChips";
import { QuickSellBanner } from "@/components/marketplace/QuickSellBanner";
import { MarketplacePlushie } from '@/types/marketplace';
import { PlushieDetailDialog } from "@/components/marketplace/PlushieDetailDialog";
import { getMarketplaceListings, saveMarketplaceListings } from "@/utils/storage/localStorageUtils";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { ChevronLeft, ChevronRight, Plus, Sliders, RefreshCw } from "lucide-react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [plushies, setPlushies] = useState<MarketplacePlushie[]>([]);
  const [filteredPlushies, setFilteredPlushies] = useState<MarketplacePlushie[]>([]);
  const [selectedPlushie, setSelectedPlushie] = useState<MarketplacePlushie | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [freeShippingOnly, setFreeShippingOnly] = useState<boolean>(false);
  const [verifiedSellersOnly, setVerifiedSellersOnly] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>("relevance");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeFilters, setActiveFilters] = useState<{ id: string; label: string; active: boolean }[]>([]);
  
  const navigate = useNavigate();
  const { user } = useUser();
  const isMobile = useIsMobile();
  const itemsPerPage = 10;
  const { toast } = useToast();

  const loadMarketplaceData = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Loading marketplace listings...");
      const storedPlushies = getMarketplaceListings();
      console.log(`Loaded ${storedPlushies?.length || 0} marketplace listings`);
      
      if (!storedPlushies || storedPlushies.length === 0) {
        // Create some default items if there are none
        const defaultItems = [
          {
            id: "plushie-1",
            userId: "default",
            image: "https://images.unsplash.com/photo-1516067154453-6194ba34d121",
            title: "Teddy Bear",
            username: "plushielover",
            likes: 42,
            comments: 5,
            price: 29.99,
            forSale: true,
            condition: "Like New",
            description: "A cuddly teddy bear looking for a new home.",
            color: "Brown",
            material: "Plush",
            brand: "TeddyCo",
            size: "Medium",
            filling: "Cotton",
            tags: ["teddy", "bear", "brown"],
            timestamp: new Date().toISOString(),
            species: "Bear",
            location: "New York",
            deliveryCost: 0
          },
          {
            id: "plushie-2",
            userId: "default",
            image: "https://images.unsplash.com/photo-1558006510-1e4d1bf38ada",
            title: "Pink Unicorn",
            username: "unicornlover",
            likes: 78,
            comments: 12,
            price: 34.99,
            forSale: true,
            condition: "New",
            description: "Magical unicorn plushie with rainbow-colored mane.",
            color: "Pink",
            material: "Plush",
            brand: "MagicToys",
            size: "Large",
            filling: "Polyester",
            tags: ["unicorn", "pink", "magical"],
            timestamp: new Date().toISOString(),
            species: "Mythical",
            location: "Los Angeles",
            deliveryCost: 5.99,
            discount: 15,
            originalPrice: 39.99
          },
          {
            id: "plushie-3",
            userId: "default",
            image: "https://images.unsplash.com/photo-1556012018-51c8c387300f",
            title: "Jellycat Bunny",
            username: "bunnylover",
            likes: 120,
            comments: 18,
            price: 24.99,
            forSale: true,
            condition: "New",
            description: "Super soft and cuddly Jellycat bunny.",
            color: "Beige",
            material: "Plush",
            brand: "Jellycat",
            size: "Small",
            filling: "Polyester",
            tags: ["bunny", "rabbit", "jellycat"],
            timestamp: new Date().toISOString(),
            species: "Rabbit",
            location: "Chicago",
            deliveryCost: 0,
            discount: 20,
            originalPrice: 29.99
          }
        ];
        console.log("Creating default items");
        saveMarketplaceListings(defaultItems);
        setPlushies(defaultItems);
        setFilteredPlushies(defaultItems);
      } else {
        // Make sure we add any missing fields required by the UI
        const plushiesWithRequiredFields = storedPlushies.map((plushie: MarketplacePlushie) => ({
          ...plushie,
          // Ensure price is a number
          price: typeof plushie.price === 'number' ? plushie.price : 0,
          // Ensure deliveryCost is a number
          deliveryCost: typeof plushie.deliveryCost === 'number' ? plushie.deliveryCost : 0,
          // Only add timestamp if it doesn't exist
          ...(plushie.timestamp ? {} : { timestamp: new Date().toISOString() }),
          // Add discount and originalPrice if they don't exist
          discount: plushie.discount || 0,
          originalPrice: plushie.originalPrice || null
        }));
        
        setPlushies(plushiesWithRequiredFields);
        setFilteredPlushies(plushiesWithRequiredFields);
      }
    } catch (error) {
      console.error("Error loading marketplace listings:", error);
      setError("Failed to load marketplace listings. Please try refreshing the page.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load marketplace listings."
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }

    // Load user's wishlist
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Error parsing wishlist:", error);
      }
    }
  };

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  // Filter and sort products when dependencies change
  useEffect(() => {
    if (plushies.length === 0) return;
    
    let result = [...plushies];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(plushie => 
        plushie.tags?.includes(selectedCategory) || 
        plushie.species === selectedCategory
      );
    }
    
    // Apply filters
    if (filters.color && filters.color.length > 0) {
      result = result.filter(plushie => 
        filters.color.includes(plushie.color?.toLowerCase())
      );
    }
    
    if (filters.material && filters.material.length > 0) {
      result = result.filter(plushie => 
        filters.material.includes(plushie.material?.toLowerCase())
      );
    }
    
    if (filters.filling && filters.filling.length > 0) {
      result = result.filter(plushie => 
        filters.filling.includes(plushie.filling?.toLowerCase())
      );
    }
    
    if (filters.species && filters.species.length > 0) {
      result = result.filter(plushie => 
        filters.species.includes(plushie.species?.toLowerCase())
      );
    }
    
    if (filters.brands && filters.brands.length > 0) {
      result = result.filter(plushie => 
        filters.brands.includes(plushie.brand?.toLowerCase())
      );
    }
    
    if (filters.condition && filters.condition.length > 0) {
      result = result.filter(plushie => 
        filters.condition.includes(plushie.condition?.toLowerCase())
      );
    }
    
    // Apply price range
    result = result.filter(plushie => 
      plushie.price >= priceRange[0] && plushie.price <= priceRange[1]
    );
    
    // Apply free shipping filter
    if (freeShippingOnly) {
      result = result.filter(plushie => 
        plushie.deliveryCost === 0
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => b.likes - a.likes);
        break;
      default:
        // relevance or other: no specific sorting
        break;
    }
    
    // Update active filters for filter chips
    const newActiveFilters = [];
    
    if (selectedCategory !== 'all') {
      newActiveFilters.push({
        id: `category-${selectedCategory}`,
        label: `Category: ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`,
        active: true
      });
    }
    
    if (freeShippingOnly) {
      newActiveFilters.push({
        id: 'free-shipping',
        label: 'Free Shipping',
        active: true
      });
    }
    
    if (priceRange[0] > 0 || priceRange[1] < 100) {
      newActiveFilters.push({
        id: 'price-range',
        label: `$${priceRange[0]} - $${priceRange[1]}`,
        active: true
      });
    }
    
    Object.entries(filters).forEach(([key, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        values.forEach(value => {
          newActiveFilters.push({
            id: `${key}-${value}`,
            label: `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`,
            active: true
          });
        });
      }
    });
    
    setActiveFilters(newActiveFilters);
    setFilteredPlushies(result);
    
  }, [
    plushies, 
    selectedCategory, 
    filters, 
    priceRange, 
    freeShippingOnly, 
    verifiedSellersOnly, 
    sortOption
  ]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadMarketplaceData();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePlushieClick = (plushie: MarketplacePlushie) => {
    setSelectedPlushie(plushie);
    setIsDetailsOpen(true);
  };

  const handleWishlistToggle = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your wishlist."
      });
      return;
    }
    
    const newWishlist = wishlist.includes(id)
      ? wishlist.filter(item => item !== id)
      : [...wishlist, id];
    
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    
    toast({
      title: wishlist.includes(id) ? "Removed from wishlist" : "Added to wishlist",
      description: wishlist.includes(id) 
        ? "This plushie has been removed from your wishlist." 
        : "This plushie has been added to your wishlist."
    });
  };

  const handleSellPlushie = () => {
    navigate('/marketplace/sell');
  };
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };
  
  const handleFilterChipClick = (id: string) => {
    // Remove the filter
    if (id.startsWith('category-')) {
      setSelectedCategory('all');
    } else if (id === 'free-shipping') {
      setFreeShippingOnly(false);
    } else if (id === 'price-range') {
      setPriceRange([0, 100]);
    } else {
      // Handle specific filters
      const [category, value] = id.split('-');
      const currentValues = filters[category] || [];
      const newValues = currentValues.filter((v: string) => v !== value);
      
      setFilters({
        ...filters,
        [category]: newValues
      });
    }
  };
  
  const resetFilters = () => {
    setFilters({});
    setPriceRange([0, 100]);
    setFreeShippingOnly(false);
    setVerifiedSellersOnly(false);
    setSelectedCategory('all');
    setSortOption('relevance');
  };
  
  // Pagination logic
  const totalPages = Math.ceil(filteredPlushies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredPlushies.slice(startIndex, endIndex);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {isMobile ? <MobileNav /> : <Navbar />}
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleRefresh}>Refresh Page</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="rounded-full"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                onClick={handleSellPlushie}
                className="bg-softspot-500 hover:bg-softspot-600 text-white"
              >
                Sell a Plushie
              </Button>
            </div>
          </div>

          <MarketplaceNav 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          
          {/* Quick Sell Banner (only on desktop) */}
          {!isMobile && <QuickSellBanner />}
          
          {/* Mobile Filter & Sort Options */}
          <div className="lg:hidden bg-white rounded-lg shadow-sm p-3 flex items-center justify-between">
            <MobileFilterDrawer 
              filters={filters}
              onFilterChange={handleFilterChange}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              freeShippingOnly={freeShippingOnly}
              setFreeShippingOnly={setFreeShippingOnly}
              verifiedSellersOnly={verifiedSellersOnly}
              setVerifiedSellersOnly={setVerifiedSellersOnly}
              onApplyFilters={() => {}}
              onResetFilters={resetFilters}
            />
            <SortOptions sortOption={sortOption} onSortChange={setSortOption} />
          </div>
          
          {/* Active Filter Chips */}
          {activeFilters.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-3">
              <FilterChips
                chips={activeFilters}
                onChipClick={handleFilterChipClick}
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Desktop Filter Panel */}
            <div className="hidden lg:block">
              <FilterPanel 
                filters={filters} 
                onFilterChange={handleFilterChange}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                freeShippingOnly={freeShippingOnly}
                setFreeShippingOnly={setFreeShippingOnly}
                verifiedSellersOnly={verifiedSellersOnly}
                setVerifiedSellersOnly={setVerifiedSellersOnly}
              />
            </div>
            
            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Desktop Sort Options */}
              <div className="hidden lg:flex justify-end mb-4">
                <SortOptions sortOption={sortOption} onSortChange={setSortOption} />
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Spinner size="lg" />
                </div>
              ) : filteredPlushies.length === 0 ? (
                <div className="text-center py-20">
                  <h3 className="text-xl font-medium text-gray-600">No plushies found</h3>
                  <p className="text-gray-500 mt-2">Try different filters or check back later</p>
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="mt-4"
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {currentItems.map((plushie) => (
                      <ProductCard
                        key={plushie.id}
                        product={plushie}
                        onProductClick={handlePlushieClick}
                        onWishlistToggle={handleWishlistToggle}
                        isWishlisted={wishlist.includes(plushie.id)}
                      />
                    ))}
                  </div>
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) setCurrentPage(currentPage - 1);
                              }} 
                              aria-disabled={currentPage === 1}
                              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                            />
                          </PaginationItem>
                          
                          {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i} className={totalPages > 5 && (i > 2 && i < totalPages - 2) && i !== currentPage - 1 ? 'hidden md:inline-flex' : ''}>
                              {(i < 2 || i > totalPages - 3 || i === currentPage - 1) ? (
                                <PaginationLink 
                                  href="#" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(i + 1);
                                  }}
                                  isActive={currentPage === i + 1}
                                >
                                  {i + 1}
                                </PaginationLink>
                              ) : (i === 2 && currentPage > 4) ? (
                                <PaginationEllipsis />
                              ) : null}
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                              }}
                              aria-disabled={currentPage === totalPages}
                              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedPlushie && (
        <PlushieDetailDialog
          plushie={selectedPlushie}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
      
      {/* Quick Sell Floating Button (Mobile) */}
      <div className="lg:hidden fixed bottom-20 right-4 z-50">
        <Button
          onClick={handleSellPlushie} 
          className="bg-softspot-500 hover:bg-softspot-600 text-white h-14 w-14 rounded-full shadow-lg p-0"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default Marketplace;
