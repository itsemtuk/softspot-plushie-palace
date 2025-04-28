
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "@/components/Navbar";
import { MarketplaceNav } from "@/components/marketplace/MarketplaceNav";
import { FilterPanel } from "@/components/marketplace/FilterPanel";
import { PlushieCard } from "@/components/PlushieCard";
import { PlushieDetailDialog } from "@/components/marketplace/PlushieDetailDialog";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { MarketplacePlushie, MarketplaceFilters } from "@/types/marketplace";
import CurrencyConverter from "@/components/marketplace/CurrencyConverter";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { getMarketplaceListings } from "@/utils/storage/localStorageUtils";

const Marketplace = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 150]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPlushie, setSelectedPlushie] = useState<MarketplacePlushie | null>(null);
  const [listings, setListings] = useState<MarketplacePlushie[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  // Get listings from localStorage
  useEffect(() => {
    const fetchListings = () => {
      try {
        setIsLoading(true);
        console.log("Fetching marketplace listings...");
        const storedListings = getMarketplaceListings();
        console.log("Fetched marketplace listings:", storedListings);
        setListings(storedListings || []);
      } catch (error) {
        console.error("Error fetching marketplace listings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListings();
    
    // Set up interval to check for new listings every 30 seconds
    const intervalId = setInterval(fetchListings, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const filteredPlushies = listings.filter((plushie: MarketplacePlushie) => {
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch =
      plushie.title.toLowerCase().includes(searchTerm) ||
      plushie.description.toLowerCase().includes(searchTerm) ||
      plushie.username.toLowerCase().includes(searchTerm);

    const isInPriceRange = 
      plushie.price !== undefined && 
      plushie.price >= priceRange[0] && 
      plushie.price <= priceRange[1];
    const isAvailable = !availableOnly || plushie.forSale;

    // Material filter
    if (filters.material && filters.material.length > 0) {
      if (!filters.material.includes(plushie.material)) {
        return false;
      }
    }
      
    // Filling filter
    if (filters.filling && filters.filling.length > 0) {
      if (!filters.filling.includes(plushie.filling)) {
        return false;
      }
    }
      
    // Species filter
    if (filters.species && filters.species.length > 0) {
      if (!filters.species.includes(plushie.species)) {
        return false;
      }
    }
      
    // Brand filter
    if (filters.brands && filters.brands.length > 0) {
      if (!filters.brands.includes(plushie.brand)) {
        return false;
      }
    }

    // Color filter
    if (filters.color && filters.color.length > 0) {
      // Simple color matching, can be enhanced for better color detection
      if (!filters.color.some(color => plushie.color.toLowerCase().includes(color.toLowerCase()))) {
        return false;
      }
    }

    return matchesSearch && (isInPriceRange || !plushie.price) && isAvailable;
  });

  const handleFilterUpdate = (newFilters: MarketplaceFilters) => {
    console.log("Updating filters:", newFilters);
    setFilters(newFilters);
    if (isMobile) {
      setIsFilterOpen(false);
    }
  };

  const handlePlushieClick = (plushie: MarketplacePlushie) => {
    console.log("Plushie clicked:", plushie);
    setSelectedPlushie(plushie);
    setIsDetailsOpen(true);
  };

  const clearFilters = () => {
    setFilters({});
    setPriceRange([0, 150]);
    setAvailableOnly(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {!isMobile ? <Navbar /> : <MobileNav />}
      <div className="relative h-[200px] md:h-[300px] bg-gradient-to-r from-softspot-100 to-softspot-200">
        <div className="absolute inset-0 bg-opacity-50 bg-white">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">Marketplace</h1>
            <p className="text-md md:text-lg text-gray-700 max-w-2xl">
              Discover unique plushies from collectors worldwide. Buy, sell, and trade your favorite companions.
            </p>
          </div>
        </div>
      </div>

      <MarketplaceNav />

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-6">
          {/* Search and Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex-1 relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search plushies..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {isMobile && (
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    {Object.keys(filters).length > 0 && (
                      <span className="bg-softspot-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {Object.keys(filters).length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium">Filters</h3>
                    {Object.keys(filters).length > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-500">
                        <X className="h-3 w-3 mr-1" />
                        Clear all
                      </Button>
                    )}
                  </div>
                  <FilterPanel filters={filters} onFilterChange={handleFilterUpdate} />
                </SheetContent>
              </Sheet>
            )}
            
            <div className="flex items-center">
              <CurrencyConverter price={0} className="ml-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters */}
            <div className="col-span-1 md:block hidden">
              <FilterPanel filters={filters} onFilterChange={handleFilterUpdate} />
            </div>

            {/* Plushie Grid */}
            <div className="col-span-1 md:col-span-3">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-softspot-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading marketplace listings...</p>
                </div>
              ) : filteredPlushies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlushies.map((plushie) => (
                    <div 
                      key={plushie.id} 
                      className="cursor-pointer transform transition-transform hover:scale-[1.02]"
                      onClick={() => handlePlushieClick(plushie)}
                    >
                      <PlushieCard 
                        {...plushie} 
                        variant="marketplace"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <h3 className="text-xl font-medium text-gray-700">No plushies found</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your filters or add a new listing</p>
                  <Button 
                    onClick={() => navigate('/marketplace/sell')} 
                    className="mt-4 bg-softspot-500 hover:bg-softspot-600"
                  >
                    List a Plushie for Sale
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedPlushie && (
        <PlushieDetailDialog 
          isOpen={isDetailsOpen} 
          onClose={() => setIsDetailsOpen(false)} 
          plushie={selectedPlushie}
        />
      )}
    </div>
  );
};

export default Marketplace;
