
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
  const [imageUrl, setImageUrl] = useState<string>("");
  const { register, handleSubmit, formState: { errors } } = useForm<SellItemFormData>();

  const onSubmit = (data: SellItemFormData) => {
    console.log("Form submitted:", { ...data, image: imageUrl });
  };

  // Handle the image upload result
  const handleImageSelect = (result: ImageUploadResult) => {
    if (result.success && result.url) {
      setImageUrl(result.url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Sell Your Plushie</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <ImageUploader
                onImageSelect={handleImageSelect}
              />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter plushie name"
                    {...register("title", { required: true })}
                  />
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
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your plushie..."
                    {...register("description", { required: true })}
                  />
                </div>

                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select onValueChange={(value) => register("condition").onChange({ target: { value } })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {["New", "Like New", "Good", "Fair", "Poor"].map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="deliveryMethod">Delivery Method</Label>
                  <Select onValueChange={(value) => register("deliveryMethod").onChange({ target: { value } })}>
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
              </div>

              <Button type="submit" className="w-full">
                List Item for Sale
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellItemPage;
