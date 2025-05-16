
import { useState } from "react";
import { ImageUploader } from "@/components/post/ImageUploader";
import { Label } from "@/components/ui/label";
import { ImageUploadResult } from "@/types/marketplace";

interface SellItemImageUploaderProps {
  imageUrl: string;
  onImageSelect: (result: ImageUploadResult) => void;
}

export const SellItemImageUploader = ({ imageUrl, onImageSelect }: SellItemImageUploaderProps) => {
  return (
    <div className="mb-6">
      <Label htmlFor="image">Plushie Image</Label>
      <ImageUploader onImageSelected={onImageSelect} />
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
  );
};
