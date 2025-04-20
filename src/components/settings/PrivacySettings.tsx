
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { UserPrivacySettings, PrivacySetting } from "@/types/marketplace";
import { Save, Lock } from "lucide-react";

// Define schema for Privacy Settings
const privacyFormSchema = z.object({
  profile: z.enum(['public', 'friends', 'private'] as const),
  posts: z.enum(['public', 'friends', 'private'] as const),
  wishlist: z.enum(['public', 'friends', 'private'] as const),
  marketplace: z.enum(['public', 'friends', 'private'] as const),
  messages: z.enum(['public', 'friends', 'private'] as const),
  showActivity: z.boolean(),
});

type PrivacyFormValues = z.infer<typeof privacyFormSchema>;

const PrivacySettings = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  // Get existing privacy settings from user metadata or use defaults
  const userPrivacySettings = user?.unsafeMetadata?.privacySettings as UserPrivacySettings || {
    profile: 'public',
    posts: 'public',
    wishlist: 'private',
    marketplace: 'public',
    messages: 'friends'
  };
  
  const showActivity = user?.unsafeMetadata?.showActivity !== false;

  const form = useForm<PrivacyFormValues>({
    resolver: zodResolver(privacyFormSchema),
    defaultValues: {
      profile: userPrivacySettings.profile,
      posts: userPrivacySettings.posts,
      wishlist: userPrivacySettings.wishlist,
      marketplace: userPrivacySettings.marketplace,
      messages: userPrivacySettings.messages,
      showActivity: showActivity,
    },
  });

  async function onSubmit(data: PrivacyFormValues) {
    setIsLoading(true);
    try {
      // Update the user's privacy settings in metadata
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          privacySettings: {
            profile: data.profile,
            posts: data.posts,
            wishlist: data.wishlist,
            marketplace: data.marketplace,
            messages: data.messages,
          },
          showActivity: data.showActivity,
        },
      });

      toast({
        title: "Privacy settings updated",
        description: "Your privacy preferences have been saved.",
      });
    } catch (error) {
      console.error("Error updating privacy settings:", error);
      toast({
        title: "Error",
        description: "There was a problem updating your privacy settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lock className="h-5 w-5 text-softspot-500" />
        <h2 className="text-xl font-semibold">Privacy Settings</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="profile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Visibility</FormLabel>
                <Select onValueChange={field.onChange as (value: string) => void} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Who can see your profile" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="public">Everyone</SelectItem>
                    <SelectItem value="friends">Followers only</SelectItem>
                    <SelectItem value="private">Only me</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  This controls who can see your profile information.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="posts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posts Visibility</FormLabel>
                <Select onValueChange={field.onChange as (value: string) => void} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Who can see your posts" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="public">Everyone</SelectItem>
                    <SelectItem value="friends">Followers only</SelectItem>
                    <SelectItem value="private">Only me</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  This controls who can see your posts and activity.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="wishlist"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wishlists Visibility</FormLabel>
                <Select onValueChange={field.onChange as (value: string) => void} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Who can see your wishlists" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="public">Everyone</SelectItem>
                    <SelectItem value="friends">Followers only</SelectItem>
                    <SelectItem value="private">Only me</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  This controls who can see your plushie wishlists.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marketplace"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marketplace Visibility</FormLabel>
                <Select onValueChange={field.onChange as (value: string) => void} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Who can see your listings" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="public">Everyone</SelectItem>
                    <SelectItem value="friends">Followers only</SelectItem>
                    <SelectItem value="private">Only me</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  This controls who can see your marketplace listings.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="messages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message Privacy</FormLabel>
                <Select onValueChange={field.onChange as (value: string) => void} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Who can message you" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="public">Everyone</SelectItem>
                    <SelectItem value="friends">Followers only</SelectItem>
                    <SelectItem value="private">Nobody</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  This controls who can send you direct messages.
                </FormDescription>
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
                    Show when you're active on the site.
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

          <Button type="submit" disabled={isLoading} className="bg-softspot-400 hover:bg-softspot-500">
            {isLoading ? "Saving..." : "Save privacy settings"}
            {!isLoading && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PrivacySettings;
