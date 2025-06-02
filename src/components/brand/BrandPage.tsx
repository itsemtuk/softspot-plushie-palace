import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { MarketplacePlushie } from "@/types/marketplace";
import { ExtendedPost } from "@/types/core";
import { getPosts } from "@/utils/posts/postFetch";
import { getMarketplaceListings } from "@/utils/storage/localStorageUtils";
import { convertPostsToExtendedPosts } from "@/utils/postConversion";
import { BrandHeader } from "./BrandHeader";
import { PlushieGrid } from "./PlushieGrid";
import { CommunityPosts } from "./CommunityPosts";
import { BrandFilterPanel } from "./BrandFilterPanel";

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
  
  useEffect(() => {
    if (!brandName) {
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
          const allPosts = await getPosts();
          const brandPosts = allPosts.filter(post => 
            post.tags?.some(tag => tag.toLowerCase() === currentBrand.name.toLowerCase()) ||
            (post.description && post.description.toLowerCase().includes(currentBrand.name.toLowerCase()))
          );
          const extendedPosts = convertPostsToExtendedPosts(brandPosts);
          setPosts(extendedPosts);
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

  if (loading) {
    return <div>Loading brand data...</div>;
  }

  if (!brand) {
    return <div>Brand not found.</div>;
  }

  return (
    <div>
      <BrandHeader brand={brand} />
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <BrandFilterPanel />
          </div>
          <div className="md:col-span-3">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Featured Plushies</h2>
              <PlushieGrid plushies={plushies} />
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">Community Posts</h2>
              <CommunityPosts posts={posts} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
