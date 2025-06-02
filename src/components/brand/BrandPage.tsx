
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { PlushieGrid } from "@/components/brand/PlushieGrid";
import { CommunityPosts } from "@/components/brand/CommunityPosts";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MarketplacePlushie, ExtendedPost } from "@/types/marketplace";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { getMarketplaceListings } from "@/utils/storage/localStorageUtils";
import { getPosts } from "@/utils/posts/postFetch";
import { convertPostsToExtendedPosts } from "@/utils/postConversion";
import { toast } from "@/components/ui/use-toast";

// Brand data mapping
const brandData = {
  "build-a-bear": {
    name: "Build a Bear",
    logo: "/assets/Brand_Logos/Build a Bear.JPG",
    description: "Build-A-Bear Workshop is a retailer that sells teddy bears and other stuffed animals. Customers can customize their own plush toys.",
    themeColor: "bg-amber-100",
    accentColor: "text-amber-700",
    borderColor: "border-amber-300"
  },
  "disney": {
    name: "Disney",
    logo: "/assets/Brand_Logos/Disney.JPG",
    description: "Disney's plush toy collection features beloved characters from Disney movies, TV shows, and theme parks.",
    themeColor: "bg-blue-100",
    accentColor: "text-blue-700",
    borderColor: "border-blue-300"
  },
  "jellycat": {
    name: "Jellycat",
    logo: "/assets/Brand_Logos/Jellycat.JPG",
    description: "Jellycat is a London-based company that designs luxuriously soft and irresistible plush toys.",
    themeColor: "bg-green-100",
    accentColor: "text-green-700",
    borderColor: "border-green-300"
  },
  "pokemon": {
    name: "Pokemon",
    logo: "/assets/Brand_Logos/Pokemon.PNG",
    description: "The official Pokémon plush collection features soft toys of popular Pokémon characters.",
    themeColor: "bg-yellow-100",
    accentColor: "text-yellow-700",
    borderColor: "border-yellow-300"
  },
  "sanrio": {
    name: "Sanrio",
    logo: "/assets/Brand_Logos/Sanrio.PNG",
    description: "Sanrio is a Japanese company that designs and produces kawaii (cute) characters, notably Hello Kitty.",
    themeColor: "bg-pink-100",
    accentColor: "text-pink-700",
    borderColor: "border-pink-300"
  },
  "squishmallows": {
    name: "Squishmallows",
    logo: "/assets/Brand_Logos/Squishmallows.JPG",
    description: "Squishmallows are a line of plush toys known for their ultra-soft feel and round shape.",
    themeColor: "bg-purple-100",
    accentColor: "text-purple-700",
    borderColor: "border-purple-300"
  }
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
          const brandPlushies = allPlushies.filter(
            plushie => plushie.brand?.toLowerCase() === currentBrand.name.toLowerCase()
          );
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
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handlePlushieClick = (plushie: MarketplacePlushie) => {
    navigate(`/marketplace/product/${plushie.id}`);
  };
  
  const handlePostClick = (post: ExtendedPost) => {
    navigate(`/post/${post.id}`);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!brand) {
    return (
      <div className="container mx-auto px-4 py-6 bg-gray-50">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">Brand not found</h1>
          <p className="mt-2">We couldn't find information about this brand.</p>
          <Button 
            variant="outline" 
            onClick={() => navigate("/marketplace")}
            className="mt-4"
          >
            Return to Marketplace
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-[calc(100vh-64px)] ${brand.themeColor}`}>
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Card className={`${brand.borderColor} border-2 overflow-hidden bg-white`}>
          <CardHeader className="flex flex-col items-center bg-white">
            <div className="w-32 h-32 relative overflow-hidden flex items-center justify-center">
              <BrandLogo brandName={brand.name} className="w-full h-full" />
            </div>
            <h1 className={`text-2xl font-bold mt-4 ${brand.accentColor}`}>
              {brand.name}
            </h1>
            <p className="text-center text-gray-600 mt-2">
              {brand.description}
            </p>
          </CardHeader>
          
          <CardContent className="bg-white">
            <Tabs defaultValue="collection" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="collection">Collection</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
                <TabsTrigger value="news" disabled>News</TabsTrigger>
              </TabsList>
              
              <TabsContent value="collection" className="mt-4">
                {plushies.length > 0 ? (
                  <PlushieGrid plushies={plushies} onPlushieClick={handlePlushieClick} />
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium">No items found</h3>
                    <p className="text-gray-500">
                      There are no {brand.name} items in the marketplace yet.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="community" className="mt-4">
                {posts.length > 0 ? (
                  <CommunityPosts posts={posts} onPostClick={handlePostClick} />
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium">No posts yet</h3>
                    <p className="text-gray-500">
                      Be the first to post about {brand.name}!
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="news" className="mt-4">
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium">Coming Soon!</h3>
                  <p className="text-gray-500">
                    News and updates about {brand.name} will be available here soon.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
