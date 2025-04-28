import { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, UserCog } from "lucide-react";
import { plushieTypes, plushieBrands } from "@/components/onboarding/onboardingData";
import { Badge } from "@/components/ui/badge";
import { UserButton } from "@clerk/clerk-react";
import ProfilePictureUpload from "@/components/onboarding/ProfilePictureUpload";
import PlushieTypeSelector from "@/components/onboarding/PlushieTypeSelector";
import PlushieBrandSelector from "@/components/onboarding/PlushieBrandSelector";
import PrivacySettings from "@/components/settings/PrivacySettings";

const profileFormSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  bio: z.string().max(160).optional(),
  plushieTypes: z.array(z.string()).optional().default([]),
  plushieBrands: z.array(z.string()).optional().default([]),
  profilePicture: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Settings = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(tabFromUrl === "privacy" ? "privacy" : 
                                           tabFromUrl === "preferences" ? "preferences" : "profile");
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      bio: "",
      profilePicture: "",
      plushieTypes: [],
      plushieBrands: [],
    },
  });
  
  // Load user data into form when user data is available
  useEffect(() => {
    if (isLoaded && user) {
      // Get existing plushie interests from user metadata
      const existingInterests = user?.unsafeMetadata?.plushieInterests as string[] || [];
      
      // Parse existing preferences back to IDs for the form
      const existingTypeIDs = plushieTypes
        .filter(type => existingInterests.includes(type.label))
        .map(type => type.id);
      
      const existingBrandIDs = plushieBrands
        .filter(brand => existingInterests.includes(brand.label))
        .map(brand => brand.id);
      
      form.reset({
        username: user?.username || "",
        bio: user?.unsafeMetadata?.bio as string || "",
        profilePicture: user?.unsafeMetadata?.profilePicture as string || user?.imageUrl || "",
        plushieTypes: existingTypeIDs,
        plushieBrands: existingBrandIDs,
      });
    }
  }, [isLoaded, user, form]);

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);

    try {
      if (!user) {
        throw new Error("User not found");
      }
      
      // Convert IDs to labels for plushie interests
      const selectedTypes = plushieTypes
        .filter(type => data.plushieTypes?.includes(type.id))
        .map(type => type.label);
      
      const selectedBrands = plushieBrands
        .filter(brand => data.plushieBrands?.includes(brand.id))
        .map(brand => brand.label);
      
      const plushieInterests = [...selectedTypes, ...selectedBrands];
      
      console.log("Updating user with:", {
        username: data.username,
        bio: data.bio,
        profilePicture: data.profilePicture,
        plushieInterests
      });
      
      // Update the user's data
      await user.update({
        username: data.username,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          bio: data.bio || "",
          profilePicture: data.profilePicture || "",
          plushieInterests,
          // Ensure onboardingCompleted is set to true
          onboardingCompleted: true,
        },
      });

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });

      // Reload user data to ensure the UI reflects the changes
      await user.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto pt-8 pb-24 px-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="w-full md:w-1/3">
                      <ProfilePictureUpload form={form} />
                    </div>
                    <div className="w-full md:w-2/3 space-y-4">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about yourself and your plushie interests"
                                className="resize-none h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={isLoading} className="bg-softspot-500">
                      {isLoading ? "Saving..." : "Save changes"}
                      {!isLoading && <Save className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Account Settings</h2>
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-10 h-10"
                    }
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2 mb-4">
                Manage your account settings using the profile menu
              </p>
              
              <div className="flex items-center gap-2 text-gray-500">
                <UserCog className="h-5 w-5" />
                <span>Click your profile picture to access account settings</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preferences">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Plushie Preferences</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-8">
                    <PlushieTypeSelector plushieTypes={plushieTypes} form={form} />
                    <PlushieBrandSelector plushieBrands={plushieBrands} form={form} />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={isLoading} className="bg-softspot-500">
                      {isLoading ? "Saving..." : "Save preferences"}
                      {!isLoading && <Save className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </TabsContent>

          <TabsContent value="privacy">
            <PrivacySettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
