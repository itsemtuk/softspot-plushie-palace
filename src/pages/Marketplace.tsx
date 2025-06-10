import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, TrendingUp, Users, MapPin, Tag, Grid3X3, List, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { MarketplacePlushie } from "@/types/marketplace";
import { ExtendedPost } from "@/types/core";
import { getMarketplaceListings, saveMarketplaceListings } from "@/utils/storage/localStorageUtils";
import { toast } from "@/components/ui/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { TradeRequestModal } from "@/components/trade/TradeRequestModal";

const brands = ["SoftSpot", "Fluffington", "CuddleCo", "SnuggleBears", "Build-A-Bear", "Jellycat", "Ty", "Steiff"];
const conditions = ["new", "like-new", "good", "fair", "used"];
const sizes = ["mini", "small", "medium", "large", "jumbo"];
const categories = ["teddy-bears", "unicorns", "cats", "dogs", "fantasy", "seasonal", "anime"];

const Marketplace = () => {
  const [plushies, setPlushies] = useState<MarketplacePlushie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([0, 200]);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlushies = () => {
      const listings = getMarketplaceListings();
      const updatedPlushies = listings.map(plushie => ({
        ...plushie,
        price: plushie.price !== undefined ? plushie.price : Math.floor(Math.random() * 100) + 10,
        forSale: plushie.forSale !== undefined ? plushie.forSale : true,
        title: plushie.title || 'Adorable Plushie',
        condition: plushie.condition || conditions[Math.floor(Math.random() * conditions.length)],
        brand: plushie.brand || brands[Math.floor(Math.random() * brands.length)],
        size: plushie.size || sizes[Math.floor(Math.random() * sizes.length)]
      }));
      setPlushies(updatedPlushies);
    };

    fetchPlushies();
  }, []);

  const filteredPlushies = useMemo(() => {
    let filtered = plushies.filter(plushie => {
      const searchMatch = plushie.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          plushie.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const brandMatch = !selectedBrand || plushie.brand?.toLowerCase() === selectedBrand.toLowerCase();
      const priceMatch = plushie.price !== undefined && plushie.price >= priceRange[0] && plushie.price <= priceRange[1];
      const conditionMatch = !selectedCondition || plushie.condition?.toLowerCase() === selectedCondition.toLowerCase();
      const sizeMatch = !selectedSize || plushie.size?.toLowerCase() === selectedSize.toLowerCase();

      return searchMatch && brandMatch && priceMatch && conditionMatch && sizeMatch;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "popular":
          return (b.likes || 0) - (a.likes || 0);
        default:
          return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime();
      }
    });

    return filtered;
  }, [plushies, searchQuery, selectedBrand, priceRange, selectedCondition, selectedSize, sortBy]);

  const handleQuickAdd = (plushie: MarketplacePlushie) => {
    const extendedPost: ExtendedPost = {
      ...plushie,
      user_id: plushie.userId || 'unknown',
      content: plushie.description || '',
      createdAt: plushie.timestamp || new Date().toISOString(),
      created_at: plushie.timestamp || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: plushie.tags || []
    };
    
    const currentListings = getMarketplaceListings();
    saveMarketplaceListings([...currentListings, extendedPost]);
    
    toast({
      title: "Added to Collection",
      description: `${plushie.title} has been added to your collection!`,
    });
  };

  const handleViewDetails = (plushieId: string) => {
    navigate(`/checkout/${plushieId}`);
  };

  const clearFilters = () => {
    setSelectedBrand(null);
    setSelectedCondition(null);
    setSelectedSize(null);
    setSelectedCategory(null);
    setPriceRange([0, 200]);
    setSearchQuery("");
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <MarketplaceHeader />

        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")} className="rounded-full border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="rounded-full border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search for plushies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-full border-2 focus:border-softspot-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>
            <Select onValueChange={setSortBy} defaultValue={sortBy}>
              <SelectTrigger className="rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={clearFilters} variant="outline" className="w-full rounded-full border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
              Clear Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`md:col-span-1 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <Card className="sticky top-20 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] w-full rounded-md">
                  <div className="space-y-6 p-2">
                    <div>
                      <Label className="text-sm font-medium mb-3 block text-gray-700 dark:text-gray-300">Price Range</Label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={200}
                        step={5}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block text-gray-700 dark:text-gray-300">Brand</Label>
                      <div className="space-y-2">
                        {brands.map((brand) => (
                          <div key={brand} className="flex items-center space-x-2">
                            <Checkbox
                              id={`brand-${brand}`}
                              checked={selectedBrand === brand}
                              onCheckedChange={(checked) =>
                                setSelectedBrand(checked ? brand : null)
                              }
                              className="rounded"
                            />
                            <Label htmlFor={`brand-${brand}`} className="text-sm text-gray-700 dark:text-gray-300">
                              {brand}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block text-gray-700 dark:text-gray-300">Condition</Label>
                      <div className="space-y-2">
                        {conditions.map((condition) => (
                          <div key={condition} className="flex items-center space-x-2">
                            <Checkbox
                              id={`condition-${condition}`}
                              checked={selectedCondition === condition}
                              onCheckedChange={(checked) =>
                                setSelectedCondition(checked ? condition : null)
                              }
                              className="rounded"
                            />
                            <Label htmlFor={`condition-${condition}`} className="text-sm capitalize text-gray-700 dark:text-gray-300">
                              {condition}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block text-gray-700 dark:text-gray-300">Size</Label>
                      <div className="space-y-2">
                        {sizes.map((size) => (
                          <div key={size} className="flex items-center space-x-2">
                            <Checkbox
                              id={`size-${size}`}
                              checked={selectedSize === size}
                              onCheckedChange={(checked) =>
                                setSelectedSize(checked ? size : null)
                              }
                              className="rounded"
                            />
                            <Label htmlFor={`size-${size}`} className="text-sm capitalize text-gray-700 dark:text-gray-300">
                              {size}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filteredPlushies.length} plushies found
              </p>
            </div>

            {filteredPlushies.length === 0 ? (
              <Card className="text-center py-12 rounded-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent>
                  <div className="text-gray-500 dark:text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No plushies found</h3>
                    <p>Try adjusting your search or filters</p>
                  </div>
                  <Button onClick={clearFilters} className="rounded-full">Clear all filters</Button>
                </CardContent>
              </Card>
            ) : (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {filteredPlushies.map((plushie) => (
                  <Card key={plushie.id} className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden rounded-2xl border-0 border-gray-200 dark:border-gray-700">
                    <div className="relative">
                      <AspectRatio ratio={4 / 3}>
                        <img
                          src={plushie.image || "/placeholder.svg"}
                          alt={plushie.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      </AspectRatio>
                      {plushie.forSale === false && (
                        <Badge className="absolute top-3 left-3 bg-red-500 text-white rounded-full">Sold</Badge>
                      )}
                      {plushie.condition && (
                        <Badge className="absolute top-3 right-3 bg-green-500 text-white capitalize rounded-full">
                          {plushie.condition}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold line-clamp-1">{plushie.title}</h3>
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm ml-1">4.5</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{plushie.description || "A wonderful plushie perfect for cuddling!"}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-wrap gap-2">
                          {plushie.brand && (
                            <Badge variant="outline" className="text-xs rounded-full">{plushie.brand}</Badge>
                          )}
                          {plushie.size && (
                            <Badge variant="outline" className="text-xs rounded-full">{plushie.size}</Badge>
                          )}
                        </div>
                        <span className="text-xl font-bold text-softspot-600">${plushie.price}</span>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          size="sm" 
                          onClick={() => handleQuickAdd(plushie)}
                          className="flex-1 bg-softspot-500 hover:bg-softspot-600 rounded-full"
                        >
                          Add to Collection
                        </Button>
                        <TradeRequestModal
                          listingId={plushie.id}
                          listingTitle={plushie.title || 'Plushie'}
                          sellerId={plushie.userId || 'unknown'}
                          trigger={
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 rounded-full border-softspot-200 text-softspot-600 hover:bg-softspot-50 dark:border-softspot-700 dark:text-softspot-400 dark:hover:bg-softspot-900"
                            >
                              Request Trade
                            </Button>
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Marketplace;
