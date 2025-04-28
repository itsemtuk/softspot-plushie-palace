import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { WishlistItem, Wishlist, Currency, PlushieCondition } from '@/types/marketplace';

export function WishlistManager() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [selectedWishlist, setSelectedWishlist] = useState<Wishlist | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemBrand, setNewItemBrand] = useState('');
  const [newItemImage, setNewItemImage] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCurrency, setNewItemCurrency] = useState<Currency>('USD');
  const [newItemCondition, setNewItemCondition] = useState<PlushieCondition>('New');
  const [newItemUrl, setNewItemUrl] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [newItemPriority, setNewItemPriority] = useState('medium');
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isCreateWishlistDialogOpen, setIsCreateWishlistDialogOpen] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');
  const [newWishlistDescription, setNewWishlistDescription] = useState('');
  const [newWishlistIsPublic, setNewWishlistIsPublic] = useState(false);
  const [newWishlistId, setNewWishlistId] = useState(`wishlist-${Date.now()}`);
  const [isUpdateWishlistDialogOpen, setIsUpdateWishlistDialogOpen] = useState(false);

  const handleAddItem = () => {
    const newItem: WishlistItem = {
      id: `item-${Date.now()}`,
      name: newItemName,
      brand: newItemBrand || undefined,
      image: newItemImage || undefined,
      price: newItemPrice ? Number(newItemPrice) : undefined,
      currency: newItemCurrency || undefined,
      condition: newItemCondition || undefined,
      url: newItemUrl || undefined,
      notes: newItemNotes || undefined,
      priority: newItemPriority as 'low' | 'medium' | 'high',
    };
    
    if (selectedWishlist) {
      const updatedWishlist = {
        ...selectedWishlist,
        items: [...selectedWishlist.items, newItem],
      };
      setWishlists(
        wishlists.map((wishlist) =>
          wishlist.id === selectedWishlist.id ? updatedWishlist : wishlist
        )
      );
      setSelectedWishlist(updatedWishlist);
      setIsAddItemDialogOpen(false);
      toast({
        title: "Item added",
        description: "The item has been added to your wishlist.",
      });
    }
  };

  const handleCreateWishlist = () => {
    const newWishlistItem: WishlistItem = {
      id: `item-${Date.now()}`,
      name: newItemName,
      brand: newItemBrand || undefined,
      image: newItemImage || undefined,
      price: newItemPrice ? Number(newItemPrice) : undefined,
      currency: newItemCurrency || undefined,
      condition: newItemCondition || undefined,
      url: newItemUrl || undefined,
      notes: newItemNotes || undefined,
      priority: newItemPriority as 'low' | 'medium' | 'high',
    };
    
    const newWishlist: Wishlist = {
      id: newWishlistId,
      userId: 'current-user',
      title: newWishlistName,
      description: newWishlistDescription,
      isPublic: newWishlistIsPublic,
      items: [newWishlistItem],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWishlists([...wishlists, newWishlist]);
    setSelectedWishlist(newWishlist);
    setIsCreateWishlistDialogOpen(false);
    toast({
      title: "Wishlist created",
      description: "Your new wishlist has been created.",
    });
  };

  const handleUpdateWishlist = () => {
    const updatedItem: WishlistItem = {
      id: `item-${Date.now()}`,
      name: newItemName,
      brand: newItemBrand || undefined,
      image: newItemImage || undefined,
      price: newItemPrice ? Number(newItemPrice) : undefined,
      currency: newItemCurrency || undefined,
      condition: newItemCondition || undefined,
      url: newItemUrl || undefined,
      notes: newItemNotes || undefined,
      priority: newItemPriority as 'low' | 'medium' | 'high',
    };
    
    if (selectedWishlist) {
      const updatedWishlist = {
        ...selectedWishlist,
        items: [...selectedWishlist.items, updatedItem],
      };
      setWishlists(
        wishlists.map((wishlist) =>
          wishlist.id === selectedWishlist.id ? updatedWishlist : wishlist
        )
      );
      setSelectedWishlist(updatedWishlist);
      setIsUpdateWishlistDialogOpen(false);
      toast({
        title: "Wishlist updated",
        description: "Your wishlist has been updated.",
      });
    }
  };

  const handleWishlistSelect = (wishlist: Wishlist) => {
    setSelectedWishlist(wishlist);
  };

  const handleOpenAddItemDialog = () => {
    setIsAddItemDialogOpen(true);
  };

  const handleCloseAddItemDialog = () => {
    setIsAddItemDialogOpen(false);
  };

  const handleOpenCreateWishlistDialog = () => {
    setIsCreateWishlistDialogOpen(true);
  };

  const handleCloseCreateWishlistDialog = () => {
    setIsCreateWishlistDialogOpen(false);
  };

  const handleOpenUpdateWishlistDialog = () => {
    setIsUpdateWishlistDialogOpen(true);
  };

  const handleCloseUpdateWishlistDialog = () => {
    setIsUpdateWishlistDialogOpen(false);
  };

  const updateUserWishlistWithTitle = async () => {
    const newWishlist: Wishlist = {
      id: newWishlistId,
      userId: 'current-user', // Using the required userId field
      title: newWishlistName, // Using title field
      description: newWishlistDescription,
      isPublic: newWishlistIsPublic,
      items: [] as WishlistItem[],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setWishlists([...wishlists, newWishlist]);
    setSelectedWishlist(newWishlist);
    setIsCreateWishlistDialogOpen(false);
    toast({
      title: "Wishlist created",
      description: "Your new wishlist has been created.",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Wishlists</CardTitle>
          <CardDescription>Manage your wishlists and items.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center space-x-4">
            <Button onClick={handleOpenCreateWishlistDialog}>Create Wishlist</Button>
            <Button onClick={handleOpenAddItemDialog} disabled={!selectedWishlist}>
              Add Item
            </Button>
            <Button onClick={handleOpenUpdateWishlistDialog} disabled={!selectedWishlist}>
              Update Wishlist
            </Button>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wishlist">Select Wishlist</Label>
            <Select onValueChange={(value) => {
              const selected = wishlists.find((wishlist) => wishlist.id === value);
              if (selected) {
                handleWishlistSelect(selected);
              }
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a wishlist" />
              </SelectTrigger>
              <SelectContent>
                {wishlists.map((wishlist) => (
                  <SelectItem key={wishlist.id} value={wishlist.id}>
                    {wishlist.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedWishlist && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {selectedWishlist.title} Items
              </h3>
              {selectedWishlist.items.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No items in this wishlist.
                </p>
              ) : (
                <ul className="list-disc pl-5">
                  {selectedWishlist.items.map((item) => (
                    <li key={item.id}>{item.name}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddItemDialogOpen} onOpenChange={handleCloseAddItemDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Item to Wishlist</DialogTitle>
            <DialogDescription>
              Add a new item to your selected wishlist.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand" className="text-right">
                Brand
              </Label>
              <Input
                id="brand"
                value={newItemBrand}
                onChange={(e) => setNewItemBrand(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
                value={newItemImage}
                onChange={(e) => setNewItemImage(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                type="number"
                id="price"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currency" className="text-right">
                Currency
              </Label>
              <Select value={newItemCurrency} onValueChange={(value) => setNewItemCurrency(value as Currency)} >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="condition" className="text-right">
                Condition
              </Label>
              <Select value={newItemCondition} onValueChange={(value) => setNewItemCondition(value as PlushieCondition)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Like New">Like New</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                value={newItemUrl}
                onChange={(e) => setNewItemUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={newItemNotes}
                onChange={(e) => setNewItemNotes(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select value={newItemPriority} onValueChange={(value) => setNewItemPriority(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardFooter>
            <Button onClick={handleAddItem}>Add Item</Button>
          </CardFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateWishlistDialogOpen} onOpenChange={handleCloseCreateWishlistDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Wishlist</DialogTitle>
            <DialogDescription>
              Create a new wishlist to save your favorite items.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="wishlistName" className="text-right">
                Wishlist Name
              </Label>
              <Input
                id="wishlistName"
                value={newWishlistName}
                onChange={(e) => setNewWishlistName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="wishlistDescription" className="text-right">
                Description
              </Label>
              <Textarea
                id="wishlistDescription"
                value={newWishlistDescription}
                onChange={(e) => setNewWishlistDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isPublic" className="text-right">
                Public
              </Label>
              <Switch
                id="isPublic"
                checked={newWishlistIsPublic}
                onCheckedChange={(checked) => setNewWishlistIsPublic(checked)}
                className="col-span-3"
              />
            </div>
          </div>
          <CardFooter>
            <Button onClick={updateUserWishlistWithTitle}>Create Wishlist</Button>
          </CardFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateWishlistDialogOpen} onOpenChange={handleCloseUpdateWishlistDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Wishlist</DialogTitle>
            <DialogDescription>
              Update your selected wishlist.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand" className="text-right">
                Brand
              </Label>
              <Input
                id="brand"
                value={newItemBrand}
                onChange={(e) => setNewItemBrand(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
                value={newItemImage}
                onChange={(e) => setNewItemImage(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                type="number"
                id="price"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currency" className="text-right">
                Currency
              </Label>
              <Select value={newItemCurrency} onValueChange={(value) => setNewItemCurrency(value as Currency)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="condition" className="text-right">
                Condition
              </Label>
              <Select value={newItemCondition} onValueChange={(value) => setNewItemCondition(value as PlushieCondition)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Like New">Like New</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                value={newItemUrl}
                onChange={(e) => setNewItemUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={newItemNotes}
                onChange={(e) => setNewItemNotes(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select value={newItemPriority} onValueChange={(value) => setNewItemPriority(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardFooter>
            <Button onClick={handleUpdateWishlist}>Update Wishlist</Button>
          </CardFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default WishlistManager;
