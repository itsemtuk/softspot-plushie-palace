
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { FilterPanel } from "@/components/marketplace/FilterPanel";
import { MarketplaceNav } from "@/components/marketplace/MarketplaceNav";
import { MarketplacePlushie } from "@/types/marketplace";
import { PlushieDetailDialog } from "@/components/marketplace/PlushieDetailDialog";
import { getMarketplaceListings } from "@/utils/storage/localStorageUtils";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, MessageSquare, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "@/components/navigation/MobileNav";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [plushies, setPlushies] = useState<MarketplacePlushie[]>([]);
  const [filteredPlushies, setFilteredPlushies] = useState<MarketplacePlushie[]>([]);
  const [selectedPlushie, setSelectedPlushie] = useState<MarketplacePlushie | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useUser();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Load marketplace listings from local storage or API
    setIsLoading(true);
    setError(null);
    
    try {
      const storedPlushies = getMarketplaceListings();
      console.log("Loaded marketplace listings:", storedPlushies);
      
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
            location: "New York"
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
            location: "Los Angeles"
          }
        ];
        setPlushies(defaultItems);
        setFilteredPlushies(defaultItems);
      } else {
        // Make sure we add any missing fields required by the UI
        const plushiesWithRequiredFields = storedPlushies.map((plushie: MarketplacePlushie) => ({
          ...plushie,
          // Only add timestamp if it doesn't exist
          ...(plushie.timestamp ? {} : { timestamp: new Date().toISOString() })
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
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    if (category === 'all') {
      setFilteredPlushies(plushies);
    } else {
      const filtered = plushies.filter((plushie) => 
        plushie.tags?.includes(category)
      );
      setFilteredPlushies(filtered);
    }
  };

  const handlePlushieClick = (plushie: MarketplacePlushie) => {
    setSelectedPlushie(plushie);
    setIsDetailsOpen(true);
  };

  const handleAddToWishlist = (id: string, event: React.MouseEvent) => {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {isMobile ? <MobileNav /> : <Navbar />}
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Keep using the appropriate navigation based on device */}
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <Button 
              onClick={handleSellPlushie}
              className="bg-softspot-500 hover:bg-softspot-600 text-white"
            >
              Sell a Plushie
            </Button>
          </div>

          <MarketplaceNav 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filter panel with empty filters object if needed */}
            <FilterPanel 
              filters={{}} 
              onFilterChange={() => {}} 
            />
            
            <div className="md:col-span-3">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Spinner size="lg" />
                </div>
              ) : filteredPlushies.length === 0 ? (
                <div className="text-center py-20">
                  <h3 className="text-xl font-medium text-gray-600">No plushies found</h3>
                  <p className="text-gray-500 mt-2">Try a different category or check back later</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPlushies.map((plushie) => (
                    <Card 
                      key={plushie.id} 
                      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow bg-white"
                      onClick={() => handlePlushieClick(plushie)}
                    >
                      <div className="aspect-square relative">
                        <img 
                          src={plushie.image} 
                          alt={plushie.title}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://images.unsplash.com/photo-1516067154453-6194ba34d121";
                          }}
                        />
                        {plushie.condition && (
                          <Badge className="absolute top-2 left-2 bg-softspot-500 hover:bg-softspot-600">
                            {plushie.condition}
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
                          onClick={(e) => handleAddToWishlist(plushie.id, e)}
                        >
                          <Bookmark 
                            className={`h-5 w-5 ${wishlist.includes(plushie.id) ? 'fill-softspot-500 text-softspot-500' : 'text-gray-600'}`}
                          />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium truncate">{plushie.title}</h3>
                        <p className="text-softspot-500 font-bold">${plushie.price?.toFixed(2) || "Price unavailable"}</p>
                      </CardContent>
                      <CardFooter className="px-4 py-2 border-t flex justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            {plushie.likes || 0}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {plushie.comments || 0}
                          </span>
                        </div>
                        <span>{plushie.location || 'Location unknown'}</span>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
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
    </div>
  );
};

export default Marketplace;
