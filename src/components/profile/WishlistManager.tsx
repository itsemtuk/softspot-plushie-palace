import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { WishlistItem, MarketplacePlushie } from '@/types/marketplace';

interface WishlistManagerProps {
  // Add any props here
}

export function WishlistManager() {
  const [newItem, setNewItem] = useState<Partial<WishlistItem>>({
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [priority, setPriority] = useState<WishlistItem['priority']>('medium');
  const [status, setStatus] = useState<WishlistItem['status']>('wanted');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectPriority = (value: WishlistItem['priority']) => {
    setPriority(value);
    setNewItem(prev => ({ ...prev, priority: value }));
  };

  const handleSelectStatus = (value: WishlistItem['status']) => {
    setStatus(value);
    setNewItem(prev => ({ ...prev, status: value }));
  };

  const handleAddToWishlist = () => {
    const newItem: WishlistItem = {
      id: `item-${Date.now()}`,
      plushieId: `plushie-${Date.now()}`,
      userId: "current-user",
      addedAt: new Date().toISOString(), // Fixed: using addedAt instead of addedDate
      name: newItem.name,
      title: newItem.title,
      price: newItem.price,
      description: newItem.description,
      imageUrl: newItem.imageUrl,
      image: newItem.image,
      linkUrl: newItem.linkUrl,
      priority: 'medium',
      status: 'wanted',
      currencyCode: 'USD',
      brand: newItem.brand,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      plushie: {
        id: `plushie-${Date.now()}`,
        name: newItem.name,
        title: newItem.title,
        price: newItem.price || 0,
        imageUrl: newItem.imageUrl || '',
        image: newItem.image,
        description: newItem.description || '',
        condition: 'new',
        material: 'plush',
        species: 'bear',
        size: 'medium',
        filling: 'polyester',
        tags: [],
        location: '',
        forSale: true,
        likes: 0,
        comments: 0
      }
    };

    setWishlistItems(prev => [...prev, newItem]);
    setNewItem({
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Manage Wishlist</CardTitle>
          <CardDescription>Add items to your wishlist.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                name="name"
                placeholder="Item Name"
                value={newItem.name || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Input
                type="text"
                name="title"
                placeholder="Item Title"
                value={newItem.title || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Input
                type="number"
                name="price"
                placeholder="Price"
                value={newItem.price || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Input
                type="text"
                name="imageUrl"
                placeholder="Image URL"
                value={newItem.imageUrl || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <Textarea
            name="description"
            placeholder="Description"
            value={newItem.description || ''}
            onChange={handleInputChange}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select onValueChange={handleSelectPriority} defaultValue={priority}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select onValueChange={handleSelectStatus} defaultValue={status}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wanted">Wanted</SelectItem>
                  <SelectItem value="purchased">Purchased</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button onClick={handleAddToWishlist}>Add to Wishlist</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Wishlist Items</CardTitle>
          <CardDescription>Your saved wishlist items.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] w-full">
            <div className="grid gap-4">
              {wishlistItems.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Price: {item.price}</p>
                    <p>Priority: <Badge>{item.priority}</Badge></p>
                    <p>Status: <Badge>{item.status}</Badge></p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
