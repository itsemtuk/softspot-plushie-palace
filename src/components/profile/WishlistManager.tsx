import { useState, useEffect } from "react";
import { Heart, Plus, Trash2, ExternalLink, Tag, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { WishlistItem } from "@/types/user";

interface WishlistManagerProps {
  wishlistItems: WishlistItem[];
  onItemAdded: (item: WishlistItem) => void;
  onItemDeleted: (itemId: string) => void;
  onItemUpdated: (item: WishlistItem) => void;
}

export const WishlistManager = ({
  wishlistItems,
  onItemAdded,
  onItemDeleted,
  onItemUpdated,
}: WishlistManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<Omit<WishlistItem, 'id' | 'addedAt'>>({
    plushieId: '',
    userId: '',
    name: '',
    title: '',
    price: 0,
    description: '',
    imageUrl: '',
    image: '',
    linkUrl: '',
    priority: 'medium',
    status: 'wanted',
    currencyCode: 'USD',
    brand: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleAddItem = () => {
    const newItemWithDefaults: WishlistItem = {
      id: `wishlist-item-${Date.now()}`,
      addedAt: new Date().toISOString(),
      ...newItem,
    };
    onItemAdded(newItemWithDefaults);
    setNewItem({
      plushieId: '',
      userId: '',
      name: '',
      title: '',
      price: 0,
      description: '',
      imageUrl: '',
      image: '',
      linkUrl: '',
      priority: 'medium',
      status: 'wanted',
      currencyCode: 'USD',
      brand: '',
    });
    setIsDialogOpen(false);
    toast({
      title: "Item added",
      description: "The item has been added to your wishlist.",
    });
  };

  const handleDeleteItem = (itemId: string) => {
    onItemDeleted(itemId);
    toast({
      title: "Item deleted",
      description: "The item has been removed from your wishlist.",
    });
  };

  const handleUpdateItem = (item: WishlistItem) => {
    onItemUpdated(item);
    toast({
      title: "Item updated",
      description: "The item has been updated in your wishlist.",
    });
  };

  return (
    <div>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>My Wishlist</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Item</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" name="name" value={newItem.name || ''} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input id="title" name="title" value={newItem.title || ''} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price
                    </Label>
                    <Input id="price" name="price" type="number" value={newItem.price || 0} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="imageUrl" className="text-right">
                      Image URL
                    </Label>
                    <Input id="imageUrl" name="imageUrl" value={newItem.imageUrl || ''} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="linkUrl" className="text-right">
                      Link URL
                    </Label>
                    <Input id="linkUrl" name="linkUrl" value={newItem.linkUrl || ''} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea id="description" name="description" value={newItem.description || ''} onChange={handleInputChange} className="col-span-3" />
                  </div>
                </div>
                <Button onClick={handleAddItem}>Add Item</Button>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {wishlistItems.length === 0 ? (
            <p>Your wishlist is empty.</p>
          ) : (
            <div className="grid gap-4">
              {wishlistItems.map(item => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{item.name || item.title}</span>
                      <div className="space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {item.linkUrl && (
                          <Button variant="ghost" size="icon" asChild>
                            <a href={item.linkUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.name || item.title} className="rounded-md aspect-video object-cover" />
                      )}
                      <p className="text-sm">{item.description}</p>
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4" />
                        <span>{item.brand}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{item.price}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
