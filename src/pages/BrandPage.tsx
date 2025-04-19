
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { PlushieCard } from "@/components/PlushieCard";
import { marketplacePlushies } from "@/data/plushies";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FilterPanel } from "@/components/marketplace/FilterPanel";
import { MarketplaceFilters, MarketplacePlushie } from "@/types/marketplace";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PlushieDetailDialog from "@/components/marketplace/PlushieDetailDialog";

const brandLogos: Record<string, string> = {
  "build-a-bear": "https://images.unsplash.com/photo-1558679908-541bcf1249ff?auto=format&fit=crop&q=80&w=1974",
  "squishmallows": "https://images.unsplash.com/photo-1584155828260-3f126cfcfb45?auto=format&fit=crop&q=80&w=1974",
  "jellycat": "https://images.unsplash.com/photo-1559454403-b8fb88521729?auto=format&fit=crop&q=80&w=1973",
  "gund": "https://images.unsplash.com/photo-1563396983906-b3795482a59a?auto=format&fit=crop&q=80&w=1972",
  "ty": "https://images.unsplash.com/photo-1535982368253-05d640fe0755?auto=format&fit=crop&q=80&w=1974",
};

const brandDisplayNames: Record<string, string> = {
  "build-a-bear": "Build-A-Bear Workshop",
  "squishmallows": "Squishmallows",
  "jellycat": "Jellycat",
  "gund": "GUND",
  "ty": "Ty Inc.",
  "other": "Other Brands"
};

const BrandPage = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  const [activeTab, setActiveTab] = useState("plushies");
  const [selectedPlushie, setSelectedPlushie] = useState<MarketplacePlushie | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // If brandId is invalid, use "other"
  const safeBrandId = brandId && brandDisplayNames[brandId] ? brandId : "other";
  
  // Filter plushies by the current brand
  const brandPlushies = marketplacePlushies.filter(plushie => plushie.brand === safeBrandId);
  
  const filteredPlushies = brandPlushies
    .filter(plushie => {
      // Apply search filter
      const matchesSearch = 
        plushie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plushie.username.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply other category filters
      const matchesColor = !filters.color?.length || filters.color.includes(plushie.color);
      const matchesMaterial = !filters.material?.length || filters.material.includes(plushie.material);
      const matchesFilling = !filters.filling?.length || filters.filling.includes(plushie.filling);
      const matchesSpecies = !filters.species?.length || filters.species.includes(plushie.species);
      
      return matchesSearch && matchesColor && matchesMaterial && 
             matchesFilling && matchesSpecies;
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
      
      {/* Brand Banner */}
      <div 
        className="bg-cover bg-center h-64 relative flex items-center justify-center" 
        style={{ backgroundImage: `url(${brandLogos[safeBrandId] || brandLogos['other']})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
        <div className="relative z-10 text-center text-white">
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-softspot-500" />
          </div>
          <h1 className="text-3xl font-bold">{brandDisplayNames[safeBrandId]}</h1>
          <p className="mt-2 max-w-2xl mx-auto">
            Explore our curated collection of {brandDisplayNames[safeBrandId]} plushies
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="plushies">Plushies</TabsTrigger>
            <TabsTrigger value="accessories">Accessories</TabsTrigger>
            <TabsTrigger value="clothing">Clothing</TabsTrigger>
            <TabsTrigger value="about">About {brandDisplayNames[safeBrandId]}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plushies">
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
                        placeholder={`Search ${brandDisplayNames[safeBrandId]} plushies...`}
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <Button className="bg-softspot-400 hover:bg-softspot-500 text-white whitespace-nowrap">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      List Item
                    </Button>
                  </div>
                </div>
                
                {filteredPlushies.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlushies.map((plushie) => (
                      <div key={plushie.id} onClick={() => openPlushieDialog(plushie)}>
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
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No plushies found</h3>
                    <p className="mt-2 text-gray-500">
                      We couldn't find any {brandDisplayNames[safeBrandId]} plushies matching your filters.
                    </p>
                    <Button className="mt-6 bg-softspot-400" onClick={() => setFilters({})}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="accessories">
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Accessories Coming Soon</h3>
              <p className="mt-2 text-gray-500">
                We're working on bringing {brandDisplayNames[safeBrandId]} accessories to the marketplace.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="clothing">
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Clothing Coming Soon</h3>
              <p className="mt-2 text-gray-500">
                We're working on bringing {brandDisplayNames[safeBrandId]} clothing to the marketplace.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="about">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">About {brandDisplayNames[safeBrandId]}</h2>
              <p className="mb-4">
                {safeBrandId === "build-a-bear" ? (
                  "Build-A-Bear Workshop is a global brand that allows guests to make their own customizable plush toys. Since its founding in 1997, the company has sold more than 200 million furry friends and operates over 400 stores worldwide."
                ) : safeBrandId === "squishmallows" ? (
                  "Squishmallows are ultra-soft plush toys that were first introduced in 2017. With their distinctive marshmallow-like texture and cute designs, they've become a global sensation and collector's favorite."
                ) : safeBrandId === "jellycat" ? (
                  "Jellycat is a London-based company known for its luxurious, soft plush toys and gifts. Since 1999, they've been creating innovative designs with distinctive personalities and irresistible softness."
                ) : safeBrandId === "gund" ? (
                  "GUND is one of the oldest and most prestigious soft toy companies in the world, founded in 1898. Known for high-quality materials and craftsmanship, GUND has created many iconic plush characters over its long history."
                ) : safeBrandId === "ty" ? (
                  "Ty Inc. is the manufacturer of popular plush toys including Beanie Babies, Beanie Boos, and more. Founded in 1986 by Ty Warner, the company created a collecting phenomenon in the 1990s with their limited-release strategy."
                ) : (
                  "Explore our curated collection of unique and specialty plush toys from a variety of independent creators and smaller manufacturers."
                )}
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Brand History</h3>
                  <p className="text-sm text-gray-600">
                    Founded in {safeBrandId === "build-a-bear" ? "1997" : 
                      safeBrandId === "squishmallows" ? "2017" : 
                      safeBrandId === "jellycat" ? "1999" : 
                      safeBrandId === "gund" ? "1898" : 
                      safeBrandId === "ty" ? "1986" : "various years"
                    }, the brand has grown to become a beloved name in the plush toy industry.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Collectibility</h3>
                  <p className="text-sm text-gray-600">
                    {brandDisplayNames[safeBrandId]} plushies are {
                      safeBrandId === "build-a-bear" ? "personalized treasures" : 
                      safeBrandId === "squishmallows" ? "highly collectible with limited editions and exclusive releases" : 
                      safeBrandId === "jellycat" ? "known for their distinctive designs and limited production runs" : 
                      safeBrandId === "gund" ? "timeless classics often passed down through generations" : 
                      safeBrandId === "ty" ? "famous for their collectibility and secondary market value" : "unique pieces from independent creators"
                    }.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
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

export default BrandPage;
