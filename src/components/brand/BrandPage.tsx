
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrandHeader } from "./BrandHeader";
import { PlushieGrid } from "./PlushieGrid";
import { CommunityPosts } from "./CommunityPosts";
import { BrandFilterPanel } from "./BrandFilterPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { MarketplacePlushie } from "@/types/marketplace";

const brandLogos: Record<string, string> = {
  jellycat: "/assets/Brand_Logos/Jellycat.JPG",
  squishmallows: "/assets/Brand_Logos/Squishmallows.JPG",
  disney: "/assets/Brand_Logos/Disney.JPG",
  sanrio: "/assets/Brand_Logos/Sanrio.PNG",
  pokemon: "/assets/Brand_Logos/Pokemon.PNG",
  "build-a-bear": "/assets/Brand_Logos/Build a Bear.JPG"
};

const brandInfo: Record<string, { name: string; description: string; color: string }> = {
  jellycat: {
    name: "Jellycat",
    description: "Premium soft toys known for their luxurious fabrics and adorable designs.",
    color: "bg-pink-100 dark:bg-pink-900/20"
  },
  squishmallows: {
    name: "Squishmallows",
    description: "Super soft, collectible plush toys perfect for cuddling and collecting.",
    color: "bg-purple-100 dark:bg-purple-900/20"
  },
  disney: {
    name: "Disney",
    description: "Magical plush characters from your favorite Disney movies and shows.",
    color: "bg-blue-100 dark:bg-blue-900/20"
  },
  sanrio: {
    name: "Sanrio",
    description: "Kawaii characters including Hello Kitty, My Melody, and Cinnamoroll.",
    color: "bg-pink-100 dark:bg-pink-900/20"
  },
  pokemon: {
    name: "Pokémon",
    description: "Gotta catch 'em all! Plush versions of your favorite Pokémon.",
    color: "bg-yellow-100 dark:bg-yellow-900/20"
  },
  "build-a-bear": {
    name: "Build-A-Bear",
    description: "Customizable teddy bears and plush animals you can build yourself.",
    color: "bg-brown-100 dark:bg-brown-900/20"
  }
};

export const BrandPageWrapper = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const [brandPlushies, setBrandPlushies] = useState<MarketplacePlushie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const brand = brandId ? brandInfo[brandId.toLowerCase()] : null;
  const logo = brandId ? brandLogos[brandId.toLowerCase()] : null;

  useEffect(() => {
    const fetchBrandItems = async () => {
      if (!brandId || !brand) return;
      
      setIsLoading(true);
      try {
        const { data: posts, error } = await supabase
          .from('posts')
          .select(`
            *,
            users!inner(username, first_name, avatar_url)
          `)
          .ilike('brand', `%${brand.name}%`)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching brand items:", error);
          setBrandPlushies([]);
          return;
        }

        if (posts && posts.length > 0) {
          const formattedItems: MarketplacePlushie[] = posts.map(post => ({
            id: post.id,
            title: post.title || 'Untitled Item',
            name: post.title || 'Untitled Item',
            price: post.price || 0,
            image: post.image || '',
            brand: post.brand || brand.name,
            condition: post.condition || 'used',
            description: post.description || '',
            tags: [brand.name.toLowerCase()],
            likes: 0,
            comments: 0,
            forSale: post.for_sale || false,
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
          
          setBrandPlushies(formattedItems);
        } else {
          setBrandPlushies([]);
        }
      } catch (error) {
        console.error("Error fetching brand items:", error);
        setBrandPlushies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandItems();
  }, [brandId, brand]);

  if (!brand) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Brand not found</h2>
            <p className="text-gray-600 dark:text-gray-400">The brand you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <BrandHeader 
          brandName={brand.name}
          brandDescription={brand.description}
          brandLogo={logo}
          backgroundColor={brand.color}
          itemCount={brandPlushies.length}
        />
        
        <Tabs defaultValue="marketplace" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white dark:bg-gray-800">
            <TabsTrigger value="marketplace" className="data-[state=active]:bg-softspot-500 data-[state=active]:text-white">
              Marketplace ({brandPlushies.filter(p => p.forSale).length})
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-softspot-500 data-[state=active]:text-white">
              Community ({brandPlushies.filter(p => !p.forSale).length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="marketplace">
            <PlushieGrid 
              plushies={brandPlushies.filter(p => p.forSale)}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="community">
            <CommunityPosts 
              posts={brandPlushies.filter(p => !p.forSale)}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
