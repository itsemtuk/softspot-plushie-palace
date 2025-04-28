import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Wishlist, WishlistItem } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";

const wishlistItemSchema = z.object({
  name: z.string().min(2, {
    message: "Item name must be at least 2 characters.",
  }),
  price: z.number().min(0, {
    message: "Price must be a positive number.",
  }),
  description: z.string().optional(),
  imageUrl: z.string().url({
    message: "Image URL must be a valid URL.",
  }),
  linkUrl: z.string().url({
    message: "Link URL must be a valid URL.",
  }).optional(),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['wanted', 'purchased', 'received']),
  currencyCode: z.string().optional(),
  brand: z.string().optional(),
});

interface WishlistManagerProps {
  wishlist: Wishlist;
  onUpdateWishlist: (wishlist: Wishlist) => void;
}

const WishlistManager: React.FC<WishlistManagerProps> = ({ wishlist, onUpdateWishlist }) => {
  const [items, setItems] = useState<WishlistItem[]>(wishlist.items);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const { user } = useUser();

  useEffect(() => {
    setItems(wishlist.items);
  }, [wishlist]);

  const handleAddItem = (item: WishlistItem) => {
    const newItem = { ...item, id: `item-${Date.now()}` };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    onUpdateWishlist({ ...wishlist, items: updatedItems });
    setIsDialogOpen(false);
    toast({
      title: "Item added",
      description: "Item added to wishlist successfully.",
    });
  };

  const handleUpdateItem = (updatedItem: WishlistItem) => {
    const updatedItems = items.map(item => item.id === updatedItem.id ? updatedItem : item);
    setItems(updatedItems);
    onUpdateWishlist({ ...wishlist, items: updatedItems });
    setSelectedItem(null);
    setIsDialogOpen(false);
    toast({
      title: "Item updated",
      description: "Item updated successfully.",
    });
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    onUpdateWishlist({ ...wishlist, items: updatedItems });
    toast({
      title: "Item deleted",
      description: "Item deleted from wishlist.",
    });
  };

  const handleOpenDialog = (item?: WishlistItem) => {
    setSelectedItem(item || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{wishlist.name}</CardTitle>
        <CardDescription>{wishlist.description || "Manage your wishlist items."}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button onClick={() => handleOpenDialog()}>Add Item</Button>
        </div>
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <Table>
            <TableCaption>A list of items in your wishlist.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>${item.price}</TableCell>
                  <TableCell>{item.priority}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(item)}>Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Total</TableCell>
                <TableCell className="text-right">${items.reduce((acc, item) => acc + item.price, 0)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </ScrollArea>

        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Item</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedItem ? "Edit Item" : "Add Item"}</DialogTitle>
              <DialogDescription>
                {selectedItem ? "Update the details of your wishlist item." : "Add a new item to your wishlist."}
              </DialogDescription>
            </DialogHeader>
            <WishlistItemForm
              item={selectedItem}
              onSubmit={selectedItem ? handleUpdateItem : handleAddItem}
              onCancel={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

interface WishlistItemFormProps {
  item?: WishlistItem;
  onSubmit: (item: WishlistItem) => void;
  onCancel: () => void;
}

const WishlistItemForm: React.FC<WishlistItemFormProps> = ({ item, onSubmit, onCancel }) => {
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Item name must be at least 2 characters.",
    }),
    price: z.number().min(0, {
      message: "Price must be a positive number.",
    }),
    description: z.string().optional(),
    imageUrl: z.string().url({
      message: "Image URL must be a valid URL.",
    }),
    linkUrl: z.string().url({
      message: "Link URL must be a valid URL.",
    }).optional(),
    priority: z.enum(['low', 'medium', 'high']),
    status: z.enum(['wanted', 'purchased', 'received']),
    currencyCode: z.string().optional(),
    brand: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || "",
      price: item?.price || 0,
      description: item?.description || "",
      imageUrl: item?.imageUrl || "",
      linkUrl: item?.linkUrl || "",
      priority: item?.priority || "medium",
      status: item?.status || "wanted",
      currencyCode: item?.currencyCode || "USD",
      brand: item?.brand || "",
    },
  });

  const onSubmitHandler = (values: z.infer<typeof formSchema>) => {
    const newItem: WishlistItem = {
      ...values,
      id: item?.id || `item-${Date.now()}`,
      createdAt: item?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSubmit(newItem);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Item name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Item description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Image URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link URL</FormLabel>
              <FormControl>
                <Input placeholder="Link URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="wanted">Wanted</SelectItem>
                  <SelectItem value="purchased">Purchased</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <Input placeholder="Brand" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default WishlistManager;
