
import React, { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Filter, SearchIcon, Heart, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MarketplacePlushie } from '@/types/marketplace';
import { getMarketplaceListings } from '@/utils/storage/localStorageUtils';
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "@/components/navigation/MobileNav";
import { PlushieDetailDialog } from "@/components/marketplace/PlushieDetailDialog";

const Discover = () => {
  const [listings, setListings] = useState<MarketplacePlushie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredListings, setFilteredListings] = useState<MarketplacePlushie[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPlushie, setSelectedPlushie] = useState<MarketplacePlushie | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Load listings from local storage
    try {
      console.log("Loading marketplace listings in Discover...");
      const storedListings = getMarketplaceListings();
      console.log("Loaded listings:", storedListings);
      setListings(storedListings || []);
      setFilteredListings(storedListings || []);
    } catch (error) {
      console.error("Error loading marketplace listings:", error);
    }
  }, []);

  useEffect(() => {
    // Apply search filter
    const searchedListings = listings.filter(listing =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply price range filter
    const priceFilteredListings = searchedListings.filter(
      listing => listing.price >= priceRange[0] && listing.price <= priceRange[1]
    );

    setFilteredListings(priceFilteredListings);
  }, [searchQuery, listings, priceRange]);

  const handleSort = () => {
    const sortedListings = [...filteredListings].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    setFilteredListings(sortedListings);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handlePlushieClick = (plushie: MarketplacePlushie) => {
    console.log("Plushie clicked:", plushie);
    setSelectedPlushie(plushie);
    setIsDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? <MobileNav /> : <Navbar />}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full md:w-1/2">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search for plushies..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-4 py-2">
                <h4 className="text-sm font-medium">Price Range</h4>
                <div className="flex items-center gap-2">
                  <Label>From: ${priceRange[0]}</Label>
                  <Label>To: ${priceRange[1]}</Label>
                </div>
                <Slider
                  defaultValue={priceRange}
                  max={1000}
                  step={10}
                  onValueChange={handlePriceRangeChange}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <Card 
                key={listing.id} 
                className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
                onClick={() => handlePlushieClick(listing)}
              >
                <div className="relative">
                  <AspectRatio ratio={1 / 1}>
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-2 truncate">{listing.title}</h3>
                  <p className="text-gray-500 text-sm">${listing.price}</p>
                  <div className="flex items-center mt-2">
                    <Heart className="h-4 w-4 text-gray-500 mr-1" />
                    <span>{listing.likes || 0}</span>
                    <MessageSquare className="h-4 w-4 text-gray-500 ml-2 mr-1" />
                    <span>{listing.comments || 0}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p>No plushies found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </main>

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

export default Discover;
