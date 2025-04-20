import { useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { MarketplaceNav } from "@/components/marketplace/MarketplaceNav";
import { FilterPanel } from "@/components/marketplace/FilterPanel";
import { PlushieCard } from "@/components/PlushieCard";
import { PlushieDetailDialog } from "@/components/marketplace/PlushieDetailDialog";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MarketplacePlushie, MarketplaceFilters } from "@/types/marketplace";
import { CurrencyConverter } from "@/components/marketplace/CurrencyConverter";

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
        if (!filters.material.includes(plushie.material)) {
          return false;
        }
      }
      
      // Filling filter
      if (filters.filling && filters.filling.length > 0) {
        if (!filters.filling.includes(plushie.filling)) {
          return false;
        }
      }
      
      // Species filter
      if (filters.species && filters.species.length > 0) {
        if (!filters.species.includes(plushie.species)) {
          return false;
        }
      }
      
      // Brand filter
      if (filters.brand && filters.brand.length > 0) {
        if (!filters.brand.includes(plushie.brand)) {
          return false;
        }
      }

      return matchesSearch && isInPriceRange && isAvailable;
    });

  const handleFilterUpdate = (newFilters: MarketplaceFilters) => {
    setFilters(newFilters);
  };

  const handlePlushieClick = (plushie: MarketplacePlushie) => {
    setSelectedPlushie(plushie);
    setIsDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="relative h-[300px] bg-gradient-to-r from-softspot-100 to-softspot-200">
        <div className="absolute inset-0 bg-opacity-50 bg-white">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Marketplace</h1>
            <p className="text-lg text-gray-700 max-w-2xl">
              Discover unique plushies from collectors worldwide. Buy, sell, and trade your favorite companions.
            </p>
          </div>
        </div>
      </div>

      <MarketplaceNav />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Search and Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex-1 relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search plushies..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <CurrencyConverter price={0} className="ml-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters */}
            <div className="col-span-1 md:block hidden">
              <FilterPanel filters={filters} onFilterChange={handleFilterUpdate} />
            </div>

            {/* Plushie Grid */}
            <div className="col-span-1 md:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlushies.map((plushie) => (
                  <div 
                    key={plushie.id} 
                    className="cursor-pointer transform transition-transform hover:scale-[1.02]"
                    onClick={() => handlePlushieClick(plushie)}
                  >
                    <PlushieCard 
                      {...plushie} 
                      variant="marketplace"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedPlushie && (
        <PlushieDetailDialog 
          isOpen={isDetailsOpen} 
          onClose={() => setIsDetailsOpen(false)} 
          plushie={selectedPlushie}
        />
      )}
    </div>
  );
};

export default Marketplace;
