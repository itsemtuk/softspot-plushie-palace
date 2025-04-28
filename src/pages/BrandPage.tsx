import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PostDialog } from "@/components/PostDialog";
import { BrandHeader } from "@/components/brand/BrandHeader";
import { BrandFilterPanel } from "@/components/brand/BrandFilterPanel";
import { PlushieGrid } from "@/components/brand/PlushieGrid";
import { CommunityPosts } from "@/components/brand/CommunityPosts";
import { MarketplacePlushie, PlushieCondition, PlushieMaterial, PlushieFilling, PlushieSpecies, MarketplaceFilters, Post } from "@/types/marketplace";
import { feedPosts, marketplacePlushies } from "@/data/plushies";

// Define Brand interface
interface Brand {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  instagram: string;
  featured: boolean;
}

// Mock brand data
const mockBrands: Brand[] = [
  {
    id: "jellycat",
    name: "Jellycat",
    description: "Creators of quirky, original and innovative soft toys.",
    logo: "https://www.jellycat.com/skin/frontend/jellycat/default/images/logo.svg",
    website: "https://www.jellycat.com/",
    instagram: "https://www.instagram.com/jellycat/",
    featured: true,
  },
  {
    id: "squishmallows",
    name: "Squishmallows",
    description: "Super soft, collectible plush toys.",
    logo: "https://squishmallows.com/wp-content/uploads/2023/03/SQ_Logo_Horizontal_FullColor.svg",
    website: "https://squishmallows.com/",
    instagram: "https://www.instagram.com/squishmallows/",
    featured: true,
  },
  {
    id: "buildabear",
    name: "Build-A-Bear",
    description: "A make-your-own stuffed animal interactive retail-entertainment experience.",
    logo: "https://www.buildabear.com/on/demandware.static/Sites-buildabear-Site/-/default/dw9949854a/images/svg/logo.svg",
    website: "https://www.buildabear.com/",
    instagram: "https://www.instagram.com/buildabear/",
    featured: true,
  },
  {
    id: "carebears",
    name: "Care Bears",
    description: "Colorful, huggable bears spreading messages of caring and sharing.",
    logo: "https://m.media-amazon.com/images/I/71zR99oJIMS._AC_SL1500_.jpg",
    website: "https://www.carebears.com/",
    instagram: "https://www.instagram.com/carebears/",
    featured: true,
  },
  {
    id: "disney",
    name: "Disney",
    description: "Magical plush toys featuring beloved Disney characters.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Walt_Disney_Pictures_logo_%282023%29.svg/2560px-Walt_Disney_Pictures_logo_%282023%29.svg.png",
    website: "https://www.shopdisney.com/",
    instagram: "https://www.instagram.com/disney/",
    featured: true,
  },
];

// Mock data for brand-specific plushies (replace with actual data fetching)
const mockBrandPlushies: MarketplacePlushie[] = [
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

const BrandPage = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 150]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPlushie, setSelectedPlushie] = useState<MarketplacePlushie | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const foundBrand = mockBrands.find((b) => b.id === brandId);
    setBrand(foundBrand || null);
  }, [brandId]);

  const filteredPlushies = mockBrandPlushies.filter((plushie) => {
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

    return matchesSearch && isInPriceRange && isAvailable && plushie.brand?.toLowerCase() === brandId?.toLowerCase();
  });

  const handleFilterChange = (filterType: keyof MarketplaceFilters, value: string[]) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handlePlushieClick = (plushie: MarketplacePlushie) => {
    setSelectedPlushie(plushie);
    setIsDetailsOpen(true);
  };

  // Type assertion to ensure feedPosts is treated as Post[]
  const typedFeedPosts = feedPosts as Post[];

  const brandPosts = typedFeedPosts.filter(post => 
    post.tags?.includes(brandId || '')
  );

  const filteredPosts = brandPosts.filter(post =>
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  if (!brand) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Brand not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <BrandHeader brand={brand} />

        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1">
            <BrandFilterPanel
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              availableOnly={availableOnly}
              setAvailableOnly={setAvailableOnly}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="col-span-3">
            <h2 className="text-xl font-bold mb-4">{brand.name} Plushies</h2>
            <PlushieGrid 
              plushies={filteredPlushies}
              onPlushieClick={handlePlushieClick}
            />

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Community Posts</h2>
              <CommunityPosts
                posts={filteredPosts}
                onPostClick={(post) => {
                  setSelectedPost(post);
                  setDialogOpen(true);
                }}
              />
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

      {/* Post Dialog */}
      <PostDialog 
        isOpen={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        post={selectedPost} 
      />
    </div>
  );
};

export default BrandPage;
