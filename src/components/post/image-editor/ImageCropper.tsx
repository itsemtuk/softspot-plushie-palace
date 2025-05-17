
import React, { forwardRef } from 'react';
import { Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';

interface ImageCropperProps {
  imageUrl: string;
  aspectRatio: number | null;
  filter: string;
}

export const ImageCropper = forwardRef<any, ImageCropperProps>(
  ({ imageUrl, aspectRatio, filter }, ref) => {
    return (
      <Cropper
        ref={ref}
        src={imageUrl}
        className="cropper"
        aspectRatio={aspectRatio as any}
        stencilProps={{
          handlers: true,
          lines: true,
          movable: true,
          resizable: true,
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
        imageRestriction={{ byBoundaries: true }}
        defaultSize={{
          width: 0.8,
          height: 0.8,
        }}
        backgroundProps={{
          style: {
            filter: filter || ""
          }
        }}
      />
    );
  }
);

ImageCropper.displayName = 'ImageCropper';
