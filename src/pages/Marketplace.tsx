import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Search } from "lucide-react";

// Mock data - in a real app, this would come from an API
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
    material: "Plush",
    filling: "Cotton",
    species: "Rabbit",
    brand: "Jellycat",
    deliveryMethod: 'Shipping',
    deliveryCost: 5.00,
    tags: ['bunny', 'jellycat', 'mint green']
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
    material: "Cotton",
    filling: "Polyester",
    species: "Bear",
    brand: "Build-A-Bear",
    deliveryMethod: 'Collection',
    deliveryCost: 0,
    tags: ['teddy', 'limited edition', 'anniversary']
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
    material: "Plush",
    filling: "Cotton",
    species: "Bear",
    brand: "Care Bears",
    deliveryMethod: 'Both',
    deliveryCost: 7.50,
    tags: ['care bear', 'vintage', '80s']
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
    material: "Plush",
    filling: "Memory Foam",
    species: "Cat",
    brand: "Squishmallows",
    deliveryMethod: 'Shipping',
    deliveryCost: 3.00,
    tags: ['squishmallow', 'cat', 'gray']
  },
  {
    id: "5",
    image: "https://i.pravatar.cc/300?img=5",
    title: "Disney Winnie the Pooh",
    username: "disneylover",
    likes: 120,
    comments: 30,
    price: 65.00,
    forSale: true,
    condition: "Like New",
    description: "Classic Winnie the Pooh plush from Disney",
    color: "Yellow",
    material: "Polyester",
    filling: "Polyester",
    species: "Bear",
    brand: "Disney",
    deliveryMethod: 'Collection',
    deliveryCost: 0,
    tags: ['winnie the pooh', 'disney', 'classic']
  },
  {
    id: "6",
    image: "https://i.pravatar.cc/300?img=6",
    title: "Jellycat Dragon",
    username: "mythicalplush",
    likes: 76,
    comments: 15,
    price: 55.50,
    forSale: true,
    condition: "New",
    description: "Green dragon plush from Jellycat",
    color: "Green",
    material: "Plush",
    filling: "Cotton",
    species: "Mythical",
    brand: "Jellycat",
    deliveryMethod: 'Both',
    deliveryCost: 6.00,
    tags: ['dragon', 'jellycat', 'mythical']
  },
  {
    id: "7",
    image: "https://i.pravatar.cc/300?img=7",
    title: "Build-A-Bear Puppy",
    username: "buildabearfan",
    likes: 92,
    comments: 18,
    price: 40.00,
    forSale: true,
    condition: "Like New",
    description: "Customizable puppy from Build-A-Bear",
    color: "White",
    material: "Fur",
    filling: "Polyester",
    species: "Dog",
    brand: "Build-A-Bear",
    deliveryMethod: 'Shipping',
    deliveryCost: 4.50,
    tags: ['puppy', 'build-a-bear', 'customizable']
  },
  {
    id: "8",
    image: "https://i.pravatar.cc/300?img=8",
    title: "Care Bears Cheer Bear",
    username: "carebearcollector",
    likes: 110,
    comments: 22,
    price: 70.00,
    forSale: true,
    condition: "Good",
    description: "Vintage Cheer Bear from the Care Bears collection",
    color: "Pink",
    material: "Polyester",
    filling: "Cotton",
    species: "Bear",
    brand: "Care Bears",
    deliveryMethod: 'Collection',
    deliveryCost: 0,
    tags: ['cheer bear', 'care bears', 'vintage']
  },
  {
    id: "9",
    image: "https://i.pravatar.cc/300?img=9",
    title: "Squishmallow Octopus",
    username: "squishlover",
    likes: 60,
    comments: 10,
    price: 38.00,
    forSale: true,
    condition: "New",
    description: "Soft and cuddly octopus squishmallow",
    color: "Blue",
    material: "Plush",
    filling: "Memory Foam",
    species: "Other",
    brand: "Squishmallows",
    deliveryMethod: 'Both',
    deliveryCost: 5.50,
    tags: ['octopus', 'squishmallow', 'cuddly']
  },
  {
    id: "10",
    image: "https://i.pravatar.cc/300?img=10",
    title: "Disney Mickey Mouse",
    username: "mickeyfan",
    likes: 130,
    comments: 25,
    price: 75.00,
    forSale: true,
    condition: "Like New",
    description: "Classic Mickey Mouse plush from Disney",
    color: "Black",
    material: "Cotton",
    filling: "Polyester",
    species: "Other",
    brand: "Disney",
    deliveryMethod: 'Shipping',
    deliveryCost: 6.50,
    tags: ['mickey mouse', 'disney', 'classic']
  }
];

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 150]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPlushie, setSelectedPlushie] = useState<MarketplacePlushie | null>(null);

  const filteredPlushies = mockPlushies
    .filter((plushie) => {
      const searchTerm = searchQuery.toLowerCase();
      const matchesSearch =
        plushie.title.toLowerCase().includes(searchTerm) ||
        plushie.description.toLowerCase().includes(searchTerm) ||
        plushie.username.toLowerCase().includes(searchTerm);

      const isInPriceRange = plushie.price >= priceRange[0] && plushie.price <= priceRange[1];
      const isAvailable = !availableOnly || plushie.forSale;

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
      
      // Brand filter
      if (filters.brand && filters.brand.length > 0) {
        if (!filters.brand.includes(plushie.brand as PlushieBrand)) {
          return false;
        }
      }

      return matchesSearch && isInPriceRange && isAvailable;
    });

  const handleFilterChange = (filterType: keyof MarketplaceFilters, value: string[]) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-gray-600">Buy, sell, and trade plushies with other enthusiasts</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {/* Filters */}
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Customize your search</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      id="search"
                      placeholder="Search plushies..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>Price Range</Label>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <Slider
                    defaultValue={priceRange}
                    max={150}
                    step={5}
                    onValueChange={(value) => setPriceRange(value)}
                  />
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="available">Available Only</Label>
                    <Switch
                      id="available"
                      checked={availableOnly}
                      onCheckedChange={(checked) => setAvailableOnly(checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>Material</Label>
                  <Select onValueChange={(value) => handleFilterChange('material', [value])}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cotton">Cotton</SelectItem>
                      <SelectItem value="Polyester">Polyester</SelectItem>
                      <SelectItem value="Plush">Plush</SelectItem>
                      <SelectItem value="Fur">Fur</SelectItem>
                      <SelectItem value="Velvet">Velvet</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <Label>Filling</Label>
                  <Select onValueChange={(value) => handleFilterChange('filling', [value])}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select filling" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cotton">Cotton</SelectItem>
                      <SelectItem value="Polyester">Polyester</SelectItem>
                      <SelectItem value="Beads">Beads</SelectItem>
                      <SelectItem value="Memory Foam">Memory Foam</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <Label>Species</Label>
                  <Select onValueChange={(value) => handleFilterChange('species', [value])}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select species" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bear">Bear</SelectItem>
                      <SelectItem value="Cat">Cat</SelectItem>
                      <SelectItem value="Dog">Dog</SelectItem>
                      <SelectItem value="Rabbit">Rabbit</SelectItem>
                      <SelectItem value="Mythical">Mythical</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                 <Separator />

                <div>
                  <Label>Brand</Label>
                  <Select onValueChange={(value) => handleFilterChange('brand', [value])}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Build-A-Bear">Build-A-Bear</SelectItem>
                      <SelectItem value="Squishmallows">Squishmallows</SelectItem>
                      <SelectItem value="Jellycat">Jellycat</SelectItem>
                      <SelectItem value="Care Bears">Care Bears</SelectItem>
                      <SelectItem value="Disney">Disney</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plushie Listings */}
          <div className="col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlushies.map((plushie) => (
                <Card key={plushie.id} className="cursor-pointer" onClick={() => handlePlushieClick(plushie)}>
                  <CardHeader>
                    <CardTitle>{plushie.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center">
                        <Avatar className="mr-2 h-5 w-5">
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${plushie.username}`} alt={plushie.username} />
                          <AvatarFallback>{plushie.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{plushie.username}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="aspect-square relative">
                    <img
                      src={plushie.image}
                      alt={plushie.title}
                      className="object-cover w-full h-full rounded-md"
                    />
                    {plushie.forSale && (
                      <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                        For Sale
                      </Badge>
                    )}
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <span>${plushie.price}</span>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <span>{plushie.likes} Likes</span>
                      <span>{plushie.comments} Comments</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Plushie Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedPlushie?.title}</DialogTitle>
            <DialogDescription>
              More details about this plushie
            </DialogDescription>
          </DialogHeader>
          {selectedPlushie && (
            <div className="grid gap-4 py-4">
              <div className="border rounded-md overflow-hidden">
                <img
                  src={selectedPlushie.image}
                  alt={selectedPlushie.title}
                  className="object-cover w-full h-64"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Condition</Label>
                  <p className="text-sm text-gray-500">{selectedPlushie.condition}</p>
                </div>
                <div>
                  <Label>Price</Label>
                  <p className="text-sm text-gray-500">${selectedPlushie.price}</p>
                </div>
                <div>
                  <Label>Material</Label>
                  <p className="text-sm text-gray-500">{selectedPlushie.material}</p>
                </div>
                <div>
                  <Label>Filling</Label>
                  <p className="text-sm text-gray-500">{selectedPlushie.filling}</p>
                </div>
                <div>
                  <Label>Species</Label>
                  <p className="text-sm text-gray-500">{selectedPlushie.species}</p>
                </div>
                 <div>
                  <Label>Brand</Label>
                  <p className="text-sm text-gray-500">{selectedPlushie.brand}</p>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <p className="text-sm text-gray-500">{selectedPlushie.description}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marketplace;
