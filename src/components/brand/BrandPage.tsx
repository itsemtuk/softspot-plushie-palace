
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { PlushieGrid } from "@/components/brand/PlushieGrid";
import { CommunityPosts } from "@/components/brand/CommunityPosts";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MarketplacePlushie, Post } from "@/types/marketplace";

export const BrandPageWrapper = () => {
  const { brandName } = useParams<{ brandName: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [brandData, setBrandData] = useState<any>(null);
  const [plushies, setPlushies] = useState<MarketplacePlushie[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  
  useEffect(() => {
    // Simulate loading brand data
    setLoading(true);
    
    setTimeout(() => {
      const brands = {
        "Build a Bear": {
          logo: "/assets/Brand_Logos/Build a Bear.JPG",
          description: "Build-A-Bear Workshop is a retailer that sells teddy bears and other stuffed animals. Customers can customize their own plush toys.",
          themeColor: "bg-amber-100",
          accentColor: "text-amber-700",
          borderColor: "border-amber-300"
        },
        "Disney": {
          logo: "/assets/Brand_Logos/Disney.JPG",
          description: "Disney's plush toy collection features beloved characters from Disney movies, TV shows, and theme parks.",
          themeColor: "bg-blue-100",
          accentColor: "text-blue-700",
          borderColor: "border-blue-300"
        },
        "Jellycat": {
          logo: "/assets/Brand_Logos/Jellycat.JPG",
          description: "Jellycat is a London-based company that designs luxuriously soft and irresistible plush toys.",
          themeColor: "bg-green-100",
          accentColor: "text-green-700",
          borderColor: "border-green-300"
        },
        "Pokemon": {
          logo: "/assets/Brand_Logos/Pokemon.PNG",
          description: "The official Pokémon plush collection features soft toys of popular Pokémon characters.",
          themeColor: "bg-yellow-100",
          accentColor: "text-yellow-700",
          borderColor: "border-yellow-300"
        },
        "Sanrio": {
          logo: "/assets/Brand_Logos/Sanrio.PNG",
          description: "Sanrio is a Japanese company that designs and produces kawaii (cute) characters, notably Hello Kitty.",
          themeColor: "bg-pink-100",
          accentColor: "text-pink-700",
          borderColor: "border-pink-300"
        },
        "Squishmallows": {
          logo: "/assets/Brand_Logos/Squishmallows.JPG",
          description: "Squishmallows are a line of plush toys known for their ultra-soft feel and round shape.",
          themeColor: "bg-purple-100",
          accentColor: "text-purple-700",
          borderColor: "border-purple-300"
        }
      };
      
      // Format brand name to match keys (remove spaces)
      const foundBrand = brands[brandName as keyof typeof brands];
      setBrandData(foundBrand || {
        logo: "/placeholder.svg",
        description: "Brand information not available.",
        themeColor: "bg-gray-100",
        accentColor: "text-gray-700",
        borderColor: "border-gray-300"
      });
      
      // Mock plushies data for the brand
      setPlushies([]);
      setPosts([]);
      
      setLoading(false);
    }, 800);
  }, [brandName]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handlePlushieClick = (plushie: MarketplacePlushie) => {
    // Handle plushie click
    console.log("Clicked plushie:", plushie);
  };
  
  const handlePostClick = (post: Post) => {
    // Handle post click
    console.log("Clicked post:", post);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${brandData.themeColor}`}>
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Card className={`${brandData.borderColor} border-2 overflow-hidden`}>
          <CardHeader className="flex flex-col items-center">
            <div className="w-32 h-32 relative overflow-hidden">
              <img 
                src={brandData.logo}
                alt={brandName}
                className="object-contain w-full h-full"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
            <h1 className={`text-2xl font-bold mt-4 ${brandData.accentColor}`}>
              {brandName}
            </h1>
            <p className="text-center text-gray-600 mt-2">
              {brandData.description}
            </p>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="collection" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="collection">Collection</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
              </TabsList>
              
              <TabsContent value="collection" className="mt-4">
                <PlushieGrid plushies={plushies} onPlushieClick={handlePlushieClick} />
              </TabsContent>
              
              <TabsContent value="community" className="mt-4">
                <CommunityPosts posts={posts} onPostClick={handlePostClick} />
              </TabsContent>
              
              <TabsContent value="news" className="mt-4">
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium">Coming Soon!</h3>
                  <p className="text-gray-500">
                    News and updates about {brandName} will be available here soon.
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
