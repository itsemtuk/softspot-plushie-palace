
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageUploadResult, ImageEditorOptions } from "@/types/ui";
import { Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ImageEditor } from "./ImageEditor";

interface ImageUploaderProps {
  onImageUpload: (result: ImageUploadResult) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
  className?: string;
}

export const ImageUploader = ({
  onImageUpload,
  maxSizeMB = 5,
  allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  className = "",
}: ImageUploaderProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: `Please upload a valid image file (${allowedTypes.join(", ")})`,
      });
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `Please upload an image smaller than ${maxSizeMB}MB`,
      });
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
      setIsEditing(true);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: `Please upload a valid image file (${allowedTypes.join(", ")})`,
      });
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `Please upload an image smaller than ${maxSizeMB}MB`,
      });
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
      setIsEditing(true);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageUpload({ success: false });
  };

  const handleImageSave = (options: ImageEditorOptions) => {
    // In a real implementation, you would apply the editing options to the image
    // For now, we'll just return the original image URL
    setIsEditing(false);
    onImageUpload({ success: true, url: selectedImage || "" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const triggerFileInput = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  if (isEditing && selectedImage) {
    return (
      <ImageEditor
        imageUrl={selectedImage}
        onSave={handleImageSave}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <Card
      className={`border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 ${className}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={allowedTypes.join(",")}
        className="hidden"
      />

      {selectedImage ? (
        <div className="relative">
          <img
            src={selectedImage}
            alt="Selected"
            className="w-full h-auto rounded-lg"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            onClick={() => setIsEditing(true)}
          >
            Edit Image
          </Button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center p-12 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={triggerFileInput}
        >
          {isUploading ? (
            <>
              <div className="h-12 w-12 border-4 border-softspot-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Uploading...
              </p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Drag & drop an image or click to browse
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Supports: {allowedTypes.join(", ")} (Max: {maxSizeMB}MB)
              </p>
            </>
          )}
        </div>
      )}
    </Card>
  );
};
