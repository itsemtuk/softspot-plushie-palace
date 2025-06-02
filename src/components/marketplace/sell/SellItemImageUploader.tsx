
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X } from "lucide-react";

interface SellItemImageUploaderProps {
  imageUrl: string;
  onImageSelect: (file: File | null) => void;
}

export const SellItemImageUploader = ({ imageUrl, onImageSelect }: SellItemImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.warn("No file selected");
      return;
    }

    onImageSelect(file);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Card className="bg-white shadow-sm">
        <div className="relative">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt="Uploaded Plushie"
                className="aspect-w-4 aspect-h-3 object-cover rounded-md"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/75"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded-md flex flex-col items-center justify-center">
              <Upload className="h-6 w-6 text-gray-500" />
              <p className="text-sm text-gray-500 mt-2">Upload an image</p>
            </div>
          )}
        </div>
      </Card>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        ref={fileInputRef}
      />

      <Button onClick={handleUploadButtonClick} className="w-full">
        {imageUrl ? "Change Image" : "Upload Image"}
      </Button>
    </div>
  );
};
