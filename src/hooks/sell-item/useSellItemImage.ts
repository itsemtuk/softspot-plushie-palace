
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { ImageUploadResult } from "@/types/marketplace";

export const useSellItemImage = (setImageUrl: (url: string) => void, setValue: (name: string, value: any) => void) => {
  const handleImageSelect = (result: ImageUploadResult) => {
    console.log("SellItemForm: Image selected:", result);
    if (!result) return;
    
    if (result?.success && result?.url) {
      setImageUrl(result.url);
      setValue('imageUrl', result.url);
      setValue('image', result.url);
    } else {
      toast({
        title: "Upload failed",
        description: (result?.error) || "Failed to upload image",
        variant: "destructive"
      });
    }
  };

  return {
    handleImageSelect
  };
};
