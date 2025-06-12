
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SellItemFormFieldsProps {
  register: any;
  errors: any;
  onSelectChange: (field: string, value: string) => void;
}

export const SellItemFormFields = ({ register, errors, onSelectChange }: SellItemFormFieldsProps) => {
  if (!register) {
    return <div>Loading form fields...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Title Field */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          placeholder="e.g., Jellycat Bashful Bunny - Medium"
          {...register("title", { required: "Title is required" })}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && <p className="text-sm font-medium text-destructive">{errors.title.message}</p>}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea 
          id="description"
          placeholder="Describe your plushie, include details about its condition, size, etc."
          rows={4}
          {...register("description", { 
            required: "Description is required",
            minLength: { value: 10, message: "Description must be at least 10 characters" }
          })}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && <p className="text-sm font-medium text-destructive">{errors.description.message}</p>}
      </div>

      {/* Price Field */}
      <div className="space-y-2">
        <Label htmlFor="price">Price ($) *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="25.00"
          {...register("price", { 
            required: "Price is required",
            valueAsNumber: true,
            min: { value: 0, message: "Price must be positive" }
          })}
          className={errors.price ? "border-red-500" : ""}
        />
        {errors.price && <p className="text-sm font-medium text-destructive">{errors.price.message}</p>}
      </div>

      {/* Condition Field */}
      <div className="space-y-2">
        <Label htmlFor="condition">Condition *</Label>
        <Select onValueChange={(value) => onSelectChange("condition", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="like new">Like New</SelectItem>
            <SelectItem value="used">Used</SelectItem>
          </SelectContent>
        </Select>
        {errors.condition && <p className="text-sm font-medium text-destructive">{errors.condition.message}</p>}
      </div>

      {/* Brand Field */}
      <div className="space-y-2">
        <Label htmlFor="brand">Brand</Label>
        <Select onValueChange={(value) => onSelectChange("brand", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select brand (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jellycat">Jellycat</SelectItem>
            <SelectItem value="squishmallows">Squishmallows</SelectItem>
            <SelectItem value="pokemon">Pokemon</SelectItem>
            <SelectItem value="sanrio">Sanrio</SelectItem>
            <SelectItem value="disney">Disney</SelectItem>
            <SelectItem value="build-a-bear">Build-a-Bear</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Size Field */}
      <div className="space-y-2">
        <Label htmlFor="size">Size</Label>
        <Input
          id="size"
          placeholder="e.g., Medium, 12 inches"
          {...register("size")}
        />
      </div>

      {/* Color Field */}
      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          placeholder="e.g., Brown, Pink"
          {...register("color")}
        />
      </div>

      {/* Delivery Method */}
      <div className="space-y-2">
        <Label htmlFor="deliveryMethod">Delivery Method *</Label>
        <Select onValueChange={(value) => onSelectChange("deliveryMethod", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select delivery method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="shipping">Shipping</SelectItem>
            <SelectItem value="local pickup">Local Pickup</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
        {errors.deliveryMethod && <p className="text-sm font-medium text-destructive">{errors.deliveryMethod.message}</p>}
      </div>

      {/* Delivery Cost Field */}
      <div className="space-y-2">
        <Label htmlFor="deliveryCost">Shipping Cost ($)</Label>
        <Input 
          id="deliveryCost"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00 (free shipping)"
          {...register("deliveryCost", {
            valueAsNumber: true,
            setValueAs: (value: string) => {
              const num = parseFloat(value);
              return isNaN(num) ? 0 : num;
            }
          })}
        />
        <p className="text-sm text-muted-foreground">Enter 0 for free shipping</p>
      </div>
    </div>
  );
};
