import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageUploadResult } from "@/types/ui";
import { Upload, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
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

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
      setIsEditing(true);
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

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
      setIsEditing(true);
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

  const handleImageSave = (editedImageUrl: string) => {
    setSelectedImage(editedImageUrl);
    setIsEditing(false);
    onImageUpload({ success: true, url: editedImageUrl });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
      className={`border-2 border-dashed rounded-lg ${className}`}
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
            className="absolute bottom-2 right-2"
            onClick={() => setIsEditing(true)}
          >
            Edit Image
          </Button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center p-12 cursor-pointer"
          onClick={triggerFileInput}
        >
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700">
            Drag & drop an image or click to browse
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Supports: {allowedTypes.join(", ")} (Max: {maxSizeMB}MB)
          </p>
        </div>
      )}
    </Card>
  );
};
