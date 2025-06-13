
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CurrencySelector } from "../CurrencySelector";

interface SellItemFormFieldsProps {
  register: any;
  errors: any;
  onSelectChange: (field: string, value: string) => void;
}

export const SellItemFormFields = ({ register, errors, onSelectChange }: SellItemFormFieldsProps) => {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g., Jellycat Bashful Bunny"
              className="mt-1"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="price">Price *</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
                className="flex-1"
              />
              <CurrencySelector />
            </div>
            {errors.price && (
              <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Describe your plushie's condition, history, and any special features..."
            rows={4}
            className="mt-1"
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Condition & Brand */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="condition">Condition *</Label>
            <Select onValueChange={(value) => onSelectChange("condition", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="like new">Like New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>
            {errors.condition && (
              <p className="text-sm text-red-600 mt-1">{errors.condition.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              {...register("brand")}
              placeholder="e.g., Jellycat, Steiff, TY"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="size">Size</Label>
            <Input
              id="size"
              {...register("size")}
              placeholder="e.g., Small, 12 inches"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              {...register("color")}
              placeholder="e.g., Pink, Brown"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="species">Species</Label>
            <Input
              id="species"
              {...register("species")}
              placeholder="e.g., Bear, Bunny"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="material">Material</Label>
            <Input
              id="material"
              {...register("material")}
              placeholder="e.g., Plush, Cotton"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="filling">Filling</Label>
            <Input
              id="filling"
              {...register("filling")}
              placeholder="e.g., Polyester, Beans"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Shipping</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="deliveryMethod">Delivery Method *</Label>
            <Select onValueChange={(value) => onSelectChange("deliveryMethod", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select delivery method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shipping">Shipping</SelectItem>
                <SelectItem value="local pickup">Local Pickup</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
            {errors.deliveryMethod && (
              <p className="text-sm text-red-600 mt-1">{errors.deliveryMethod.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="deliveryCost">Delivery Cost</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="deliveryCost"
                type="number"
                step="0.01"
                {...register("deliveryCost", { valueAsNumber: true })}
                placeholder="0.00"
                className="flex-1"
              />
              <CurrencySelector />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
