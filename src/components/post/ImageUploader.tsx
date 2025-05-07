import React, { useRef } from 'react';
import { ImageIcon } from 'lucide-react';
import { ImageUploadResult } from '@/types/marketplace';

interface ImageUploaderProps {
  onImageSelect: (result: ImageUploadResult) => void;
  multiple?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, multiple = false, children, className = "" }) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const dropZone = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dropZone.current) {
      dropZone.current.classList.add('border-softspot-500', 'bg-softspot-50');
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dropZone.current) {
      dropZone.current.classList.remove('border-softspot-500', 'bg-softspot-50');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dropZone.current) {
      dropZone.current.classList.remove('border-softspot-500', 'bg-softspot-50');
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      handleSelectedFiles(files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleSelectedFiles(files);
    }
  };

  const handleSelectedFiles = (files: File[]) => {
    if (!multiple && files.length > 1) {
      console.warn("Only one file is allowed.");
      return;
    }

    files.forEach(selectedFile => {
      if (!selectedFile.type.startsWith('image/')) {
        console.warn("Only image files are supported.");
        const result: ImageUploadResult = {
          url: '',
          success: false,
          error: "Only image files are supported.",
          file: selectedFile,
          type: selectedFile.type,
          name: selectedFile.name
        };
        onImageSelect(result);
        return;
      }

      if (fileInput.current?.files) {
        const selectedFile = fileInput.current.files[0];
        
        if (selectedFile) {
          const reader = new FileReader();
          
          reader.onload = (event) => {
            if (event.target?.result) {
              const imageUrl = event.target.result.toString();
              
              // Create the result object with the proper type
              const result: ImageUploadResult = {
                url: imageUrl,
                success: true,
                file: selectedFile
              };
              
              onImageSelect(result);
            }
          };
          
          reader.readAsDataURL(selectedFile);
        }
      }
    });
  };

  const renderDropZone = () => (
    <div
      ref={dropZone}
      className={`relative border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInput.current?.click()}
    >
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        ref={fileInput}
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center justify-center">
        <ImageIcon className="h-6 w-6 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">
          Drag and drop an image here, or click to select a file
        </p>
        {children}
      </div>
    </div>
  );

  return renderDropZone();
};

export default ImageUploader;
