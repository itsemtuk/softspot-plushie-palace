
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PlushieCard } from "@/components/PlushieCard";
import { marketplacePlushies } from "@/data/plushies";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FilterPanel } from "@/components/marketplace/FilterPanel";
import { MarketplaceFilters, MarketplacePlushie } from "@/types/marketplace";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MarketplaceNav } from "@/components/marketplace/MarketplaceNav";
import PlushieDetailDialog from "@/components/marketplace/PlushieDetailDialog";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  const [selectedPlushie, setSelectedPlushie] = useState<MarketplacePlushie | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const filteredPlushies = marketplacePlushies
    .filter(plushie => {
      // Apply search filter
      const matchesSearch = 
        plushie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plushie.username.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply category filters
      const matchesColor = !filters.color?.length || filters.color.includes(plushie.color);
      const matchesMaterial = !filters.material?.length || filters.material.includes(plushie.material);
      const matchesFilling = !filters.filling?.length || filters.filling.includes(plushie.filling);
      const matchesSpecies = !filters.species?.length || filters.species.includes(plushie.species);
      const matchesBrand = !filters.brand?.length || filters.brand.includes(plushie.brand);
      
      return matchesSearch && matchesColor && matchesMaterial && 
             matchesFilling && matchesSpecies && matchesBrand;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
      if (sortBy === "popular") return b.likes - a.likes;
      return b.id.localeCompare(a.id);
    });

  const openPlushieDialog = (plushie: MarketplacePlushie) => {
    setSelectedPlushie(plushie);
    setDialogOpen(true);
  };

  const closePlushieDialog = () => {
    setDialogOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="bg-softspot-400 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-4">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold">SoftSpot Marketplace</h1>
          <p className="mt-2 text-softspot-100 max-w-2xl mx-auto">
            Find rare collectibles, handmade creations, and more from our community of plushie lovers.
          </p>
        </div>
      </div>
      
      <MarketplaceNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <FilterPanel 
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>
          
          {/* Main Content */}
          <div className="flex-grow">
            <div className="bg-white shadow-sm rounded-lg p-4 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search marketplace..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2 md:w-56">
                  <Select
                    value={sortBy}
                    onValueChange={setSortBy}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="bg-softspot-400 hover:bg-softspot-500 text-white whitespace-nowrap">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  List Item
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlushies.map((plushie) => (
                <div key={plushie.id} onClick={() => openPlushieDialog(plushie)} className="cursor-pointer">
                  <PlushieCard 
                    id={plushie.id}
                    image={plushie.image}
                    title={plushie.title}
                    username={plushie.username}
                    likes={plushie.likes}
                    comments={plushie.comments}
                    price={plushie.price}
                    forSale={plushie.forSale}
                    variant="marketplace"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {selectedPlushie && (
        <PlushieDetailDialog
          isOpen={dialogOpen}
          onClose={closePlushieDialog}
          plushie={selectedPlushie}
        />
      )}
    </div>
  );
};

export default Marketplace;
