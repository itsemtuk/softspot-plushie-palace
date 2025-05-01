
import { useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlushieCondition, PlushieMaterial, PlushieFilling, PlushieSpecies, DeliveryMethod } from "@/types/marketplace";

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

interface SellItemFormFieldsProps {
  register: UseFormRegister<SellItemFormData>;
  errors: FieldErrors<SellItemFormData>;
  onSelectChange: (field: keyof SellItemFormData, value: any) => void;
}

export const SellItemFormFields = ({ register, errors, onSelectChange }: SellItemFormFieldsProps) => {
  return (
    <>
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
          <Select onValueChange={(value) => onSelectChange("brand", value)}>
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
          <Select onValueChange={(value) => onSelectChange("condition", value as PlushieCondition)}>
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
          <Select onValueChange={(value) => onSelectChange("material", value as PlushieMaterial)}>
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
          <Select onValueChange={(value) => onSelectChange("filling", value as PlushieFilling)}>
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
          <Select onValueChange={(value) => onSelectChange("species", value as PlushieSpecies)}>
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
          <Select onValueChange={(value) => onSelectChange("deliveryMethod", value as DeliveryMethod)}>
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
    </>
  );
};
