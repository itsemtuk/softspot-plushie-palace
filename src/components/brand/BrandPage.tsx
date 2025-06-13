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
  "ty-inc": {
    name: "TY Inc.",
    description: "Home of Beanie Babies, Beanie Boos, and more!",
    logoUrl: "/ty-logo.png",
    tags: ["plushies", "beanie babies", "collectibles"],
  },
  "steiff": {
    name: "Steiff",
    description: "The oldest and most famous plush toy company in the world.",
    logoUrl: "/steiff-logo.png",
    tags: ["plushies", "luxury", "handmade"],
  },
  "jellycat": {
    name: "Jellycat",
    description: "Quirky and irresistibly cuddly soft toys from London.",
    logoUrl: "/jellycat-logo.png",
    tags: ["plushies", "soft toys", "unique"],
  },
  "ganz": {
    name: "Ganz",
    description: "Provider of soft toys and gifts.",
    logoUrl: "/ganz-logo.png",
    tags: ["plushies", "gifts", "seasonal"],
  },
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
        
        // Find the brand data
        const currentBrand = brandData[normalizedBrandName as keyof typeof brandData];
        
        if (currentBrand) {
          setBrand(currentBrand);
          
          // Fetch plushies and posts related to this brand
          const allPlushies = getMarketplaceListings();
          const brandPlushies = allPlushies
            .filter(plushie => plushie.brand?.toLowerCase() === currentBrand.name.toLowerCase())
            .map(plushie => ({
              ...plushie,
              price: plushie.price || 0,
              forSale: plushie.forSale || true,
              title: plushie.title || 'Untitled',
              name: plushie.title || 'Untitled'
            } as MarketplacePlushie));
          setPlushies(brandPlushies);
          
          // Fetch posts mentioning this brand and convert to ExtendedPost
          const allPosts = await getAllPosts();
          const brandPosts = allPosts.filter(post => 
            post.tags?.some(tag => tag.toLowerCase() === currentBrand.name.toLowerCase()) ||
            (post.description && post.description.toLowerCase().includes(currentBrand.name.toLowerCase()))
          );
          setPosts(brandPosts);
        } else {
          // Try fuzzy matching or handle unknown brand
          toast({
            title: "Brand not found",
            description: `We couldn't find information for "${brandName}"`,
            variant: "destructive"
          });
          setBrand(null);
        }
      } catch (error) {
        console.error("Error fetching brand data:", error);
        toast({
          title: "Error",
          description: "Failed to load brand information",
          variant: "destructive"
        });
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
