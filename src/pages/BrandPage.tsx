import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  MarketplacePlushie, 
  PlushieCondition, 
  PlushieMaterial, 
  PlushieFilling, 
  PlushieSpecies,
  PlushieBrand,
  MarketplaceFilters
} from "@/types/marketplace";
import { Navbar } from "@/components/Navbar";

// Mock data for plushies - replace with actual data fetching later
const mockPlushies: MarketplacePlushie[] = [
  {
    id: "1",
    image: "https://i.pravatar.cc/300?img=1",
    title: "Mint Jellycat Bunny",
    username: "plushielover",
    likes: 24,
    comments: 5,
    price: 45.99,
    forSale: true,
    condition: "Like New",
    description: "Adorable mint green bunny, super soft",
    color: "Mint",
    size: "Small",
    material: "Plush",
    filling: "Cotton",
    species: "Rabbit",
    brand: "Jellycat",
    deliveryMethod: "Shipping",
    deliveryCost: 5.99,
    tags: ["bunny", "jellycat", "mint"]
  },
  {
    id: "2",
    image: "https://i.pravatar.cc/300?img=2",
    title: "Limited Edition Teddy",
    username: "teddycollector",
    likes: 42,
    comments: 8,
    price: 89.99,
    forSale: true,
    condition: "New",
    description: "Limited edition anniversary teddy bear",
    color: "Brown",
    size: "Medium",
    material: "Cotton",
    filling: "Polyester",
    species: "Bear",
    brand: "Build-A-Bear",
    deliveryMethod: "Collection",
    tags: ["teddy", "bear", "limited edition"]
  },
  {
    id: "3",
    image: "https://i.pravatar.cc/300?img=3",
    title: "Vintage Care Bear",
    username: "vintagetoylover",
    likes: 67,
    comments: 12,
    price: 120,
    forSale: true,
    condition: "Good",
    description: "Original 80's Care Bear in good condition",
    color: "Pink",
    size: "Medium",
    material: "Plush",
    filling: "Cotton",
    species: "Bear",
    brand: "Care Bears",
    deliveryMethod: "Both",
    deliveryCost: 7.50,
    tags: ["care bear", "vintage", "80s"]
  },
  {
    id: "4",
    image: "https://i.pravatar.cc/300?img=4",
    title: "Squishmallow Cat",
    username: "squishfan",
    likes: 89,
    comments: 24,
    price: 34.99,
    forSale: true,
    condition: "New",
    description: "Super soft gray cat squishmallow",
    color: "Gray",
    size: "Small",
    material: "Plush",
    filling: "Memory Foam",
    species: "Cat",
    brand: "Squishmallows",
    deliveryMethod: "Shipping",
    deliveryCost: 4.99,
    tags: ["squishmallow", "cat", "soft"]
  },
  {
    id: "5",
    image: "https://i.pravatar.cc/300?img=5",
    title: "Disney Winnie the Pooh",
    username: "disneylover",
    likes: 55,
    comments: 10,
    price: 55.00,
    forSale: true,
    condition: "Like New",
    description: "Classic Winnie the Pooh plush from Disney",
    color: "Yellow",
    size: "Medium",
    material: "Polyester",
    filling: "Polyester",
    species: "Bear",
    brand: "Disney",
    deliveryMethod: "Collection",
    tags: ["winnie the pooh", "disney", "classic"]
  },
  {
    id: "6",
    image: "https://i.pravatar.cc/300?img=6",
    title: "Mythical Dragon Plush",
    username: "fantasyfan",
    likes: 72,
    comments: 15,
    price: 68.50,
    forSale: true,
    condition: "New",
    description: "Beautiful dragon plush with intricate details",
    color: "Blue",
    size: "Large",
    material: "Fur",
    filling: "Polyester",
    species: "Mythical",
    brand: "Other",
    deliveryMethod: "Both",
    deliveryCost: 9.00,
    tags: ["dragon", "mythical", "fantasy"]
  }
];

