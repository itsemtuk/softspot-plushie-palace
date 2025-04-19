
import { useState } from "react";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Heart, 
  Plus, 
  X, 
  Edit, 
  Trash2, 
  Lock, 
  ShoppingBag, 
  MessageCircle 
} from "lucide-react";
import { MarketplacePlushie, Wishlist, PlushieCondition, PlushieMaterial, PlushieFilling, PlushieSpecies, PlushieBrand } from "@/types/marketplace";
import { useUser } from "@clerk/clerk-react";

const WishlistManager = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("wishlists");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [wishlistName, setWishlistName] = useState("");
  const [wishlistDescription, setWishlistDescription] = useState("");
  const [isWishlistPrivate, setIsWishlistPrivate] = useState(false);
  const [activeWishlist, setActiveWishlist] = useState<Wishlist | null>(null);
  const [wishlists, setWishlists] = useState<Wishlist[]>([
    {
      id: "wishlist-1",
      userId: "user-1",
      name: "Dream Plushies",
      description: "My dream collection of plushies",
      plushies: [
        {
          id: "item-1",
          image: "https://i.pravatar.cc/300?img=1",
          title: "Mint Jellycat Bunny",
          username: "plushielover",
          likes: 24,
          comments: 5,
          price: 45.99,
          forSale: true,
          condition: "Like New" as PlushieCondition,
          description: "Adorable mint green bunny, super soft",
          color: "Mint",
          material: "Plush" as PlushieMaterial,
          filling: "Cotton" as PlushieFilling,
          species: "Rabbit" as PlushieSpecies,
          brand: "Jellycat" as PlushieBrand,
        },
        {
          id: "item-2",
          image: "https://i.pravatar.cc/300?img=2",
          title: "Limited Edition Teddy",
          username: "teddycollector",
          likes: 42,
          comments: 8,
          price: 89.99,
          forSale: true,
          condition: "New" as PlushieCondition,
          description: "Limited edition anniversary teddy bear",
          color: "Brown",
          material: "Cotton" as PlushieMaterial,
          filling: "Polyester" as PlushieFilling,
          species: "Bear" as PlushieSpecies,
          brand: "Build-A-Bear" as PlushieBrand,
        }
      ],
      isPrivate: false
    },
    {
      id: "wishlist-2",
      userId: "user-1",
      name: "Vintage Finds",
      description: "My favorite vintage plushies",
      plushies: [
        {
          id: "item-3",
          image: "https://i.pravatar.cc/300?img=3",
          title: "Vintage Care Bear",
          username: "vintagetoylover",
          likes: 67,
          comments: 12,
          price: 120,
          forSale: true,
          condition: "Good" as PlushieCondition,
          description: "Original 80's Care Bear in good condition",
          color: "Pink",
          material: "Plush" as PlushieMaterial,
          filling: "Cotton" as PlushieFilling,
          species: "Bear" as PlushieSpecies,
          brand: "Care Bears" as PlushieBrand,
        }
      ],
      isPrivate: true
    }
  ]);

  // Mock data for liked plushies and posts
  const [likedPlushies, setLikedPlushies] = useState<MarketplacePlushie[]>([
    {
      id: "liked-1",
      image: "https://i.pravatar.cc/300?img=4",
      title: "Squishmallow Cat",
      username: "squishfan",
      likes: 89,
      comments: 24,
      price: 34.99,
      forSale: true,
      condition: "New" as PlushieCondition,
      description: "Super soft gray cat squishmallow",
      color: "Gray",
      material: "Plush" as PlushieMaterial,
      filling: "Memory Foam" as PlushieFilling,
      species: "Cat" as PlushieSpecies,
      brand: "Squishmallows" as PlushieBrand,
    }
  ]);

  const [likedPosts, setLikedPosts] = useState([
    {
      id: "post-1",
      username: "plushiecollector",
      avatar: "https://i.pravatar.cc/150?img=5",
      content: "Just added this amazing teddy to my collection!",
      image: "https://i.pravatar.cc/500?img=5",
      likes: 42,
      comments: 7,
      timestamp: "2h ago"
    }
  ]);

  const handleOpenDialog = (mode: "create" | "edit", wishlist?: Wishlist) => {
    setDialogMode(mode);
    if (mode === "edit" && wishlist) {
      setWishlistName(wishlist.name);
      setWishlistDescription(wishlist.description || "");
      setIsWishlistPrivate(wishlist.isPrivate);
      setActiveWishlist(wishlist);
    } else {
      setWishlistName("");
      setWishlistDescription("");
      setIsWishlistPrivate(false);
    }
    setIsDialogOpen(true);
  };

  const handleSaveWishlist = () => {
    if (dialogMode === "create") {
      const newWishlist: Wishlist = {
        id: `wishlist-${Date.now()}`,
        userId: "user-1", // Should be current user's ID
        name: wishlistName,
        description: wishlistDescription,
        plushies: [],
        isPrivate: isWishlistPrivate
      };
      setWishlists([...wishlists, newWishlist]);
    } else if (dialogMode === "edit" && activeWishlist) {
      setWishlists(wishlists.map(w => 
        w.id === activeWishlist.id 
          ? { 
              ...w, 
              name: wishlistName, 
              description: wishlistDescription, 
              isPrivate: isWishlistPrivate 
            } 
          : w
      ));
    }
    setIsDialogOpen(false);
  };

  const handleDeleteWishlist = (wishlistId: string) => {
    setWishlists(wishlists.filter(w => w.id !== wishlistId));
  };

  const handleRemovePlushie = (wishlistId: string, plushieId: string) => {
    setWishlists(wishlists.map(w => 
      w.id === wishlistId 
        ? { ...w, plushies: w.plushies.filter(p => p.id !== plushieId) } 
        : w
    ));
  };

  const handleRemoveLikedPlushie = (plushieId: string) => {
    setLikedPlushies(likedPlushies.filter(p => p.id !== plushieId));
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="wishlists">Wishlists</TabsTrigger>
          <TabsTrigger value="liked-items">Liked Items</TabsTrigger>
          <TabsTrigger value="liked-posts">Liked Posts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wishlists" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Your Wishlists</h2>
            <Button onClick={() => handleOpenDialog("create")} className="bg-softspot-400 hover:bg-softspot-500">
              <Plus className="mr-1 h-4 w-4" />
              New Wishlist
            </Button>
          </div>
          
          {wishlists.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {wishlists.map(wishlist => (
                <Card key={wishlist.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center">
                        {wishlist.name}
                        {wishlist.isPrivate && (
                          <Lock className="ml-2 h-4 w-4 text-gray-400" />
                        )}
                      </CardTitle>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleOpenDialog("edit", wishlist)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteWishlist(wishlist.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {wishlist.description && (
                      <p className="text-sm text-gray-500">{wishlist.description}</p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    {wishlist.plushies.length > 0 ? (
                      <ScrollArea className="h-60">
                        <div className="space-y-2">
                          {wishlist.plushies.map(plushie => (
                            <div 
                              key={plushie.id} 
                              className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg"
                            >
                              <img 
                                src={plushie.image} 
                                alt={plushie.title}
                                className="h-16 w-16 object-cover rounded-md" 
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{plushie.title}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <span>${plushie.price}</span>
                                  {plushie.forSale ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                      For Sale
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-gray-50">
                                      Not For Sale
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleRemovePlushie(wishlist.id, plushie.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="py-8 text-center">
                        <Heart className="mx-auto h-12 w-12 text-gray-200" />
                        <p className="mt-2 text-gray-500">No plushies added yet</p>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter>
                    <p className="text-sm text-gray-500">
                      {wishlist.plushies.length} {wishlist.plushies.length === 1 ? 'item' : 'items'}
                    </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border rounded-lg bg-gray-50">
              <Heart className="mx-auto h-12 w-12 text-gray-200" />
              <h3 className="mt-2 text-lg font-medium">No wishlists yet</h3>
              <p className="mt-1 text-gray-500">Create your first wishlist to start collecting plushies</p>
              <Button 
                className="mt-4 bg-softspot-400 hover:bg-softspot-500"
                onClick={() => handleOpenDialog("create")}
              >
                <Plus className="mr-1 h-4 w-4" />
                Create Wishlist
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="liked-items" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Liked Items</h2>
            <Button variant="outline" className="text-softspot-500 border-softspot-300">
              <ShoppingBag className="mr-1 h-4 w-4" />
              View Marketplace
            </Button>
          </div>
          
          {likedPlushies.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {likedPlushies.map(plushie => (
                <Card key={plushie.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img 
                      src={plushie.image} 
                      alt={plushie.title}
                      className="object-cover w-full h-full" 
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white text-destructive"
                      onClick={() => handleRemoveLikedPlushie(plushie.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium truncate">{plushie.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-semibold">${plushie.price}</span>
                      {plushie.forSale ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          For Sale
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50">
                          Not For Sale
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border rounded-lg bg-gray-50">
              <Heart className="mx-auto h-12 w-12 text-gray-200" />
              <h3 className="mt-2 text-lg font-medium">No liked items yet</h3>
              <p className="mt-1 text-gray-500">Browse the marketplace and like items to save them here</p>
              <Button className="mt-4 bg-softspot-400 hover:bg-softspot-500">
                Go to Marketplace
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="liked-posts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Liked Posts</h2>
            <Button variant="outline" className="text-softspot-500 border-softspot-300">
              <MessageCircle className="mr-1 h-4 w-4" />
              View Feed
            </Button>
          </div>
          
          {likedPosts.length > 0 ? (
            <div className="space-y-4">
              {likedPosts.map(post => (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={post.avatar} 
                        alt={post.username}
                        className="h-10 w-10 rounded-full object-cover" 
                      />
                      <div>
                        <h3 className="font-semibold">@{post.username}</h3>
                        <p className="text-sm text-gray-500">{post.timestamp}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <p>{post.content}</p>
                    {post.image && (
                      <img 
                        src={post.image} 
                        alt="Post content"
                        className="mt-3 rounded-lg w-full object-cover" 
                      />
                    )}
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1 text-red-500 fill-red-500" />
                        {post.likes}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments} comments
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border rounded-lg bg-gray-50">
              <Heart className="mx-auto h-12 w-12 text-gray-200" />
              <h3 className="mt-2 text-lg font-medium">No liked posts yet</h3>
              <p className="mt-1 text-gray-500">Browse the feed and like posts to save them here</p>
              <Button className="mt-4 bg-softspot-400 hover:bg-softspot-500">
                Go to Feed
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Create New Wishlist" : "Edit Wishlist"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Wishlist Name</Label>
              <Input 
                id="name" 
                value={wishlistName}
                onChange={(e) => setWishlistName(e.target.value)}
                placeholder="My Dream Plushies"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description"
                value={wishlistDescription}
                onChange={(e) => setWishlistDescription(e.target.value)}
                placeholder="A collection of plushies I hope to add to my collection"
                className="resize-none"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="private" 
                checked={isWishlistPrivate}
                onCheckedChange={setIsWishlistPrivate}
              />
              <Label htmlFor="private" className="flex items-center cursor-pointer">
                <Lock className="mr-2 h-4 w-4" />
                Make this wishlist private
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveWishlist}
              disabled={!wishlistName.trim()}
              className="bg-softspot-400 hover:bg-softspot-500"
            >
              {dialogMode === "create" ? "Create Wishlist" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WishlistManager;
