
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import MainLayout from "@/components/layout/MainLayout";
import { MarketplacePlushie } from "@/types/marketplace";
import { ExtendedPost } from "@/types/core";
import { getMarketplaceListings, saveMarketplaceListings } from "@/utils/storage/localStorageUtils";
import { toast } from "@/components/ui/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";

const brands = ["SoftSpot", "Fluffington", "CuddleCo", "SnuggleBears"];
const conditions = ["new", "used", "refurbished"];
const sizes = ["small", "medium", "large", "extra-large"];

const Marketplace = () => {
  const [plushies, setPlushies] = useState<MarketplacePlushie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlushies = () => {
      const listings = getMarketplaceListings();
      // Ensure price and forSale are defined for each plushie
      const updatedPlushies = listings.map(plushie => ({
        ...plushie,
        price: plushie.price !== undefined ? plushie.price : 0,
        forSale: plushie.forSale !== undefined ? plushie.forSale : true,
        name: plushie.title || plushie.name || 'Untitled'
      }));
      setPlushies(updatedPlushies);
    };

    fetchPlushies();
  }, []);

  const filteredPlushies = useMemo(() => {
    return plushies.filter(plushie => {
      const searchMatch = plushie.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          plushie.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const brandMatch = !selectedBrand || plushie.brand?.toLowerCase() === selectedBrand.toLowerCase();
      const priceMatch = plushie.price !== undefined && plushie.price >= priceRange[0] && plushie.price <= priceRange[1];
      const conditionMatch = !selectedCondition || plushie.condition?.toLowerCase() === selectedCondition.toLowerCase();
      const sizeMatch = !selectedSize || plushie.size?.toLowerCase() === selectedSize.toLowerCase();

      return searchMatch && brandMatch && priceMatch && conditionMatch && sizeMatch;
    });
  }, [plushies, searchQuery, selectedBrand, priceRange, selectedCondition, selectedSize]);

  const handleQuickAdd = (plushie: MarketplacePlushie) => {
    // Convert MarketplacePlushie to ExtendedPost format for storage
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
      description: `${plushie.name} has been added to your collection!`,
    });
  };

  const handleViewDetails = (plushieId: string) => {
    navigate(`/checkout/${plushieId}`);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Marketplace</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  type="search"
                  placeholder="Search for plushies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <Button className="w-full">
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] w-full rounded-md border">
                  <div className="space-y-4 p-4">
                    <div>
                      <Label>Brand</Label>
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
                            <Label htmlFor={`brand-${brand}`} className="capitalize">
                              {brand}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Price Range</Label>
                      <Slider
                        defaultValue={priceRange}
                        max={100}
                        step={1}
                        onValueChange={(value) => setPriceRange(value)}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>

                    <div>
                      <Label>Condition</Label>
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
                            <Label htmlFor={`condition-${condition}`} className="capitalize">
                              {condition}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Size</Label>
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
                            <Label htmlFor={`size-${size}`} className="capitalize">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlushies.map((plushie) => (
                <Card key={plushie.id} className="bg-white shadow-sm">
                  <div className="relative">
                    <AspectRatio ratio={4 / 3}>
                      <img
                        src={plushie.image}
                        alt={plushie.title}
                        className="object-cover rounded-md"
                      />
                    </AspectRatio>
                    {plushie.forSale === false && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">Sold</Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold">{plushie.title}</h3>
                    <p className="text-gray-500">${plushie.price}</p>
                    <div className="flex justify-between mt-4">
                      <Button size="sm" onClick={() => handleQuickAdd(plushie)}>
                        Add to Collection
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleViewDetails(plushie.id)}>
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Marketplace;
