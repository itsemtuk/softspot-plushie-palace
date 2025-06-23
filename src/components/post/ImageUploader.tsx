
import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void;
  currentImage?: string;
  maxSizeInMB?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelect, 
  currentImage,
  maxSizeInMB = 5 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (file.size > maxSizeInMB * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `Please select an image smaller than ${maxSizeInMB}MB`
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select an image file"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create a compressed version for large images
      if (file.size > 1024 * 1024) { // If larger than 1MB
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          // Calculate new dimensions (max 1200px width)
          const maxWidth = 1200;
          const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;
          
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              onImageSelect(compressedFile);
            }
            setIsProcessing(false);
          }, 'image/jpeg', 0.8);
        };
        
        img.src = URL.createObjectURL(file);
      } else {
        onImageSelect(file);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process image"
      });
      setIsProcessing(false);
    }
  }, [maxSizeInMB, onImageSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleRemoveImage = useCallback(() => {
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onImageSelect]);

  return (
    <div className="w-full space-y-4">
      {currentImage ? (
        <div className="relative">
          <img 
            src={currentImage} 
            alt="Selected" 
            className="w-full h-64 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging ? 'border-softspot-500 bg-softspot-50' : 'border-gray-300'}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-softspot-400'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
        >
          <div className="space-y-4">
            {isProcessing ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-softspot-500 mx-auto"></div>
            ) : (
              <Camera className="h-12 w-12 mx-auto text-gray-400" />
            )}
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isProcessing ? 'Processing image...' : 'Add a photo'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop or click to select (max {maxSizeInMB}MB)
              </p>
            </div>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isProcessing}
      />
      
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="w-full sm:w-auto"
        >
          <Upload className="h-4 w-4 mr-2" />
          {currentImage ? 'Change Image' : 'Select Image'}
        </Button>
      </div>
    </div>
  );
};
