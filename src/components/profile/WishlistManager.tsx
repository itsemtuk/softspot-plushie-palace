import React, { useState, useEffect } from 'react';
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";
import {
  Wishlist,
  WishlistItem
} from "@/types/marketplace";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function WishlistManager() {
  const { user } = useUser();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [selectedWishlist, setSelectedWishlist] = useState<Wishlist | null>(null);
  const [isCreatingWishlist, setIsCreatingWishlist] = useState(false);
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [wishlistName, setWishlistName] = useState("");
  const [wishlistDescription, setWishlistDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemImage, setItemImage] = useState("");
  const [itemPriority, setItemPriority] = useState("medium");
  const [itemCurrency, setItemCurrency] = useState("USD");
  const [itemBrand, setItemBrand] = useState("");

  useEffect(() => {
    // Load wishlists from local storage or default data
    const storedWishlists = localStorage.getItem("wishlists");
    if (storedWishlists) {
      setWishlists(JSON.parse(storedWishlists));
    } else {
      // Initialize with some default wishlists
      setWishlists([
        {
          id: "wishlist-1",
          name: "My Plushie Collection",
          description: "A list of plushies I want to add to my collection",
          items: [],
          privacy: "public",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: user?.id || 'anonymous'
        },
      ]);
    }
  }, [user?.id]);

  useEffect(() => {
    // Save wishlists to local storage whenever they change
    localStorage.setItem("wishlists", JSON.stringify(wishlists));
  }, [wishlists]);

  const handleCreateWishlist = () => {
    if (!wishlistName.trim()) {
      toast({
        title: "Error",
        description: "Wishlist name is required.",
        variant: "destructive",
      });
      return;
    }

    // Fix wishlist creation to use proper properties
    const newWishlist: Wishlist = {
      id: `wishlist-${Date.now()}`,
      name: wishlistName,
      description: wishlistDescription,
      items: [],
      privacy: isPrivate ? 'private' : 'public', // Use privacy instead of isPublic
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user?.id || 'anonymous'
    };

    setWishlists([...wishlists, newWishlist]);
    setIsCreatingWishlist(false);
    setWishlistName("");
    setWishlistDescription("");
    setIsPrivate(false);
    toast({
      title: "Success",
      description: "Wishlist created successfully.",
    });
  };

  const handleSelectItem = (wishlist: Wishlist) => {
    setSelectedWishlist(wishlist);
  };

  const handleCreateItem = () => {
    if (!itemName.trim() || !itemPrice.trim()) {
      toast({
        title: "Error",
        description: "Item name and price are required.",
        variant: "destructive",
      });
      return;
    }

    // Fix wishlist item creation to match the WishlistItem interface
    const newItem: WishlistItem = {
      id: `item-${Date.now()}`,
      name: itemName,
      description: itemDescription,
      price: parseFloat(itemPrice),
      imageUrl: itemImage || "https://placehold.co/100x100?text=Item", // Use imageUrl instead of image
      priority: itemPriority as 'low' | 'medium' | 'high',
      status: 'wanted',
      currencyCode: itemCurrency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      brand: itemBrand
    };

    if (selectedWishlist) {
      const updatedWishlists = wishlists.map((wishlist) =>
        wishlist.id === selectedWishlist.id
          ? { ...wishlist, items: [...wishlist.items, newItem] }
          : wishlist
      );
      setWishlists(updatedWishlists);
      setSelectedWishlist({ ...selectedWishlist, items: [...selectedWishlist.items, newItem] });
      setIsCreatingItem(false);
      setItemName("");
      setItemDescription("");
      setItemPrice("");
      setItemImage("");
      setItemPriority("medium");
      setItemCurrency("USD");
      setItemBrand("");
      toast({
        title: "Success",
        description: "Item added to wishlist successfully.",
      });
    }
  };

  const handleDeleteWishlist = (wishlistId: string) => {
    setWishlists(wishlists.filter((wishlist) => wishlist.id !== wishlistId));
    setSelectedWishlist(null);
    toast({
      title: "Success",
      description: "Wishlist deleted successfully.",
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Wishlist List */}
      <Card className="w-full md:w-1/3">
        <CardHeader>
          <CardTitle>Your Wishlists</CardTitle>
          <CardDescription>Manage your wishlists and items</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <div className="p-4 space-y-2">
              {wishlists.map((wishlist) => (
                <div
                  key={wishlist.id}
                  className={`p-3 rounded-md cursor-pointer hover:bg-gray-100 ${
                    selectedWishlist?.id === wishlist.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleSelectItem(wishlist)}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{wishlist.name}</p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Wishlist</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this wishlist? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteWishlist(wishlist.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <p className="text-sm text-gray-500">{wishlist.description}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4">
            <Button variant="outline" className="w-full" onClick={() => setIsCreatingWishlist(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Wishlist
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Wishlist Items */}
      <Card className="w-full md:w-2/3">
        <CardHeader>
          <CardTitle>
            {selectedWishlist ? selectedWishlist.name : "Select a Wishlist"}
          </CardTitle>
          <CardDescription>
            {selectedWishlist
              ? "View and manage items in this wishlist"
              : "Choose a wishlist to see its items"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {selectedWishlist ? (
            <>
              <ScrollArea className="h-[320px]">
                <div className="p-4 space-y-2">
                  {selectedWishlist.items.map((item) => (
                    <div key={item.id} className="p-3 rounded-md bg-gray-50">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">${item.price}</p>
                      </div>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4">
                <Button variant="outline" className="w-full" onClick={() => setIsCreatingItem(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Item
                </Button>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Select a wishlist to view its items.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Wishlist Dialog */}
      <AlertDialog open={isCreatingWishlist} onOpenChange={setIsCreatingWishlist}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Wishlist</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the details for your new wishlist.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={wishlistName}
                onChange={(e) => setWishlistName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={wishlistDescription}
                onChange={(e) => setWishlistDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="private" className="text-right">
                Private
              </Label>
              <div className="col-span-3 flex items-center">
                <Switch
                  id="private"
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                />
                <p className="text-sm text-gray-500 ml-2">Make this wishlist private</p>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsCreatingWishlist(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateWishlist}>
              Create
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Item Dialog */}
      <AlertDialog open={isCreatingItem} onOpenChange={setIsCreatingItem}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Item</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the details for the item you want to add.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-name" className="text-right">
                Name
              </Label>
              <Input
                id="item-name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="item-description"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-price" className="text-right">
                Price
              </Label>
              <Input
                id="item-price"
                type="number"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-image" className="text-right">
                Image URL
              </Label>
              <Input
                id="item-image"
                value={itemImage}
                onChange={(e) => setItemImage(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-priority" className="text-right">
                Priority
              </Label>
              <Select value={itemPriority} onValueChange={(value) => setItemPriority(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-currency" className="text-right">
                Currency
              </Label>
              <Select value={itemCurrency} onValueChange={(value) => setItemCurrency(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                  <SelectItem value="AUD">AUD</SelectItem>
                  <SelectItem value="CNY">CNY</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-brand" className="text-right">
                Brand
              </Label>
              <Input
                id="item-brand"
                value={itemBrand}
                onChange={(e) => setItemBrand(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsCreatingItem(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateItem}>
              Add Item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
