
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import FileUploader from "@/components/common/FileUploader";

const sellItemSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be a positive number"),
  brand: z.string().optional(),
  condition: z.enum(["new", "used", "like new"]),
  material: z.string().optional(),
  filling: z.string().optional(),
  species: z.string().optional(),
  deliveryMethod: z.enum(["shipping", "local pickup", "both"]),
  deliveryCost: z.number().min(0).optional(),
  size: z.string().optional(),
  color: z.string().optional(),
});

type SellItemFormData = z.infer<typeof sellItemSchema>;

interface ImprovedSellItemFormProps {
  onSuccess?: () => void;
}

export const ImprovedSellItemForm = ({ onSuccess }: ImprovedSellItemFormProps) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const form = useForm<SellItemFormData>({
    resolver: zodResolver(sellItemSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      brand: "",
      condition: "new",
      material: "",
      filling: "",
      species: "",
      deliveryMethod: "shipping",
      deliveryCost: 0,
      size: "",
      color: "",
    },
  });

  const handleImageUpload = (path: string) => {
    const { data } = supabase.storage.from('uploads').getPublicUrl(path);
    setImageUrl(data.publicUrl);
    toast({
      title: "Image uploaded successfully",
      description: "Your image has been uploaded and is ready to use.",
    });
  };

  const handleImageRemove = () => {
    setImageUrl("");
  };

  const onSubmit = async (data: SellItemFormData) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to sell items",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = {
        content: `${data.title}\n\n${data.description}`,
        user_id: user.id,
        title: data.title,
        description: data.description,
        image: imageUrl,
        price: data.price,
        brand: data.brand || null,
        condition: data.condition,
        material: data.material || null,
        filling: data.filling || null,
        species: data.species || null,
        delivery_method: data.deliveryMethod,
        delivery_cost: data.deliveryCost || null,
        size: data.size || null,
        color: data.color || null,
        for_sale: true,
        tags: [],
        created_at: new Date().toISOString(),
      };

      const { data: result, error } = await supabase
        .from('posts')
        .insert([postData])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        toast({
          variant: "destructive",
          title: "Failed to list item",
          description: error.message || "Please try again",
        });
        return;
      }

      toast({
        title: "Item listed successfully!",
        description: "Your plushie has been added to the marketplace.",
      });
      
      form.reset();
      setImageUrl("");
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/marketplace');
      }
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-softspot-100 dark:from-purple-900 dark:to-softspot-900">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          Sell Your Plushie
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Plushie Image</Label>
            <FileUploader
              onSuccess={handleImageUpload}
              accept="image/*"
              maxSize={5}
              currentImageUrl={imageUrl}
              onRemove={handleImageRemove}
              className="w-full"
            />
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter plushie title"
                {...form.register("title")}
                className={form.formState.errors.title ? "border-red-500" : ""}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...form.register("price", { valueAsNumber: true })}
                className={form.formState.errors.price ? "border-red-500" : ""}
              />
              {form.formState.errors.price && (
                <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your plushie..."
              rows={4}
              {...form.register("description")}
              className={form.formState.errors.description ? "border-red-500" : ""}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Condition *</Label>
              <Select onValueChange={(value) => form.setValue("condition", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like new">Like New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                placeholder="e.g., Jellycat, Squishmallow"
                {...form.register("brand")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                placeholder="e.g., Small, Medium, Large"
                {...form.register("size")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                placeholder="e.g., Pink, Blue, Brown"
                {...form.register("color")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="species">Species</Label>
              <Input
                id="species"
                placeholder="e.g., Bear, Cat, Dog"
                {...form.register("species")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                placeholder="e.g., Cotton, Polyester"
                {...form.register("material")}
              />
            </div>
          </div>

          {/* Delivery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Delivery Method *</Label>
              <Select onValueChange={(value) => form.setValue("deliveryMethod", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select delivery method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shipping">Shipping</SelectItem>
                  <SelectItem value="local pickup">Local Pickup</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryCost">Shipping Cost ($)</Label>
              <Input
                id="deliveryCost"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00 (free shipping)"
                {...form.register("deliveryCost", { valueAsNumber: true })}
              />
              <p className="text-sm text-muted-foreground">Enter 0 for free shipping</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/marketplace')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-softspot-600 hover:bg-softspot-700 text-white"
            >
              {isSubmitting ? "Listing..." : "List for Sale"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
