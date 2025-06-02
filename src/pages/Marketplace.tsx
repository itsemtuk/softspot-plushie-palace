
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
        size: plushie.size || sizes[Math.floor(Math.random() * sizes.length)],
        rating: plushie.rating || (Math.random() * 2 + 3).toFixed(1)
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

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "popular":
          return (b.likes || 0) - (a.likes || 0);
        case "rating":
          return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
        default: // newest
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
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
              <p className="text-gray-600">Discover and collect amazing plushies from our community</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Search and Sort */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search for plushies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select onValueChange={setSortBy} defaultValue={sortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={clearFilters} variant="outline" className="w-full">
              Clear Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`md:col-span-1 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] w-full rounded-md">
                  <div className="space-y-6 p-2">
                    {/* Price Range */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Price Range</Label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={200}
                        step={5}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>

                    {/* Brand Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Brand</Label>
                      <div className="space-y-2">
                        {brands.map((brand) => (
                          <div key={brand} className="flex items-center space-x-2">
                            <Checkbox
                              id={`brand-${brand}`}
                              checked={selectedBrand === brand}
                              onCheckedChange={(checked) =>
                                setSelectedBrand(checked ? brand : null)
                              }
                            />
                            <Label htmlFor={`brand-${brand}`} className="text-sm">
                              {brand}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Condition Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Condition</Label>
                      <div className="space-y-2">
                        {conditions.map((condition) => (
                          <div key={condition} className="flex items-center space-x-2">
                            <Checkbox
                              id={`condition-${condition}`}
                              checked={selectedCondition === condition}
                              onCheckedChange={(checked) =>
                                setSelectedCondition(checked ? condition : null)
                              }
                            />
                            <Label htmlFor={`condition-${condition}`} className="text-sm capitalize">
                              {condition}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Size Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Size</Label>
                      <div className="space-y-2">
                        {sizes.map((size) => (
                          <div key={size} className="flex items-center space-x-2">
                            <Checkbox
                              id={`size-${size}`}
                              checked={selectedSize === size}
                              onCheckedChange={(checked) =>
                                setSelectedSize(checked ? size : null)
                              }
                            />
                            <Label htmlFor={`size-${size}`} className="text-sm capitalize">
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

          {/* Results Grid */}
          <div className="md:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredPlushies.length} plushies found
              </p>
            </div>

            {filteredPlushies.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-gray-500 mb-4">
                    <Search className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No plushies found</h3>
                    <p>Try adjusting your search or filters</p>
                  </div>
                  <Button onClick={clearFilters}>Clear all filters</Button>
                </CardContent>
              </Card>
            ) : (
              <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {filteredPlushies.map((plushie) => (
                  <Card key={plushie.id} className="bg-white shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
                    <div className="relative">
                      <AspectRatio ratio={4 / 3}>
                        <img
                          src={plushie.image || "/placeholder.svg"}
                          alt={plushie.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      </AspectRatio>
                      {plushie.forSale === false && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white">Sold</Badge>
                      )}
                      {plushie.condition && (
                        <Badge className="absolute top-2 right-2 bg-green-500 text-white capitalize">
                          {plushie.condition}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold line-clamp-1">{plushie.title}</h3>
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm ml-1">{plushie.rating || "4.5"}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{plushie.description || "A wonderful plushie perfect for cuddling!"}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-wrap gap-1">
                          {plushie.brand && (
                            <Badge variant="outline" className="text-xs">{plushie.brand}</Badge>
                          )}
                          {plushie.size && (
                            <Badge variant="outline" className="text-xs">{plushie.size}</Badge>
                          )}
                        </div>
                        <span className="text-lg font-bold text-softspot-600">${plushie.price}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleQuickAdd(plushie)}
                          className="flex-1 bg-softspot-500 hover:bg-softspot-600"
                        >
                          Add to Collection
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewDetails(plushie.id)}
                          className="flex-1"
                        >
                          View Details
                        </Button>
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