const BrandPage = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPlushie, setSelectedPlushie] = useState<MarketplacePlushie | null>(null);
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Filter plushies based on the brandId
  const brandPlushies = mockPlushies.filter(plushie => plushie.brand.toLowerCase() === brandId?.toLowerCase());

  // Filter plushies based on search query
  const searchedPlushies = brandPlushies.filter(plushie =>
    plushie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plushie.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPlushies = searchedPlushies
  .filter((plushie) => {
    // Material filter
    if (filters.material && filters.material.length > 0) {
      if (!filters.material.includes(plushie.material as PlushieMaterial)) {
        return false;
      }
    }
    
    // Filling filter
    if (filters.filling && filters.filling.length > 0) {
      if (!filters.filling.includes(plushie.filling as PlushieFilling)) {
        return false;
      }
    }
    
    // Species filter
    if (filters.species && filters.species.length > 0) {
      if (!filters.species.includes(plushie.species as PlushieSpecies)) {
        return false;
      }
    }
    
    return true;
  });

  const handleFilterChange = (filterType: keyof MarketplaceFilters, value: string) => {
    setFilters(prevFilters => {
      const filterValues = prevFilters[filterType] || [];
      if (filterValues.includes(value)) {
        return {
          ...prevFilters,
          [filterType]: filterValues.filter(v => v !== value),
        };
      } else {
        return {
          ...prevFilters,
          [filterType]: [...filterValues, value],
        };
      }
    });
  };

  const handlePlushieClick = (plushie: MarketplacePlushie) => {
    setSelectedPlushie({
      ...plushie,
      condition: plushie.condition as PlushieCondition,
      material: plushie.material as PlushieMaterial,
      filling: plushie.filling as PlushieFilling,
      species: plushie.species as PlushieSpecies,
      brand: plushie.brand as PlushieBrand
    });
    setIsDetailsOpen(true);
  };

  const availableMaterials = [...new Set(brandPlushies.map(plushie => plushie.material))];
  const availableFillings = [...new Set(brandPlushies.map(plushie => plushie.filling))];
  const availableSpecies = [...new Set(brandPlushies.map(plushie => plushie.species))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold capitalize">{brandId} Plushies</h1>
          <p className="text-gray-600">Explore our collection of {brandId} plushies</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <Input
            type="text"
            placeholder="Search plushies..."
            className="mb-4 md:mb-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Filter Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Filter Plushies</SheetTitle>
                <SheetDescription>
                  Filter by material, filling, and species.
                </SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="py-4">
                  <Accordion type="multiple" collapsible>
                    <AccordionItem value="materials">
                      <AccordionTrigger>Material</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-2">
                          {availableMaterials.map(material => (
                            <div key={material} className="flex items-center space-x-2">
                              <Checkbox
                                id={`material-${material}`}
                                value={material}
                                checked={filters.material?.includes(material)}
                                onCheckedChange={() => handleFilterChange('material', material)}
                              />
                              <Label htmlFor={`material-${material}`}>{material}</Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="fillings">
                      <AccordionTrigger>Filling</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-2">
                          {availableFillings.map(filling => (
                            <div key={filling} className="flex items-center space-x-2">
                              <Checkbox
                                id={`filling-${filling}`}
                                value={filling}
                                checked={filters.filling?.includes(filling)}
                                onCheckedChange={() => handleFilterChange('filling', filling)}
                              />
                              <Label htmlFor={`filling-${filling}`}>{filling}</Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="species">
                      <AccordionTrigger>Species</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-2">
                          {availableSpecies.map(species => (
                            <div key={species} className="flex items-center space-x-2">
                              <Checkbox
                                id={`species-${species}`}
                                value={species}
                                checked={filters.species?.includes(species)}
                                onCheckedChange={() => handleFilterChange('species', species)}
                              />
                              <Label htmlFor={`species-${species}`}>{species}</Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>

        {/* Plushie Grid */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {filteredPlushies.length > 0 ? (
            filteredPlushies.map(plushie => (
              <Card key={plushie.id} className="cursor-pointer" onClick={() => handlePlushieClick(plushie)}>
                <div className="aspect-w-4 aspect-h-3 relative overflow-hidden rounded-md">
                  <img
                    src={plushie.image}
                    alt={plushie.title}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold truncate">{plushie.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-500 truncate">{plushie.description}</CardDescription>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-softspot-500 font-medium">${plushie.price}</span>
                    {plushie.forSale ? (
                      <Badge variant="secondary">For Sale</Badge>
                    ) : (
                      <Badge variant="outline">Not For Sale</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No plushies found for {brandId}.</p>
            </div>
          )}
        </div>
      </div>

      {/* Plushie Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{selectedPlushie?.title}</SheetTitle>
            <SheetDescription>
              Learn more about this plushie.
            </SheetDescription>
          </SheetHeader>
          {selectedPlushie && (
            <div className="py-4">
              <div className="aspect-w-4 aspect-h-3 relative overflow-hidden rounded-md mb-4">
                <img
                  src={selectedPlushie.image}
                  alt={selectedPlushie.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="space-y-2">
                <p className="text-gray-700"><strong>Description:</strong> {selectedPlushie.description}</p>
                <p className="text-gray-700"><strong>Condition:</strong> {selectedPlushie.condition}</p>
                <p className="text-gray-700"><strong>Material:</strong> {selectedPlushie.material}</p>
                <p className="text-gray-700"><strong>Filling:</strong> {selectedPlushie.filling}</p>
                <p className="text-gray-700"><strong>Species:</strong> {selectedPlushie.species}</p>
                <p className="text-gray-700"><strong>Brand:</strong> {selectedPlushie.brand}</p>
                <p className="text-gray-700"><strong>Price:</strong> ${selectedPlushie.price}</p>
                <p className="text-gray-700"><strong>Seller:</strong> @{selectedPlushie.username}</p>
                {selectedPlushie.deliveryMethod && (
                  <p className="text-gray-700">
                    <strong>Delivery:</strong> {selectedPlushie.deliveryMethod}
                    {selectedPlushie.deliveryCost && ` - $${selectedPlushie.deliveryCost}`}
                  </p>
                )}
                {selectedPlushie.tags && selectedPlushie.tags.length > 0 && (
                  <p className="text-gray-700">
                    <strong>Tags:</strong> {selectedPlushie.tags.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BrandPage;
