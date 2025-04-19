
import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormSchemaType } from "./OnboardingFormSchema";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, X, Edit2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface ProfilePictureUploadProps {
  form: UseFormReturn<FormSchemaType>;
}

const ProfilePictureUpload = ({ form }: ProfilePictureUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    form.getValues("profilePicture") || null
  );

  // Update preview if the form value changes externally
  useEffect(() => {
    const currentValue = form.getValues("profilePicture");
    if (currentValue && currentValue !== previewUrl) {
      setPreviewUrl(currentValue);
    }
  }, [form, previewUrl]);
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          const result = reader.result as string;
          setPreviewUrl(result);
          form.setValue("profilePicture", result, { shouldValidate: true, shouldDirty: true });
          toast({
            title: "Image uploaded",
            description: "Your profile picture has been selected. Don't forget to save your changes.",
          });
        } catch (error) {
          console.error("Error processing image:", error);
          toast({
            title: "Upload failed",
            description: "There was a problem processing your image",
            variant: "destructive",
          });
        }
      };
      
      reader.onerror = () => {
        toast({
          title: "Upload failed",
          description: "There was a problem reading your image file",
          variant: "destructive",
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    form.setValue("profilePicture", "", { shouldValidate: true, shouldDirty: true });
    toast({
      title: "Image removed",
      description: "Your profile picture has been removed. Don't forget to save your changes.",
    });
  };

  return (
    <FormField
      control={form.control}
      name="profilePicture"
      render={({ field }) => (
        <FormItem className="flex flex-col items-center space-y-4">
          <FormLabel className="text-lg text-center">Profile Picture</FormLabel>
          <p className="text-sm text-muted-foreground text-center">
            Upload a profile picture (optional)
          </p>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24 border-2 border-softspot-200">
                {previewUrl ? (
                  <AvatarImage 
                    src={previewUrl} 
                    alt="Profile picture" 
                    className="object-cover" 
                  />
                ) : (
                  <AvatarFallback className="bg-softspot-100 text-softspot-500 text-3xl">
                    🧸
                  </AvatarFallback>
                )}
              </Avatar>
              
              {previewUrl && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="absolute bottom-0 right-0 rounded-full bg-white w-8 h-8 p-0"
                  onClick={() => document.getElementById("picture-upload")?.click()}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <FormControl>
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white"
                    onClick={() => document.getElementById("picture-upload")?.click()}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {previewUrl ? "Change" : "Upload"}
                  </Button>
                  <Input
                    id="picture-upload"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                </div>
              </FormControl>
              
              {previewUrl && (
                <Button
                  type="button"
                  variant="outline"
                  className="bg-white text-red-500 border-red-200 hover:bg-red-50"
                  onClick={handleRemoveImage}
                >
                  <X className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              )}
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProfilePictureUpload;
