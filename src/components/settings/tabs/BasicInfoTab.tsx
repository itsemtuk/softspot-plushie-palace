
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UseFormReturn } from "react-hook-form";
import { PlushieAvatarSelector } from "@/components/settings/PlushieAvatarSelector";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoTabProps {
  form: UseFormReturn<any>;
}

export const BasicInfoTab = ({ form }: BasicInfoTabProps) => {
  const avatarUrl = form.watch("avatarUrl") || "";
  const username = form.watch("username") || "";
  
  const handleAvatarChange = (newAvatarUrl: string) => {
    form.setValue("avatarUrl", newAvatarUrl);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h3>
        
        <div className="space-y-6">
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your username" />
                </FormControl>
                <FormDescription>
                  This is your public username that will be visible to others.
                </FormDescription>
              </FormItem>
            )}
          />
          
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="your@email.com" />
                </FormControl>
                <FormDescription>
                  Your email address is used for notifications and account recovery.
                </FormDescription>
              </FormItem>
            )}
          />
          
          {/* Bio */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    placeholder="Tell us about yourself and your plushie collection..."
                    rows={4} 
                  />
                </FormControl>
                <FormDescription>
                  A short bio displayed on your public profile. Max 160 characters.
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Current Avatar Preview */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>
              {username.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">Your Avatar</h3>
            <p className="text-sm text-gray-500">
              This image will be shown on your profile and comments
            </p>
          </div>
        </div>
        
        {/* Upload custom avatar URL */}
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel>Custom Avatar URL</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  placeholder="https://example.com/your-avatar.jpg" 
                />
              </FormControl>
              <FormDescription>
                Enter a URL for a custom avatar or select a plushie avatar below.
              </FormDescription>
            </FormItem>
          )}
        />
        
        {/* Plushie Avatars */}
        <PlushieAvatarSelector value={avatarUrl} onChange={handleAvatarChange} />
      </div>
    </div>
  );
};
