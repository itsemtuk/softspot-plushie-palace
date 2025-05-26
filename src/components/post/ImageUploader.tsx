
import { useState, ChangeEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { ImageUploadResult } from '@/types/marketplace';
import { RobustImage } from '@/components/ui/robust-image';

interface ImageUploaderProps {
  onImageSelected: (result: ImageUploadResult) => void;
  defaultImage?: string;
  className?: string;
  buttonText?: string;
  aspectRatio?: number;
}

export const ImageUploader = ({
  onImageSelected,
  defaultImage,
  className = '',
  buttonText = 'Upload Image',
  aspectRatio
}: ImageUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImage || null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    handleSelectedFile(file);
  };
  
  const handleSelectedFile = async (file: File) => {
    // Check if file is an image
    if (!file.type.match(/image.*/)) {
      onImageSelected({
        success: false,
        error: 'Please upload an image file (PNG, JPG, JPEG, GIF)'
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onImageSelected({
        success: false,
        error: 'Image must be less than 5MB'
      });
      return;
    }
    
    try {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // In a real app, you'd upload to a server here
      console.log('Would upload file:', file.name);
      
      // Return success with the URL
      onImageSelected({
        success: true,
        url: url
      });
      
    } catch (error) {
      console.error('Error processing image:', error);
      onImageSelected({
        success: false,
        error: 'Failed to process image'
      });
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleSelectedFile(file);
    }
  };
  
  const clearImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageSelected({
      success: false,
      url: undefined
    });
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      
      {previewUrl ? (
        <div className="relative rounded-md overflow-hidden">
          <RobustImage 
            src={previewUrl} 
            alt="Preview" 
            className={`w-full object-cover ${aspectRatio ? 'aspect-[' + aspectRatio + ']' : 'max-h-[300px]'}`}
            showLoadingSpinner={true}
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-80 hover:opacity-100"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md ${
            dragging ? 'border-softspot-400 bg-softspot-50' : 'border-gray-300'
          } p-8 text-center cursor-pointer transition-colors`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-softspot-100 rounded-full">
              <Upload className="h-6 w-6 text-softspot-500" />
            </div>
            <p className="text-sm font-medium">{buttonText}</p>
            <p className="text-xs text-gray-500">
              Drag and drop or click to upload
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, JPEG, GIF up to 5MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
