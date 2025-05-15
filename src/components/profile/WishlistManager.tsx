import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  Wishlist,
  WishlistItem
} from "@/types/marketplace";

// This function creates a proper WishlistItem object with all required properties
const createWishlistItem = (itemData: Partial<WishlistItem>): WishlistItem => {
  const now = new Date().toISOString();
  return {
    id: itemData.id || `item-${Date.now()}`,
    plushieId: itemData.plushieId || `plushie-${Date.now()}`,
    title: itemData.name || 'New Item',
    name: itemData.name || 'New Item',
    price: itemData.price || 0,
    description: itemData.description || '',
    imageUrl: itemData.imageUrl || '',
    image: itemData.image || '',
    linkUrl: itemData.linkUrl || '',
    priority: itemData.priority || 'medium',
    status: itemData.status || 'wanted',
    currencyCode: itemData.currencyCode || 'USD',
    createdAt: itemData.createdAt || now,
    updatedAt: itemData.updatedAt || now,
    addedDate: itemData.addedDate || now,
    brand: itemData.brand || '',
  };
};

// Update the component props type
interface WishlistManagerProps {
  wishlist: Wishlist[];
  onUpdateWishlist: (wishlist: Wishlist[]) => void;
}

const WishlistManager: React.FC<WishlistManagerProps> = ({ wishlist, onUpdateWishlist }) => {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [selectedWishlistId, setSelectedWishlistId] = useState<string | null>(null);
  const [isEditingWishlist, setIsEditingWishlist] = useState(false);
  const [editingWishlistId, setEditingWishlistId] = useState<string | null>(null);
  const [newWishlistName, setNewWishlistName] = useState('');
  const [newWishlistDescription, setNewWishlistDescription] = useState('');
  const [isCreatingWishlist, setIsCreatingWishlist] = useState(false);
  const [newWishlistPrivacy, setNewWishlistPrivacy] = useState<"public" | "private" | "friends">("public");
  const [isDeletingWishlist, setIsDeletingWishlist] = useState(false);
  const [deletingWishlistId, setDeletingWishlistId] = useState<string | null>(null);
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedItemName, setEditedItemName] = useState('');
  const [editedItemPrice, setEditedItemPrice] = useState(0);
  const [editedItemDescription, setEditedItemDescription] = useState('');
  const [editedItemImageUrl, setEditedItemImageUrl] = useState('');
  const [editedItemLinkUrl, setEditedItemLinkUrl] = useState('');
  const [editedItemPriority, setEditedItemPriority] = useState<"low" | "medium" | "high">("medium");
  const [editedItemStatus, setEditedItemStatus] = useState<"wanted" | "purchased" | "received">("wanted");
  const [editedItemCurrencyCode, setEditedItemCurrencyCode] = useState('USD');
  const [editedItemBrand, setEditedItemBrand] = useState('');
  const [isDeletingItem, setIsDeletingItem] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const handleAddItemClick = (wishlistId: string) => {
    setIsAddingItem(true);
    setSelectedWishlistId(wishlistId);
  };

  const handleCloseAddItem = () => {
    setIsAddingItem(false);
    setSelectedWishlistId(null);
  };

  const handleEditWishlistClick = (wishlistId: string) => {
    const selectedWishlist = wishlist.find((w) => w.id === wishlistId);
    if (selectedWishlist) {
      setEditingWishlistId(wishlistId);
      setNewWishlistName(selectedWishlist.name);
      setNewWishlistDescription(selectedWishlist.description || '');
      setIsEditingWishlist(true);
    }
  };

  const handleCloseEditWishlist = () => {
    setIsEditingWishlist(false);
    setEditingWishlistId(null);
    setNewWishlistName('');
    setNewWishlistDescription('');
  };

  const handleCreateWishlistClick = () => {
    setIsCreatingWishlist(true);
  };

  const handleCloseCreateWishlist = () => {
    setIsCreatingWishlist(false);
    setNewWishlistName('');
    setNewWishlistDescription('');
    setNewWishlistPrivacy("public");
  };

  const handleDeleteWishlistClick = (wishlistId: string) => {
    setIsDeletingWishlist(true);
    setDeletingWishlistId(wishlistId);
  };

  const handleCloseDeleteWishlist = () => {
    setIsDeletingWishlist(false);
    setDeletingWishlistId(null);
  };

  const handleEditItemClick = (itemId: string) => {
    const selectedItem = wishlist.flatMap(w => w.items || []).find(item => item?.id === itemId);
    if (selectedItem) {
      setEditingItemId(itemId);
      setEditedItemName(selectedItem.name);
      setEditedItemPrice(selectedItem.price || 0);
      setEditedItemDescription(selectedItem.description || '');
      setEditedItemImageUrl(selectedItem.imageUrl || '');
      setEditedItemLinkUrl(selectedItem.linkUrl || '');
      
      // Fix the type handling for priority and status
      if (typeof selectedItem.priority === 'string') {
        setEditedItemPriority(selectedItem.priority as "low" | "medium" | "high");
      } else {
        setEditedItemPriority("medium");
      }
      
      if (selectedItem.status === 'wanted' || selectedItem.status === 'purchased' || selectedItem.status === 'received') {
        setEditedItemStatus(selectedItem.status);
      } else {
        setEditedItemStatus("wanted");
      }
      
      setEditedItemCurrencyCode(selectedItem.currencyCode || 'USD');
      setEditedItemBrand(selectedItem.brand || '');
      setIsEditingItem(true);
    }
  };

  const handleCloseEditItem = () => {
    setIsEditingItem(false);
    setEditingItemId(null);
    setEditedItemName('');
    setEditedItemPrice(0);
    setEditedItemDescription('');
    setEditedItemImageUrl('');
    setEditedItemLinkUrl('');
    setEditedItemPriority("medium");
    setEditedItemStatus("wanted");
    setEditedItemCurrencyCode('USD');
    setEditedItemBrand('');
  };

  const handleDeleteItemClick = (itemId: string) => {
    setIsDeletingItem(true);
    setDeletingItemId(itemId);
  };

  const handleCloseDeleteItem = () => {
    setIsDeletingItem(false);
    setDeletingItemId(null);
  };

  const updateWishlist = (updatedWishlist: Wishlist[]) => {
    onUpdateWishlist(updatedWishlist);
  };

  const handleSaveWishlist = () => {
    if (!editingWishlistId) return;

    const updatedWishlist = wishlist.map((w) =>
      w.id === editingWishlistId
        ? { ...w, name: newWishlistName, description: newWishlistDescription }
        : w
    );
    updateWishlist(updatedWishlist);
    handleCloseEditWishlist();
    toast({
      title: "Wishlist updated!",
      description: "Your wishlist has been successfully updated.",
    });
  };

  const handleCreateWishlist = () => {
    const newWishlist: Wishlist = {
      id: uuidv4(),
      name: newWishlistName,
      description: newWishlistDescription,
      items: [],
      privacy: newWishlistPrivacy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: newWishlistPrivacy === "public",
      userId: '', // Add missing userId property
    };

    updateWishlist([...wishlist, newWishlist]);
    handleCloseCreateWishlist();
    toast({
      title: "Wishlist created!",
      description: "Your new wishlist has been successfully created.",
    });
  };

  const handleDeleteWishlist = () => {
    if (!deletingWishlistId) return;

    const updatedWishlist = wishlist.filter((w) => w.id !== deletingWishlistId);
    updateWishlist(updatedWishlist);
    handleCloseDeleteWishlist();
    toast({
      title: "Wishlist deleted!",
      description: "Your wishlist has been successfully deleted.",
    });
  };

  // Fix the specific part of the addItemToWishlist function that creates a new WishlistItem
  // This replaces the code around line 244 that was causing the build error
  const addItemToWishlist = (wishlistId) => {
    const newItem = createWishlistItem({
      name: 'New Wishlist Item',
      price: 0,
      description: '',
      status: 'wanted',
      priority: 'medium',
      imageUrl: '',
      currencyCode: 'USD',
      brand: '',
    });

    const updatedWishlist = wishlist.map((w) =>
      w.id === wishlistId ? { ...w, items: [...w.items, newItem] } : w
    );
    updateWishlist(updatedWishlist);
    handleCloseAddItem();
    toast({
      title: "Item added!",
      description: "A new item has been added to your wishlist.",
    });
  };

  const handleSaveItem = () => {
    if (!editingItemId) return;

    const updatedWishlist = wishlist.map((w) => ({
      ...w,
      items: w.items.map((item) =>
        item.id === editingItemId
          ? {
              ...item,
              name: editedItemName,
              price: editedItemPrice,
              description: editedItemDescription,
              imageUrl: editedItemImageUrl,
              linkUrl: editedItemLinkUrl,
              priority: editedItemPriority,
              status: editedItemStatus,
              currencyCode: editedItemCurrencyCode,
              brand: editedItemBrand,
            }
          : item
      ),
    }));
    updateWishlist(updatedWishlist);
    handleCloseEditItem();
    toast({
      title: "Item updated!",
      description: "Your wishlist item has been successfully updated.",
    });
  };

  const handleDeleteItem = () => {
    if (!deletingItemId) return;

    const updatedWishlist = wishlist.map((w) => ({
      ...w,
      items: w.items.filter((item) => item.id !== deletingItemId),
    }));
    updateWishlist(updatedWishlist);
    handleCloseDeleteItem();
    toast({
      title: "Item deleted!",
      description: "Your wishlist item has been successfully deleted.",
    });
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleCreateWishlistClick} className="bg-softspot-500 hover:bg-softspot-600">
        Create New Wishlist
      </Button>

      {wishlist.map((wishlist) => (
        <Card key={wishlist.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <CardHeader className="p-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">{wishlist.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditWishlistClick(wishlist.id)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteWishlistClick(wishlist.id)} className="text-red-500">
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription className="text-gray-500">{wishlist.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <ScrollArea className="h-[300px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Item</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wishlist.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>${item.price}</TableCell>
                      <TableCell>{item.priority}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditItemClick(item.id)}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteItemClick(item.id)} className="text-red-500">
                              <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4">
            <Button onClick={() => handleAddItemClick(wishlist.id)} className="bg-softspot-500 hover:bg-softspot-600">
              Add Item to Wishlist
            </Button>
          </CardFooter>
        </Card>
      ))}

      {/* Dialogs */}
      <Dialog open={isAddingItem} onOpenChange={handleCloseAddItem}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Item to Wishlist</DialogTitle>
            <DialogDescription>
              Are you sure you want to add a new item to this wishlist?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
          </div>
          <Button onClick={() => selectedWishlistId && addItemToWishlist(selectedWishlistId)} className="bg-softspot-500 hover:bg-softspot-600">
            Add Item
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditingWishlist} onOpenChange={handleCloseEditWishlist}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Wishlist</DialogTitle>
            <DialogDescription>
              Make changes to your wishlist here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={newWishlistName} onChange={(e) => setNewWishlistName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea id="description" value={newWishlistDescription} onChange={(e) => setNewWishlistDescription(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <Button onClick={handleSaveWishlist} className="bg-softspot-500 hover:bg-softspot-600">
            Save changes
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreatingWishlist} onOpenChange={handleCloseCreateWishlist}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Wishlist</DialogTitle>
            <DialogDescription>
              Create a new wishlist to save your desired items.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={newWishlistName} onChange={(e) => setNewWishlistName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea id="description" value={newWishlistDescription} onChange={(e) => setNewWishlistDescription(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="privacy" className="text-right">
                Privacy
              </Label>
              <Select onValueChange={(value) => setNewWishlistPrivacy(value as "public" | "private" | "friends")}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select privacy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="friends">Friends</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleCreateWishlist} className="bg-softspot-500 hover:bg-softspot-600">
            Create Wishlist
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeletingWishlist} onOpenChange={handleCloseDeleteWishlist}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Wishlist</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this wishlist? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
          </div>
          <Button onClick={handleDeleteWishlist} className="bg-red-500 hover:bg-red-600 text-white">
            Delete Wishlist
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditingItem} onOpenChange={handleCloseEditItem}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Make changes to your item here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={editedItemName} onChange={(e) => setEditedItemName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input id="price" type="number" value={editedItemPrice} onChange={(e) => setEditedItemPrice(Number(e.target.value))} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea id="description" value={editedItemDescription} onChange={(e) => setEditedItemDescription(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                Image URL
              </Label>
              <Input id="imageUrl" value={editedItemImageUrl} onChange={(e) => setEditedItemImageUrl(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="linkUrl" className="text-right">
                Link URL
              </Label>
              <Input id="linkUrl" value={editedItemLinkUrl} onChange={(e) => setEditedItemLinkUrl(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select onValueChange={(value) => setEditedItemPriority(value as "low" | "medium" | "high")} defaultValue={editedItemPriority}>
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
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select onValueChange={(value) => setEditedItemStatus(value as "wanted" | "purchased" | "received")} defaultValue={editedItemStatus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wanted">Wanted</SelectItem>
                  <SelectItem value="purchased">Purchased</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currencyCode" className="text-right">
                Currency
              </Label>
              <Select onValueChange={(value) => setEditedItemCurrencyCode(value)} defaultValue={editedItemCurrencyCode}>
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
              <Label htmlFor="brand" className="text-right">
                Brand
              </Label>
              <Input id="brand" value={editedItemBrand} onChange={(e) => setEditedItemBrand(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <Button onClick={handleSaveItem} className="bg-softspot-500 hover:bg-softspot-600">
            Save changes
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeletingItem} onOpenChange={handleCloseDeleteItem}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
          </div>
          <Button onClick={handleDeleteItem} className="bg-red-500 hover:bg-red-600 text-white">
            Delete Item
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WishlistManager;
