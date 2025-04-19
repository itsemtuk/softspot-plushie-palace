
import { useState, useEffect } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Lock, 
  Globe,
  Star,
  Tag
} from "lucide-react";
import { MarketplacePlushie, Wishlist } from "@/types/marketplace";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";

// Importing the PlushieCard component for displaying items
import { PlushieCard } from "@/components/PlushieCard";
import { marketplacePlushies } from "@/data/plushies";

// Mock data for wishlists
const mockWishlists: Wishlist[] = [
  {
    id: "wishlist-1",
    userId: "user-1",
    name: "Dream Plushies",
    description: "Rare plushies I'm hoping to collect someday",
    plushies: marketplacePlushies.slice(0, 3),
    isPrivate: false
  },
  {
    id: "wishlist-2",
    userId: "user-1",
    name: "Birthday Wishlist",
    description: "Plushies I'd love to get for my birthday",
    plushies: marketplacePlushies.slice(3, 5),
    isPrivate: true
  }
];

// Mock data for liked feed posts (separate from marketplace items)
const likedFeedPosts = marketplacePlushies.slice(5, 8).map(item => ({
  ...item,
  forSale: false
}));

const WishlistManager = () => {
  const { user } = useUser();
  const [wishlists, setWishlists] = useState<Wishlist[]>(mockWishlists);
  const [selectedWishlist, setSelectedWishlist] = useState<string | null>("wishlist-1");
  const [activeTab, setActiveTab] = useState("wishlists");
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Form states
  const [wishlistName, setWishlistName] = useState("");
  const [wishlistDescription, setWishlistDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [editingWishlistId, setEditingWishlistId] = useState<string | null>(null);
  
  const handleCreateWishlist = () => {
    if (!wishlistName) return;
    
    const newWishlist: Wishlist = {
      id: `wishlist-${Date.now()}`,
      userId: "user-1",
      name: wishlistName,
      description: wishlistDescription,
      plushies: [],
      isPrivate
    };
    
    setWishlists(prev => [...prev, newWishlist]);
    setSelectedWishlist(newWishlist.id);
    setCreateDialogOpen(false);
    resetForm();
    
    toast({
      title: "Wishlist created",
      description: `"${wishlistName}" has been created.`
    });
  };
  
  const handleEditWishlist = () => {
    if (!wishlistName || !editingWishlistId) return;
    
    setWishlists(prev => prev.map(wishlist => 
      wishlist.id === editingWishlistId
        ? {
            ...wishlist,
            name: wishlistName,
            description: wishlistDescription,
            isPrivate
          }
        : wishlist
    ));
    
    setEditDialogOpen(false);
    resetForm();
    
    toast({
      title: "Wishlist updated",
      description: `"${wishlistName}" has been updated.`
    });
  };
  
  const handleDeleteWishlist = () => {
    if (!editingWishlistId) return;
    
    const wishlistToDelete = wishlists.find(w => w.id === editingWishlistId);
    
    setWishlists(prev => prev.filter(wishlist => wishlist.id !== editingWishlistId));
    
    if (selectedWishlist === editingWishlistId) {
      setSelectedWishlist(wishlists.length > 1 ? wishlists[0].id : null);
    }
    
    setDeleteDialogOpen(false);
    
    toast({
      title: "Wishlist deleted",
      description: `"${wishlistToDelete?.name}" has been deleted.`
    });
  };
  
  const openEditDialog = (wishlist: Wishlist) => {
    setWishlistName(wishlist.name);
    setWishlistDescription(wishlist.description || "");
    setIsPrivate(wishlist.isPrivate);
    setEditingWishlistId(wishlist.id);
    setEditDialogOpen(true);
  };
  
  const openDeleteDialog = (wishlistId: string) => {
    setEditingWishlistId(wishlistId);
    setDeleteDialogOpen(true);
  };
  
  const resetForm = () => {
    setWishlistName("");
    setWishlistDescription("");
    setIsPrivate(false);
    setEditingWishlistId(null);
  };
  
  const currentWishlist = wishlists.find(w => w.id === selectedWishlist);
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            <CardTitle>My Collections</CardTitle>
          </div>
          <Button 
            size="sm" 
            onClick={() => setCreateDialogOpen(true)}
            className="bg-softspot-400 hover:bg-softspot-500"
          >
            <Plus className="mr-1 h-4 w-4" /> New Collection
          </Button>
        </div>
        <CardDescription>
          Manage your wishlists and liked items
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="border-b px-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="wishlists">Wishlists</TabsTrigger>
              <TabsTrigger value="marketplace">Liked Marketplace</TabsTrigger>
              <TabsTrigger value="posts">Liked Posts</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="wishlists" className="m-0 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
              <div className="col-span-1 border-r pr-4">
                <div className="font-medium mb-2 text-sm text-gray-500">MY COLLECTIONS</div>
                <div className="space-y-1">
                  {wishlists.map(wishlist => (
                    <div
                      key={wishlist.id}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                        selectedWishlist === wishlist.id ? 'bg-softspot-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedWishlist(wishlist.id)}
                    >
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-2 text-red-500" />
                        <span>{wishlist.name}</span>
                        {wishlist.isPrivate && <Lock className="h-3 w-3 ml-2 text-gray-400" />}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {wishlist.plushies.length}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="col-span-1 md:col-span-3">
                {currentWishlist ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center">
                          {currentWishlist.name}
                          {currentWishlist.isPrivate ? (
                            <Lock className="h-4 w-4 ml-2 text-gray-400" />
                          ) : (
                            <Globe className="h-4 w-4 ml-2 text-gray-400" />
                          )}
                        </h3>
                        {currentWishlist.description && (
                          <p className="text-sm text-gray-500">{currentWishlist.description}</p>
                        )}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Manage Wishlist</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openEditDialog(currentWishlist)}>
                            <Pencil className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => openDeleteDialog(currentWishlist.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {currentWishlist.plushies.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentWishlist.plushies.map((plushie) => (
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
                    ) : (
                      <div className="text-center py-12">
                        <Star className="mx-auto h-12 w-12 text-softspot-200" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No items yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Items you add to this wishlist will appear here
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="mx-auto h-12 w-12 text-softspot-200" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No wishlist selected</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Select a wishlist or create a new one
                    </p>
                    <Button
                      className="mt-4 bg-softspot-400 hover:bg-softspot-500"
                      onClick={() => setCreateDialogOpen(true)}
                    >
                      Create Wishlist
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="marketplace" className="m-0 p-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                Liked Marketplace Items
                <Lock className="h-4 w-4 ml-2 text-gray-400" />
              </h3>
              <p className="text-sm text-gray-500">
                Items you've liked in the marketplace (private to you)
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {marketplacePlushies.slice(0, 6).map((plushie) => (
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
          </TabsContent>
          
          <TabsContent value="posts" className="m-0 p-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                Liked Feed Posts
                <Lock className="h-4 w-4 ml-2 text-gray-400" />
              </h3>
              <p className="text-sm text-gray-500">
                Posts you've liked in the community feed (private to you)
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {likedFeedPosts.map((post) => (
                <PlushieCard
                  key={post.id}
                  id={post.id}
                  image={post.image}
                  title={post.title}
                  username={post.username}
                  likes={post.likes}
                  comments={post.comments}
                  variant="feed"
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Create Wishlist Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Wishlist</DialogTitle>
            <DialogDescription>
              Create a collection for items you want to save
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="My Dream Plushies"
                value={wishlistName}
                onChange={(e) => setWishlistName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Add a description for your wishlist"
                value={wishlistDescription}
                onChange={(e) => setWishlistDescription(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="private"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
              <Label htmlFor="private" className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Private collection
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setCreateDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateWishlist}
              disabled={!wishlistName.trim()}
              className="bg-softspot-400 hover:bg-softspot-500"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Wishlist Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Wishlist</DialogTitle>
            <DialogDescription>
              Update your wishlist details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                placeholder="My Dream Plushies"
                value={wishlistName}
                onChange={(e) => setWishlistName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Textarea
                id="edit-description"
                placeholder="Add a description for your wishlist"
                value={wishlistDescription}
                onChange={(e) => setWishlistDescription(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-private"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
              <Label htmlFor="edit-private" className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Private collection
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditWishlist}
              disabled={!wishlistName.trim()}
              className="bg-softspot-400 hover:bg-softspot-500"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Wishlist Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Wishlist</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this wishlist? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteWishlist}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WishlistManager;
