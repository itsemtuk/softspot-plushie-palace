
import React, { useState } from 'react';
import { Cropper, CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';

interface ImageCropperProps {
  image: string;
  onCrop: (cropper: CropperRef) => void;
  aspectRatio?: number;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  onCrop,
  aspectRatio
}) => {
  const [cropper, setCropper] = useState<CropperRef | null>(null);

  const handleChange = (newCropper: CropperRef) => {
    setCropper(newCropper);
    onCrop(newCropper);
  };

  return (
    <div className="w-full h-full">
      <Cropper
        src={image}
        onChange={handleChange}
        className="h-[400px] bg-gray-100"
        stencilProps={{
          aspectRatio: aspectRatio
        }}
        imageRestriction="stencil" /* Changed from { byBoundaries: true } to "stencil" */
      />
    </div>
  );
};
