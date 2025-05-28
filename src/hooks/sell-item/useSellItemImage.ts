
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { ImageUploadResult } from "@/types/marketplace";

export const useSellItemImage = () => {
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleImageSelect = (result: ImageUploadResult) => {
    console.log("SellItemForm: Image selected:", result);
    if (!result) return;
    
    if (result?.success && result?.url) {
      setImageUrl(result.url);
    } else {
      toast({
        title: "Upload failed",
        description: (result?.error) || "Failed to upload image",
        variant: "destructive"
      });
    }
  };

  return {
    imageUrl,
    handleImageSelect
  };
};
