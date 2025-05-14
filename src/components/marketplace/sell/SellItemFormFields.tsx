
import { useState } from "react";
import { 
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { conditionOptions, materialOptions, fillingOptions, speciesOptions, deliveryMethodOptions, brandOptions } from "@/components/onboarding/onboardingData";
import { Label } from "@/components/ui/label";

export const SellItemFormFields = ({ 
  register, 
  errors, 
  onSelectChange 
}) => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [otherBrandValue, setOtherBrandValue] = useState("");
  
  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);
    if (value !== "other") {
      onSelectChange("brand", value);
    } else {
      onSelectChange("brand", otherBrandValue || "Other");
    }
  };
  
  const handleOtherBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherBrandValue(e.target.value);
    if (selectedBrand === "other") {
      onSelectChange("brand", e.target.value || "Other");
    }
  };
  
  return (
    <>
      <div className="space-y-4">
        <FormItem>
          <FormLabel htmlFor="title">Title</FormLabel>
          <FormControl>
            <Input 
              id="title"
              placeholder="Enter a title for your listing"
              {...register("title", { required: "Title is required" })}
              className={errors.title ? "border-red-500" : ""}
            />
          </FormControl>
          {errors.title && <FormMessage>{errors.title.message}</FormMessage>}
        </FormItem>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItem>
            <FormLabel htmlFor="price">Price ($)</FormLabel>
            <FormControl>
              <Input 
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register("price", { 
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" }
                })}
                className={errors.price ? "border-red-500" : ""}
              />
            </FormControl>
            {errors.price && <FormMessage>{errors.price.message}</FormMessage>}
          </FormItem>
          
          <FormItem>
            <FormLabel htmlFor="color">Color</FormLabel>
            <FormControl>
              <Input 
                id="color"
                placeholder="Primary color"
                {...register("color")}
              />
            </FormControl>
          </FormItem>
        </div>
        
        <FormItem>
          <FormLabel htmlFor="description">Description</FormLabel>
          <FormControl>
            <Textarea 
              id="description"
              placeholder="Describe your plushie, include details about its condition, size, etc."
              {...register("description", { required: "Description is required" })}
              className={`min-h-[120px] resize-y ${errors.description ? "border-red-500" : ""}`}
            />
          </FormControl>
          {errors.description && <FormMessage>{errors.description.message}</FormMessage>}
        </FormItem>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>Condition</FormLabel>
            <Select 
              onValueChange={(value) => onSelectChange("condition", value)} 
              defaultValue="like-new"
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {conditionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
          
          <FormItem>
            <FormLabel>Brand</FormLabel>
            <Select 
              onValueChange={handleBrandChange}
              defaultValue=""
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {brandOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </div>
        
        {/* Show input field when "Other" brand is selected */}
        {selectedBrand === "other" && (
          <FormItem>
            <FormLabel htmlFor="otherBrand">Specify Brand</FormLabel>
            <FormControl>
              <Input
                id="otherBrand"
                placeholder="Enter brand name"
                value={otherBrandValue}
                onChange={handleOtherBrandChange}
              />
            </FormControl>
          </FormItem>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>Material</FormLabel>
            <Select 
              onValueChange={(value) => onSelectChange("material", value)}
              defaultValue="plush"
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {materialOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
          
          <FormItem>
            <FormLabel>Filling</FormLabel>
            <Select 
              onValueChange={(value) => onSelectChange("filling", value)}
              defaultValue="polyester"
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select filling" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {fillingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>Species/Type</FormLabel>
            <Select 
              onValueChange={(value) => onSelectChange("species", value)}
              defaultValue=""
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {speciesOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
          
          <FormItem>
            <FormLabel>Delivery Method</FormLabel>
            <Select 
              onValueChange={(value) => onSelectChange("deliveryMethod", value)}
              defaultValue="shipping"
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select delivery method" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {deliveryMethodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        </div>
        
        <FormItem>
          <FormLabel htmlFor="deliveryCost">Shipping Cost ($)</FormLabel>
          <FormControl>
            <Input 
              id="deliveryCost"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00 (free shipping)"
              {...register("deliveryCost")}
            />
          </FormControl>
          <FormDescription>Enter 0 for free shipping</FormDescription>
        </FormItem>
      </div>
    </>
  );
};
