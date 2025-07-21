import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExtendedPost } from "@/types/core";
import { supabase, createAuthenticatedSupabaseClient } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@clerk/clerk-react";

interface EditMarketplaceItemProps {
  post: ExtendedPost;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedPost: ExtendedPost) => void;
}

export const EditMarketplaceItem = ({ post, isOpen, onClose, onUpdate }: EditMarketplaceItemProps) => {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    title: post.title || '',
    description: post.description || '',
    content: post.content || '',
    price: post.price?.toString() || '',
    brand: post.brand || '',
    condition: post.condition || '',
    size: post.size || '',
    color: post.color || '',
    material: post.material || '',
    species: post.species || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasBids, setHasBids] = useState(false);

  useEffect(() => {
    if (post && isOpen) {
      setFormData({
        title: post.title || '',
        description: post.description || '',
        content: post.content || '',
        price: post.price?.toString() || '',
        brand: post.brand || '',
        condition: post.condition || '',
        size: post.size || '',
        color: post.color || '',
        material: post.material || '',
        species: post.species || ''
      });
      
      // Check if item has bids
      checkForBids();
    }
  }, [post, isOpen]);

  const checkForBids = async () => {
    try {
      // Check if there are any bids on this item
      const { data: bids, error } = await supabase
        .from('listing_bids')
        .select('id')
        .eq('listing_id', post.id)
        .limit(1);

      if (error) {
        console.error("Error checking for bids:", error);
        return;
      }

      setHasBids(bids && bids.length > 0);
    } catch (error) {
      console.error("Error checking for bids:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hasBids) {
      toast({
        variant: "destructive",
        title: "Cannot edit item",
        description: "This item cannot be edited because it has received bids."
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get authenticated Clerk token for Supabase
      const token = await getToken({ template: "supabase" });
      if (!token) {
        throw new Error("Failed to get authentication token");
      }

      const authenticatedSupabase = createAuthenticatedSupabaseClient(token);

      const updateData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        price: formData.price ? parseFloat(formData.price) : null,
        brand: formData.brand,
        condition: formData.condition,
        size: formData.size,
        color: formData.color,
        material: formData.material,
        species: formData.species,
        updated_at: new Date().toISOString()
      };

      const { error } = await authenticatedSupabase
        .from('posts')
        .update(updateData)
        .eq('id', post.id);

      if (error) {
        throw error;
      }

      const updatedPost: ExtendedPost = {
        ...post,
        ...updateData,
        updatedAt: updateData.updated_at
      };

      onUpdate(updatedPost);
      toast({
        title: "Item updated",
        description: "Your marketplace item has been updated successfully."
      });
      onClose();
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update item. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Marketplace Item</DialogTitle>
        </DialogHeader>

        {hasBids && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              ⚠️ This item cannot be edited because it has received bids from other users.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Jellycat Bashful Bunny - Medium"
                disabled={hasBids}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe your plushie's condition, history, and any special features..."
                disabled={hasBids}
              />
            </div>

            <div>
              <Label htmlFor="content">Additional Details</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Any additional information about the item..."
                disabled={hasBids}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="0.00"
                disabled={hasBids}
              />
            </div>

            <div>
              <Label>Brand</Label>
              <Select 
                value={formData.brand} 
                onValueChange={(value) => setFormData({...formData, brand: value})}
                disabled={hasBids}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jellycat">Jellycat</SelectItem>
                  <SelectItem value="squishmallows">Squishmallows</SelectItem>
                  <SelectItem value="buildabear">Build-A-Bear</SelectItem>
                  <SelectItem value="pokemon">Pokemon</SelectItem>
                  <SelectItem value="sanrio">Sanrio</SelectItem>
                  <SelectItem value="disney">Disney</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Condition</Label>
              <Select 
                value={formData.condition} 
                onValueChange={(value) => setFormData({...formData, condition: value})}
                disabled={hasBids}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New with tags</SelectItem>
                  <SelectItem value="like-new">Like new</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                value={formData.size}
                onChange={(e) => setFormData({...formData, size: e.target.value})}
                placeholder="e.g., Small, Medium, Large"
                disabled={hasBids}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                placeholder="e.g., Pink, Brown, Multi-color"
                disabled={hasBids}
              />
            </div>

            <div>
              <Label htmlFor="species">Animal/Character</Label>
              <Input
                id="species"
                value={formData.species}
                onChange={(e) => setFormData({...formData, species: e.target.value})}
                placeholder="e.g., Bunny, Bear, Dragon"
                disabled={hasBids}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                value={formData.material}
                onChange={(e) => setFormData({...formData, material: e.target.value})}
                placeholder="e.g., Plush, Cotton, Velvet"
                disabled={hasBids}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-softspot-500 hover:bg-softspot-600" 
              disabled={isLoading || hasBids}
            >
              {isLoading ? "Updating..." : "Update Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};