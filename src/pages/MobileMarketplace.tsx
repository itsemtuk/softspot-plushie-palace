
import { useState, useEffect } from "react";
import { Search, Filter, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/MainLayout";
import { MobileMarketplaceNav } from "@/components/marketplace/MobileMarketplaceNav";
import { MarketplacePlushie } from "@/types/marketplace";

const mockPlushies: MarketplacePlushie[] = [
  {
    id: "1",
    title: "Jellycat Bashful Bunny - Medium",
    price: 28,
    image: "/placeholder.svg",
    brand: "Jellycat",
    condition: "New",
    description: "Soft and cuddly medium-sized bunny",
    tags: ["bunny", "soft", "new"],
    likes: 12,
    comments: 3,
    forSale: true,
    userId: "user1",
    username: "PlushLover123",
    timestamp: "2024-01-15T10:00:00Z",
    location: "New York, NY"
  },
  {
    id: "2", 
    title: "Squishmallow Axolotl - 16 inch",
    price: 22,
    image: "/placeholder.svg",
    brand: "Squishmallows",
    condition: "Like New",
    description: "Rare pink axolotl squishmallow",
    tags: ["axolotl", "rare", "pink"],
    likes: 18,
    comments: 5,
    forSale: true,
    userId: "user2",
    username: "SquishCollector",
    timestamp: "2024-01-14T15:30:00Z",
    location: "Los Angeles, CA"
  }
];

export default function MobileMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeBrand, setActiveBrand] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [plushies, setPlushies] = useState<MarketplacePlushie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setPlushies(mockPlushies);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPlushies = plushies.filter(plushie => {
    const matchesSearch = plushie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plushie.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plushie.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBrand = !activeBrand || plushie.brand?.toLowerCase() === activeBrand;
    
    return matchesSearch && matchesBrand;
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-softspot-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Search Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-16 z-40">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search plushies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="h-10 w-10"
            >
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredPlushies.length} item{filteredPlushies.length !== 1 ? 's' : ''} found
            </p>
            {(activeBrand || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActiveBrand("");
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="text-softspot-600"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <MobileMarketplaceNav
          activeCategory={activeCategory}
          activeBrand={activeBrand}
          onCategorySelect={setActiveCategory}
          onBrandSelect={setActiveBrand}
        />

        {/* Results */}
        <ScrollArea className="h-[calc(100vh-280px)]">
          {filteredPlushies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="text-6xl mb-4">🧸</div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No plushies found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="p-4">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 gap-4">
                  {filteredPlushies.map((plushie) => (
                    <Card key={plushie.id} className="overflow-hidden">
                      <div className="aspect-square bg-gray-100 dark:bg-gray-800">
                        <img
                          src={plushie.image}
                          alt={plushie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 line-clamp-2">
                          {plushie.title}
                        </h3>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-softspot-600">
                            ${plushie.price}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {plushie.condition}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          by {plushie.username}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{plushie.likes} ❤️</span>
                          <span>{plushie.location}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPlushies.map((plushie) => (
                    <Card key={plushie.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={plushie.image}
                            alt={plushie.title}
                            className="w-20 h-20 rounded-lg object-cover bg-gray-200 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                              {plushie.title}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg font-bold text-softspot-600">
                                ${plushie.price}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {plushie.condition}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {plushie.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>by {plushie.username}</span>
                              <span>{plushie.likes} ❤️ • {plushie.comments} 💬</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
    </MainLayout>
  );
}
