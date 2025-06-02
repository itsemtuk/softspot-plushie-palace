import { useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { ImageUploadResult } from "@/types/ui";

export const useSellItemImage = (
  setImageUrl: (url: string) => void,
  setValue: (field: string, value: any) => void
) => {
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No image selected.",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Image size must be less than 5MB.",
        });
        return;
      }

      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        const result: ImageUploadResult = await response.json();

        if (result.success && result.url) {
          setImageUrl(result.url);
          setValue("imageUrl", result.url);
          toast({
            title: "Success!",
            description: "Image uploaded successfully.",
          });
        } else {
          throw new Error(result.error || "Image upload failed");
        }
      } catch (error) {
        console.error("Image upload error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to upload image. Please try again.",
        });
      } finally {
        setUploading(false);
      }
    },
    [setImageUrl, setValue]
  );

  return { handleImageSelect, uploading };
};
