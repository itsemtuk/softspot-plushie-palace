
import { PencilIcon, InstagramIcon, TwitterIcon, YoutubeIcon, PlusIcon } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AvatarSelector } from "@/components/profile/AvatarSelector";
import { UseFormReturn } from "react-hook-form";

interface BasicInfoTabProps {
  form: UseFormReturn<any>;
}

export const BasicInfoTab = ({ form }: BasicInfoTabProps) => {
  return (
    <>
      {/* Profile Picture Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Profile Picture</h3>
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <AvatarSelector
                  currentAvatar={field.value}
                  onSelect={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      {/* Account Information Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Account Information</h3>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Username</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="Your username"
                      className="pr-10"
                      {...field}
                    />
                  </FormControl>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-softspot-500">
                    <PencilIcon className="h-4 w-4" />
                  </div>
                </div>
                <FormDescription className="text-xs text-gray-500">
                  Your unique profile name (3-20 characters)
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell the community about your plushie passion..."
                    className="resize-none"
                    maxLength={160}
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <div className="flex justify-between mt-1">
                  <FormDescription>
                    Tell the community about your plushie passion
                  </FormDescription>
                  <span className="text-xs text-gray-500">
                    {field.value ? field.value.length : 0}/160
                  </span>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Contact Information Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      className="pr-10"
                      {...field}
                      disabled={true}
                    />
                  </FormControl>
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </span>
                </div>
                <FormDescription className="text-xs text-gray-500">
                  Your primary email for account notifications
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Phone Number</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      className="pr-10"
                      {...field}
                    />
                  </FormControl>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-softspot-500">
                    <PencilIcon className="h-4 w-4" />
                  </div>
                </div>
                <FormDescription className="text-xs text-gray-500">
                  For shipping notifications and account security
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Social Media Section */}
      <div className="pb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Social Media Links</h3>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-400 text-white flex items-center justify-center mr-3">
                    <InstagramIcon className="h-5 w-5" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Instagram username"
                      {...field}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center mr-3">
                    <TwitterIcon className="h-5 w-5" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Twitter username"
                      {...field}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="youtube"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center mr-3">
                    <YoutubeIcon className="h-5 w-5" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="YouTube channel"
                      {...field}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          
          <Button variant="link" className="text-sm text-softspot-500 font-medium p-0 h-auto">
            <PlusIcon className="h-4 w-4 mr-1" /> Add Another Platform
          </Button>
        </div>
      </div>
    </>
  );
};
