
import { useState } from 'react';
import { CardTitle, CardHeader, Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsContent as TabsContentMapped, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Wishlist, MarketplacePlushie } from "@/types/marketplace";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { PlusCircle, Pencil, Trash2, Lock, Globe, Share2, ExternalLink } from "lucide-react";
import { PlushieCard } from "@/components/PlushieCard";
import { toast } from "@/components/ui/use-toast";

// Mock data for wishlists
const mockWishlists: Wishlist[] = [
  {
    id: "wishlist-1",
    userId: "user-1",
    name: "Dream Plushies",
    description: "Plushies I really want to add to my collection",
    isPublic: true,
    items: [
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
      }
    ],
    createdAt: "2023-05-10T12:00:00Z",
    updatedAt: "2023-06-15T15:30:00Z"
  },
  {
    id: "wishlist-2",
    userId: "user-1",
    name: "Birthday List",
    description: "Plushies I want for my birthday",
    isPublic: false,
    items: [
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
      }
    ],
    createdAt: "2023-07-22T09:15:00Z",
    updatedAt: "2023-07-25T17:40:00Z"
  }
];

// Get featured plushie mocks from elsewhere
const featuredPlushies: MarketplacePlushie[] = [
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
  }
];

const WishlistManager = () => {
  const [activeTab, setActiveTab] = useState("my-wishlists");
  const [wishlists, setWishlists] = useState<Wishlist[]>(mockWishlists);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWishlist, setEditingWishlist] = useState<Wishlist | null>(null);
  const [wishlistName, setWishlistName] = useState("");
  const [wishlistDescription, setWishlistDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  
  const handleCreateWishlist = () => {
    if (!wishlistName.trim()) return;
    
    const newWishlist: Wishlist = {
      id: `wishlist-${Date.now()}`,
      userId: "user-1", // Mock user ID
      name: wishlistName,
      description: wishlistDescription,
      isPublic: isPublic,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setWishlists([...wishlists, newWishlist]);
    resetForm();
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Wishlist created!",
      description: `"${wishlistName}" has been created successfully.`
    });
  };
  
  const handleEditWishlist = () => {
    if (!editingWishlist || !wishlistName.trim()) return;
    
    const updatedWishlists = wishlists.map(w => {
      if (w.id === editingWishlist.id) {
        return {
          ...w,
          name: wishlistName,
          description: wishlistDescription,
          isPublic: isPublic,
          updatedAt: new Date().toISOString()
        };
      }
      return w;
    });
    
    setWishlists(updatedWishlists);
    resetForm();
    setIsEditDialogOpen(false);
    
    toast({
      title: "Wishlist updated!",
      description: `"${wishlistName}" has been updated successfully.`
    });
  };
  
  const handleDeleteWishlist = (id: string) => {
    const updatedWishlists = wishlists.filter(w => w.id !== id);
    setWishlists(updatedWishlists);
    
    toast({
      title: "Wishlist deleted",
      description: "The wishlist has been deleted successfully."
    });
  };
  
  const openEditDialog = (wishlist: Wishlist) => {
    setEditingWishlist(wishlist);
    setWishlistName(wishlist.name);
    setWishlistDescription(wishlist.description || "");
    setIsPublic(wishlist.isPublic);
    setIsEditDialogOpen(true);
  };
  
  const resetForm = () => {
    setWishlistName("");
    setWishlistDescription("");
    setIsPublic(true);
    setEditingWishlist(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold">Your Collections</h2>
        <Button 
          className="bg-softspot-400 hover:bg-softspot-500 text-white"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Collection
        </Button>
      </div>
      
      <Tabs defaultValue="my-wishlists" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-wishlists">My Wishlists</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-wishlists" className="mt-6">
          {wishlists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlists.map((wishlist) => (
                <Card key={wishlist.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 mr-4">
                        <CardTitle className="flex items-center gap-2">
                          {wishlist.name}
                          {wishlist.isPublic ? (
                            <Globe className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Lock className="h-4 w-4 text-gray-400" />
                          )}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          {wishlist.items.length} items
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => openEditDialog(wishlist)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={() => handleDeleteWishlist(wishlist.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {wishlist.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {wishlist.description}
                      </p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <div className="relative">
                      <ScrollArea className="h-64">
                        <div className="grid grid-cols-2 gap-1 p-4">
                          {wishlist.items.length > 0 ? (
                            wishlist.items.map((item, index) => (
                              <div 
                                key={`${item.id}-${index}`}
                                className="aspect-square overflow-hidden rounded-md bg-gray-100"
                              >
                                <img 
                                  src={item.image} 
                                  alt={item.title} 
                                  className="w-full h-full object-cover transition-transform hover:scale-110"
                                />
                              </div>
                            ))
                          ) : (
                            <div className="col-span-2 flex flex-col items-center justify-center h-40">
                              <p className="text-gray-500 text-sm">No items yet</p>
                              <Button 
                                variant="link" 
                                size="sm" 
                                asChild
                              >
                                <Link to="/marketplace">
                                  Add items from the marketplace
                                </Link>
                              </Button>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                      
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                      
                      <div className="absolute bottom-2 right-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-white shadow-sm"
                          asChild
                        >
                          <Link to={`/wishlist/${wishlist.id}`}>
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="max-w-sm mx-auto">
                <h3 className="text-lg font-medium">No wishlists yet</h3>
                <p className="text-gray-500 mt-2 mb-4">
                  Create your first wishlist to start saving plushies you love or want to get in the future.
                </p>
                <Button 
                  className="bg-softspot-400 hover:bg-softspot-500"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Wishlist
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="discover" className="mt-6">
          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-bold mb-4">Featured Collections</h3>
              
              <Card className="bg-gradient-to-r from-softspot-50 to-softspot-100 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <h4 className="text-lg font-semibold">Care Bears Collection</h4>
                      <div className="flex items-center gap-2 mt-2 mb-4">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="Mike" />
                          <AvatarFallback>M</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">mikeplush</span>
                      </div>
                      
                      <p className="text-sm text-gray-600">
                        A complete collection of vintage Care Bears from the 80s.
                        All in excellent condition and rare to find.
                      </p>
                      
                      <div className="mt-6">
                        <Button 
                          variant="default" 
                          size="sm"
                          className="bg-softspot-400 hover:bg-softspot-500"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Follow Collection
                        </Button>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3 overflow-hidden">
                      <ScrollArea orientation="horizontal" className="w-full">
                        <div className="flex gap-4 pb-4">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-40 flex-none">
                              <div className="aspect-square bg-white rounded-lg overflow-hidden">
                                <img 
                                  src={`https://i.pravatar.cc/300?img=${i+10}`} 
                                  alt={`Care Bear ${i}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-4">Plushies You Might Like</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredPlushies.map((plushie) => (
                  <PlushieCard 
                    key={plushie.id}
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
                ))}
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-4">Popular Collections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["Jellycat Collection", "Vintage Steiff Bears"].map((name, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>{name}</CardTitle>
                        <Avatar className="h-6 w-6">
                          <AvatarImage 
                            src={`https://i.pravatar.cc/150?img=${20+i}`} 
                            alt={`User ${i}`} 
                          />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-0">
                      <div className="grid grid-cols-3 gap-0.5">
                        {[1, 2, 3].map((j) => (
                          <div 
                            key={j}
                            className="aspect-square overflow-hidden bg-gray-100"
                          >
                            <img 
                              src={`https://i.pravatar.cc/300?img=${j+i*3}`} 
                              alt={`Item ${j}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-4">
                        <Button variant="link" size="sm" className="p-0">
                          View Collection
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Create Wishlist Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogDescription>
              Create a new wishlist to save plushies you love or want.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Collection Name</Label>
              <Input 
                id="name" 
                placeholder="Enter collection name"
                value={wishlistName}
                onChange={(e) => setWishlistName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea 
                id="description" 
                placeholder="Add a description for your collection"
                value={wishlistDescription}
                onChange={(e) => setWishlistDescription(e.target.value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public">Public Collection</Label>
                <p className="text-sm text-gray-500">
                  Allow others to see this collection
                </p>
              </div>
              <Switch 
                id="public" 
                checked={isPublic} 
                onCheckedChange={setIsPublic} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-softspot-400 hover:bg-softspot-500"
              onClick={handleCreateWishlist}
              disabled={!wishlistName.trim()}
            >
              Create Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Wishlist Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
            <DialogDescription>
              Update your collection details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Collection Name</Label>
              <Input 
                id="edit-name" 
                placeholder="Enter collection name"
                value={wishlistName}
                onChange={(e) => setWishlistName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Textarea 
                id="edit-description" 
                placeholder="Add a description for your collection"
                value={wishlistDescription}
                onChange={(e) => setWishlistDescription(e.target.value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="edit-public">Public Collection</Label>
                <p className="text-sm text-gray-500">
                  Allow others to see this collection
                </p>
              </div>
              <Switch 
                id="edit-public" 
                checked={isPublic} 
                onCheckedChange={setIsPublic} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              className="bg-softspot-400 hover:bg-softspot-500"
              onClick={handleEditWishlist}
              disabled={!wishlistName.trim()}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WishlistManager;
