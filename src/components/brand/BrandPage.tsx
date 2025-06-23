import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { MarketplacePlushie } from "@/types/marketplace";
import { ExtendedPost } from "@/types/core";
import { supabase } from "@/integrations/supabase/client";
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
        const normalizedBrandName = brandName.toLowerCase().replace(/\s+/g, '-');
        
        let currentBrand = brandData[normalizedBrandName];
        
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
          
          const { data: marketplaceData, error: marketplaceError } = await supabase
            .from('posts')
            .select(`
              *,
              users!inner(username, first_name, avatar_url)
            `)
            .eq('for_sale', true)
            .ilike('brand', `%${currentBrand.name}%`)
            .order('created_at', { ascending: false });

          if (marketplaceError) {
            console.error("Error fetching marketplace items:", marketplaceError);
            setPlushies([]);
          } else if (marketplaceData && marketplaceData.length > 0) {
            const formattedItems: MarketplacePlushie[] = marketplaceData.map(post => ({
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
              location: 'Online'
            }));
            
            setPlushies(formattedItems);
          } else {
            setPlushies([]);
          }
          
          const { data: postsData, error: postsError } = await supabase
            .from('posts')
            .select(`
              *,
              users!inner(username, first_name, avatar_url)
            `)
            .eq('for_sale', false)
            .or(`brand.ilike.%${currentBrand.name}%,content.ilike.%${currentBrand.name}%,title.ilike.%${currentBrand.name}%`)
            .order('created_at', { ascending: false });

          if (postsError) {
            console.error("Error fetching posts:", postsError);
            setPosts([]);
          } else if (postsData && postsData.length > 0) {
            const formattedPosts: ExtendedPost[] = postsData.map(post => ({
              id: post.id,
              title: post.title || '',
              content: post.content || '',
              description: post.description || '',
              image: post.image || '',
              userId: post.user_id,
              user_id: post.user_id,
              username: post.users?.username || post.users?.first_name || 'User',
              likes: 0,
              comments: 0,
              timestamp: post.created_at,
              createdAt: post.created_at,
              created_at: post.created_at,
              updatedAt: post.created_at,
              tags: post.brand ? [post.brand.toLowerCase()] : [],
              location: "",
              forSale: false,
              sold: false
            }));
            setPosts(formattedPosts);
          } else {
            setPosts([]);
          }
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
    console.log("Post clicked:", post);
  };

  const handleFilterChange = (filterType: string, value: string[]) => {
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
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
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
          <div className="lg:col-span-3">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Featured Plushies</h2>
              {plushies.length > 0 ? (
                <PlushieGrid plushies={plushies} onPlushieClick={handlePlushieClick} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No {brand.name} items available yet.</p>
                </div>
              )}
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Community Posts</h2>
              {posts.length > 0 ? (
                <CommunityPosts posts={posts} onPostClick={handlePostClick} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No community posts about {brand.name} yet.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
