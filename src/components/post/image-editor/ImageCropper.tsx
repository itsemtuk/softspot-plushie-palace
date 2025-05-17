
import React, { forwardRef, ForwardedRef } from 'react';
import { Cropper, CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';

interface ImageCropperProps {
  image: string;
  onCrop: (cropper: CropperRef) => void;
  aspectRatio?: number;
}

export const ImageCropper = forwardRef<CropperRef, ImageCropperProps>(({
  image,
  onCrop,
  aspectRatio
}, ref) => {
  const handleChange = (newCropper: CropperRef) => {
    onCrop(newCropper);
  };

  return (
    <div className="w-full h-full">
      <Cropper
        ref={ref}
        src={image}
        onChange={handleChange}
        className="h-[400px] bg-gray-100"
        stencilProps={{
          aspectRatio: aspectRatio
        }}
        imageRestriction="stencil-area" // Changed from "stencil" to "stencil-area"
      />
    </div>
  );
});

ImageCropper.displayName = 'ImageCropper';
