import { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageSquare, Share2, MoreHorizontal, Verified } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for trending plushies
const trendingPlushies = [
  {
    id: "1",
    name: "Vintage Bear",
    username: "plushielover",
    likes: 42,
    comments: 12,
    imageUrl: "https://placekitten.com/200/300",
    verified: true,
  },
  {
    id: "2",
    name: "Rainbow Unicorn",
    username: "unicornfan",
    likes: 68,
    comments: 22,
    imageUrl: "https://placekitten.com/201/301",
    verified: false,
  },
  {
    id: "3",
    name: "Giant Panda",
    username: "pandamania",
    likes: 120,
    comments: 45,
    imageUrl: "https://placekitten.com/202/302",
    verified: true,
  },
  {
    id: "4",
    name: "Sleepy Sloth",
    username: "slothlife",
    likes: 35,
    comments: 8,
    imageUrl: "https://placekitten.com/203/303",
    verified: false,
  },
  {
    id: "5",
    name: "Curious Cat",
    username: "catlover88",
    likes: 88,
    comments: 31,
    imageUrl: "https://placekitten.com/204/304",
    verified: true,
  },
];

// Mock data for popular brands
const popularBrands = [
  {
    id: "brand1",
    name: "TeddyCo",
    logoUrl: "https://placekitten.com/50/50",
    verified: true,
  },
  {
    id: "brand2",
    name: "UnicornWorld",
    logoUrl: "https://placekitten.com/51/51",
    verified: false,
  },
  {
    id: "brand3",
    name: "PandaParadise",
    logoUrl: "https://placekitten.com/52/52",
    verified: true,
  },
];

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const [trendingData, setTrendingData] = useState(trendingPlushies);

  const filteredData = trendingData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTrendingSection = () => {
    const totalItems = Array.isArray(trendingData) ? trendingData.length : 0;
    const visibleItems = Array.isArray(filteredData) ? filteredData.length : 0;

    return (
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Trending Plushies</h2>
          <span className="text-sm text-gray-500">
            {visibleItems} of {totalItems}
          </span>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredData.map((plushie) => (
              <Card key={plushie.id}>
                <CardContent className="p-3">
                  <div className="relative">
                    <img
                      src={plushie.imageUrl}
                      alt={plushie.name}
                      className="w-full h-48 object-cover rounded-md mb-2"
                    />
                    <Button size="icon" variant="ghost" className="absolute top-2 right-2">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Avatar className="mr-2 h-6 w-6">
                        <AvatarImage src={plushie.imageUrl} alt={plushie.username} />
                        <AvatarFallback>{plushie.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{plushie.name}</span>
                      {plushie.verified && (
                        <Verified className="ml-1 h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      <span>{plushie.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      <span>{plushie.comments}</span>
                    </div>
                    <Share2 className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </section>
    );
  };

  const renderPopularBrandsSection = () => (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Popular Brands</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {popularBrands.map((brand) => (
          <Card key={brand.id} className="hover:bg-gray-50 cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Avatar className="h-12 w-12 mb-2">
                <AvatarImage src={brand.logoUrl} alt={brand.name} />
                <AvatarFallback>{brand.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex items-center">
                <span className="text-sm font-medium">{brand.name}</span>
                {brand.verified && (
                  <Verified className="ml-1 h-4 w-4 text-blue-500" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Discover</h1>
          <p className="text-gray-600">Explore trending plushies and popular brands.</p>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search plushies or brands..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <Separator className="mb-6" />

        {renderTrendingSection()}
        {renderPopularBrandsSection()}
      </div>
    </div>
  );
};

export default Discover;
