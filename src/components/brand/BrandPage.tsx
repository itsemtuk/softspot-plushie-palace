import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { MarketplacePlushie } from "@/types/marketplace";
import { ExtendedPost } from "@/types/core";
import { getPosts, getAllPosts } from "@/utils/posts/postFetch";
import { getMarketplaceListings } from "@/utils/storage/localStorageUtils";
import { convertPostsToExtendedPosts } from "@/utils/postConversion";
import { BrandHeader } from "./BrandHeader";
import { PlushieGrid } from "./PlushieGrid";
import { CommunityPosts } from "./CommunityPosts";
import { BrandFilterPanel } from "./BrandFilterPanel";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const brandData: { [key: string]: { name: string; description: string; logoUrl: string; tags: string[] } } = {
  "build-a-bear": {
    name: "Build-A-Bear",
    description: "Create your own personalized furry friend at Build-A-Bear Workshop!",
    logoUrl: "/build-a-bear-logo.png",
    tags: ["plushies", "customizable", "workshop"],
  },
  "jellycat": {
    name: "Jellycat",
    description: "Quirky and irresistibly cuddly soft toys from London.",
    logoUrl: "/jellycat-logo.png",
    tags: ["plushies", "soft toys", "unique"],
  },
  "squishmallows": {
    name: "Squishmallows",
    description: "Super soft, collectible plush toys that make perfect cuddle companions.",
    logoUrl: "/squishmallows-logo.png",
    tags: ["plushies", "collectible", "soft"],
  },
  "pokemon": {
    name: "Pokemon",
    description: "Gotta catch 'em all! Official Pokemon plushies and collectibles.",
    logoUrl: "/pokemon-logo.png",
    tags: ["plushies", "anime", "collectible"],
  },
  "sanrio": {
    name: "Sanrio",
    description: "Hello Kitty and friends - kawaii characters from Japan.",
    logoUrl: "/sanrio-logo.png",
    tags: ["plushies", "kawaii", "characters"],
  },
  "disney": {
    name: "Disney",
    description: "Magical plushies featuring your favorite Disney characters.",
    logoUrl: "/disney-logo.png",
    tags: ["plushies", "disney", "characters"],
  }
};

export const BrandPageWrapper = () => {
  const { brandName } = useParams<{ brandName: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState<any>(null);
  const [plushies, setPlushies] = useState<MarketplacePlushie[]>([]);
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [availableOnly, setAvailableOnly] = useState(false);
  
  useEffect(() => {
    if (!brandName) {
      setLoading(false);
      return;
    }
    
    const fetchBrandData = async () => {
      setLoading(true);
      
      try {
        // Normalize the brand name for lookup
        const normalizedBrandName = brandName.toLowerCase().replace(/\s+/g, '-');
        
        // Find the brand data - try exact match first
        let currentBrand = brandData[normalizedBrandName];
        
        // If no exact match, try partial matching
        if (!currentBrand) {
          const brandKeys = Object.keys(brandData);
          const partialMatch = brandKeys.find(key => 
            key.includes(normalizedBrandName) || 
            normalizedBrandName.includes(key) ||
            brandData[key].name.toLowerCase().includes(brandName.toLowerCase())
          );
          
          if (partialMatch) {
            currentBrand = brandData[partialMatch];
          }
        }
        
        if (currentBrand) {
          setBrand(currentBrand);
          
          // Create some sample plushies for demonstration
          const samplePlushies: MarketplacePlushie[] = [
            {
              id: `${normalizedBrandName}-1`,
              name: `${currentBrand.name} Plushie 1`,
              title: `${currentBrand.name} Plushie 1`,
              price: 25,
              image: "/placeholder-plushie.jpg",
              brand: currentBrand.name,
              condition: "new",
              forSale: true,
              location: "Online",
              seller: "Sample Seller",
              description: `A wonderful ${currentBrand.name} plushie`,
              rating: 4.5,
              reviews: 10
            },
            {
              id: `${normalizedBrandName}-2`,
              name: `${currentBrand.name} Plushie 2`,
              title: `${currentBrand.name} Plushie 2`,
              price: 35,
              image: "/placeholder-plushie.jpg",
              brand: currentBrand.name,
              condition: "like-new",
              forSale: true,
              location: "Online",
              seller: "Sample Seller",
              description: `Another great ${currentBrand.name} plushie`,
              rating: 4.8,
              reviews: 15
            }
          ];
          setPlushies(samplePlushies);
          
          // Create sample posts
          const samplePosts: ExtendedPost[] = [
            {
              id: `${normalizedBrandName}-post-1`,
              title: `My ${currentBrand.name} Collection`,
              content: `Check out my amazing ${currentBrand.name} collection!`,
              description: `Love these ${currentBrand.name} plushies`,
              image: "/placeholder-plushie.jpg",
              userId: "sample-user",
              user_id: "sample-user",
              username: "PlushieCollector",
              likes: 12,
              comments: 3,
              timestamp: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              tags: [currentBrand.name.toLowerCase()],
              location: "",
              forSale: false,
              sold: false
            }
          ];
          setPosts(samplePosts);
        } else {
          setBrand(null);
        }
      } catch (error) {
        console.error("Error fetching brand data:", error);
        setBrand(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBrandData();
  }, [brandName]);

  const handlePlushieClick = (plushie: MarketplacePlushie) => {
    navigate(`/checkout/${plushie.id}`);
  };

  const handlePostClick = (post: ExtendedPost) => {
    // Handle post click - could open a dialog or navigate to post page
    console.log("Post clicked:", post);
  };

  const handleFilterChange = (filterType: string, value: string[]) => {
    // Handle filter changes
    console.log("Filter changed:", filterType, value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner size="lg" className="py-20" />
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Brand not found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              The brand "{brandName}" could not be found.
            </p>
            <Button 
              onClick={() => navigate('/marketplace')}
              className="bg-softspot-500 hover:bg-softspot-600 text-white"
            >
              Browse Marketplace
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <BrandHeader brand={brand} />
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <BrandFilterPanel 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              availableOnly={availableOnly}
              setAvailableOnly={setAvailableOnly}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div className="md:col-span-3">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Featured Plushies</h2>
              <PlushieGrid plushies={plushies} onPlushieClick={handlePlushieClick} />
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Community Posts</h2>
              <CommunityPosts posts={posts} onPostClick={handlePostClick} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
