
import React, { useState } from "react";
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
import { Camera, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProfilePictureUploadProps {
  form: UseFormReturn<FormSchemaType>;
}

const ProfilePictureUpload = ({ form }: ProfilePictureUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        form.setValue("profilePicture", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    form.setValue("profilePicture", "");
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
            <Avatar className="w-24 h-24 border-2 border-softspot-200">
              {previewUrl ? (
                <AvatarImage src={previewUrl} alt="Profile picture" />
              ) : (
                <AvatarFallback className="bg-softspot-100 text-softspot-500 text-3xl">
                  🧸
                </AvatarFallback>
              )}
            </Avatar>
            
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
