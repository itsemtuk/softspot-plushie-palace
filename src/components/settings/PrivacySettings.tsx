
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { PrivacySetting, UserPrivacySettings } from "@/types/marketplace";
import { Lock, Shield, MessageCircle, Activity, Eye } from "lucide-react";

const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['Public', 'Followers', 'Private'] as const),
  postsVisibility: z.enum(['Public', 'Followers', 'Private'] as const),
  listingsVisibility: z.enum(['Public', 'Followers', 'Private'] as const),
  allowMessages: z.enum(['Everyone', 'Followers', 'Nobody'] as const),
  showActivity: z.boolean()
});

const PrivacySettings = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get existing privacy settings from user metadata or use defaults
  const existingSettings = (user?.unsafeMetadata?.privacySettings as UserPrivacySettings) || {
    profileVisibility: 'Public',
    postsVisibility: 'Public',
    listingsVisibility: 'Public',
    allowMessages: 'Everyone',
    showActivity: true
  };

  const form = useForm<UserPrivacySettings>({
    resolver: zodResolver(privacySettingsSchema),
    defaultValues: existingSettings
  });

  const onSubmit = async (data: UserPrivacySettings) => {
    setIsLoading(true);
    try {
      // Update user metadata with new privacy settings
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          privacySettings: data
        }
      });
      
      // Force reload user data to reflect changes immediately
      await user?.reload();
      
      toast({
        title: "Privacy settings updated",
        description: "Your privacy preferences have been saved."
      });
    } catch (error) {
      console.error("Error saving privacy settings:", error);
      toast({
        title: "Error",
        description: "Failed to update privacy settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-softspot-500" />
          <CardTitle>Privacy Settings</CardTitle>
        </div>
        <CardDescription>
          Control who can see your profile, posts, and who can message you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="profileVisibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Eye className="h-4 w-4" /> Profile Visibility
                  </FormLabel>
                  <FormDescription>
                    Who can see your profile information
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Public" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Public - Anyone can view your profile
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Followers" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Followers - Only your followers can view your profile
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Private" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Private - Only you can view your profile
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="postsVisibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Posts Visibility
                  </FormLabel>
                  <FormDescription>
                    Who can see your posts on the feed
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Public" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Public - Anyone can see your posts
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Followers" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Followers - Only your followers can see your posts
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Private" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Private - Only you can see your posts
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="listingsVisibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Lock className="h-4 w-4" /> Marketplace Listings Visibility
                  </FormLabel>
                  <FormDescription>
                    Control who can see your marketplace listings
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Public" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Public - Anyone can see your listings
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Followers" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Followers - Only your followers can see your listings
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Private" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Private - Only you can see your listings
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="allowMessages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" /> Direct Message Permissions
                  </FormLabel>
                  <FormDescription>
                    Control who can send you direct messages
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Everyone" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Everyone - Anyone can message you (messages from non-followers require approval)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Followers" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Followers - Only people you follow can message you
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Nobody" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Nobody - Disable direct messages
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="showActivity"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Activity Status</FormLabel>
                    <FormDescription>
                      Show when you're active on SoftSpot
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="pt-4 flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="bg-softspot-400 hover:bg-softspot-500"
              >
                {isLoading ? "Saving..." : "Save Privacy Settings"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;
