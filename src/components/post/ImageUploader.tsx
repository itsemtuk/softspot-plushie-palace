
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageUploadResult } from "@/types/marketplace";
import { Camera, Upload, Facebook, Image } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  onImageUploaded?: (imageUrl: string) => void;
  onImageSelect?: (result: ImageUploadResult) => void;
}

export const ImageUploader = ({ onImageUploaded, onImageSelect }: ImageUploaderProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image under 5MB"
        });
        return;
      }

      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          
          // Call the appropriate callback based on which was provided
          if (onImageUploaded) {
            onImageUploaded(imageUrl);
          }
          
          if (onImageSelect) {
            onImageSelect({
              url: imageUrl,
              file: file,
              type: file.type,
              name: file.name,
              size: file.size
            });
          }
          
          setIsDialogOpen(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "There was an error uploading your image"
        });
      }
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        className="w-full h-32 border-2 border-dashed"
      >
        <Camera className="w-6 h-6 mr-2" />
        Choose Image
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:bg-gray-50">
              <CardContent className="p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <p>Upload from device</p>
                </label>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-gray-50">
              <CardContent className="p-6 text-center">
                <Facebook className="w-8 h-8 mx-auto mb-2" />
                <p>Import from Facebook</p>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
