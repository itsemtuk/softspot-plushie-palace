
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { PlushieCondition, PlushieMaterial, PlushieFilling, PlushieSpecies, DeliveryMethod, ImageUploadResult } from "@/types/marketplace";
import { ImageUploader } from "@/components/post/ImageUploader";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { saveMarketplaceListings, getMarketplaceListings, getCurrentUserId, setCurrentUserId } from "@/utils/storage/localStorageUtils";

interface SellItemFormData {
  title: string;
  price: number;
  description: string;
  condition: PlushieCondition;
  material: PlushieMaterial;
  filling: PlushieFilling;
  species: PlushieSpecies;
  brand: string;
  deliveryMethod: DeliveryMethod;
  deliveryCost: number;
  color: string;
  image: string;
}

const SellItemPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<SellItemFormData>();

  // Store current user ID for syncing
  if (user?.id) {
    setCurrentUserId(user.id);
  }

  const onSubmit = (data: SellItemFormData) => {
    // Set submission state to prevent multiple clicks
    setIsSubmitting(true);
    
    // Check for required image
    if (!imageUrl) {
      toast({
        title: "Image required",
        description: "Please upload an image of your plushie.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Add the image URL to the form data
      const listingData = { ...data, image: imageUrl };
      
      // Get existing listings
      const listings = getMarketplaceListings();
      
      // Create new listing
      const username = user?.username || user?.firstName || "Anonymous";
      const userId = user?.id || getCurrentUserId();
      
      const newListing = {
        ...listingData,
        id: `listing-${Date.now()}`,
        userId: userId,
        username: username,
        likes: 0,
        comments: 0,
        timestamp: new Date().toISOString(),
        forSale: true,
        tags: []  // Add empty tags array to match MarketplacePlushie type
      };
      
      // Add the new listing and save
      listings.unshift(newListing);
      saveMarketplaceListings(listings);
      
      // Show success message
      toast({
        title: "Listing created!",
        description: "Your item has been listed for sale.",
      });
      
      // Redirect to marketplace
      navigate('/marketplace');
    } catch (error) {
      console.error("Error creating listing:", error);
      toast({
        title: "Error",
        description: "There was a problem creating your listing. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  // Handle the image upload result
  const handleImageSelect = (result: ImageUploadResult) => {
    if (result.success && result.url) {
      setImageUrl(result.url);
    } else {
      toast({
        title: "Upload failed",
        description: result.error || "Failed to upload image",
        variant: "destructive"
      });
    }
  };
  
  // Handle select field changes
  const handleSelectChange = (field: keyof SellItemFormData, value: any) => {
    setValue(field, value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Sell Your Plushie</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="mb-6">
                <Label htmlFor="image">Plushie Image</Label>
                <ImageUploader
                  onImageSelect={handleImageSelect}
                />
                {!imageUrl && (
                  <p className="text-sm text-gray-500 mt-2">
                    Please upload at least one image of your plushie
                  </p>
                )}
                {imageUrl && (
                  <div className="mt-4">
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="h-32 w-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter plushie name"
                    {...register("title", { required: true })}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">Title is required</p>}
                </div>

                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("price", { required: true, min: 0 })}
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">Valid price is required</p>}
                </div>

                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Select onValueChange={(value) => handleSelectChange("brand", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jellycat">Jellycat</SelectItem>
                      <SelectItem value="Squishmallows">Squishmallows</SelectItem>
                      <SelectItem value="Build-A-Bear">Build-A-Bear</SelectItem>
                      <SelectItem value="Care Bears">Care Bears</SelectItem>
                      <SelectItem value="Disney">Disney</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    placeholder="Main color"
                    {...register("color")}
                  />
                </div>

                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select onValueChange={(value) => handleSelectChange("condition", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
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

                <div>
                  <Label htmlFor="material">Material</Label>
                  <Select onValueChange={(value) => handleSelectChange("material", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Plush">Plush</SelectItem>
                      <SelectItem value="Cotton">Cotton</SelectItem>
                      <SelectItem value="Polyester">Polyester</SelectItem>
                      <SelectItem value="Fur">Fur</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="filling">Filling</Label>
                  <Select onValueChange={(value) => handleSelectChange("filling", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select filling" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cotton">Cotton</SelectItem>
                      <SelectItem value="Polyester">Polyester</SelectItem>
                      <SelectItem value="Memory Foam">Memory Foam</SelectItem>
                      <SelectItem value="Beans">Beans</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="species">Species</Label>
                  <Select onValueChange={(value) => handleSelectChange("species", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select species" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bear">Bear</SelectItem>
                      <SelectItem value="Rabbit">Rabbit</SelectItem>
                      <SelectItem value="Cat">Cat</SelectItem>
                      <SelectItem value="Dog">Dog</SelectItem>
                      <SelectItem value="Mythical">Mythical</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="deliveryMethod">Delivery Method</Label>
                  <Select onValueChange={(value) => handleSelectChange("deliveryMethod", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Shipping">Shipping</SelectItem>
                      <SelectItem value="Collection">Collection</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="deliveryCost">Delivery Cost ($)</Label>
                  <Input
                    id="deliveryCost"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("deliveryCost", { min: 0 })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your plushie (condition, size, history, etc.)"
                  className="h-32"
                  {...register("description", { required: true })}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">Description is required</p>}
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/marketplace')}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-softspot-500 hover:bg-softspot-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Listing..." : "List Item for Sale"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellItemPage;
