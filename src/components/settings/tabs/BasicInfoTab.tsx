
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { PlushieAvatarSelector } from "./PlushieAvatarSelector";

interface BasicInfoTabProps {
  form: UseFormReturn<any>;
}

export const BasicInfoTab = ({ form }: BasicInfoTabProps) => {
  return (
    <div className="border-b border-gray-200 pb-6 space-y-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h3>
      
      {/* Avatar selection */}
      <FormField
        control={form.control}
        name="avatarUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profile Avatar</FormLabel>
            <PlushieAvatarSelector 
              value={field.value} 
              onChange={field.onChange} 
            />
            <FormDescription>
              Choose a fun avatar to represent you
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Username */}
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="Your username" {...field} />
            </FormControl>
            <FormDescription>
              This is your display name
            </FormDescription>
            <FormMessage />
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
              <Input type="email" placeholder="your@email.com" {...field} />
            </FormControl>
            <FormDescription>
              Your email for notifications
            </FormDescription>
            <FormMessage />
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
                placeholder="Tell us about your plushie journey..." 
                className="resize-none" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Share details about your collection and interests
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
