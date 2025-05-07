
import { useState } from "react";
import { Save, Camera, Redo, PencilIcon, CheckCircle, Instagram, Twitter, Youtube, Plus } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { plushieTypes, plushieBrands } from "@/components/onboarding/onboardingData";
import PlushieTypeSelector from "@/components/onboarding/PlushieTypeSelector";
import PlushieBrandSelector from "@/components/onboarding/PlushieBrandSelector";
import BioInput from "@/components/settings/BioInput";
import UsernameInput from "@/components/settings/UsernameInput";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

// Avatar options
const AVATAR_OPTIONS = [
  "/assets/avatars/bear-avatar.png",
  "/assets/avatars/bunny-avatar.png",
  "/assets/avatars/cat-avatar.png",
  "/assets/avatars/dog-avatar.png",
  "/assets/avatars/unicorn-avatar.png",
  "/assets/avatars/penguin-avatar.png",
];

const ProfileInformation = () => {
  const { form, isLoading, onSubmit, loadUserData } = useProfileSettings();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic-info");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  // Load user data when component mounts
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Set selected avatar when form data loads
  useEffect(() => {
    if (form.getValues("profilePicture")) {
      setSelectedAvatar(form.getValues("profilePicture"));
    }
  }, [form]);

  // Handle form submission errors
  const handleSubmit = async (formData: any) => {
    try {
      await onSubmit(formData);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle avatar selection
  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    form.setValue("profilePicture", avatar);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h2>
      
      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full flex overflow-x-auto space-x-6 border-b border-gray-200 bg-transparent p-0">
          <TabsTrigger 
            value="basic-info" 
            className={`pb-3 font-medium ${activeTab === "basic-info" ? "tab-button active" : "text-gray-500 hover:text-softspot-500"}`}
          >
            Basic Info
          </TabsTrigger>
          <TabsTrigger 
            value="plush-prefs" 
            className={`pb-3 font-medium ${activeTab === "plush-prefs" ? "tab-button active" : "text-gray-500 hover:text-softspot-500"}`}
          >
            Plush Preferences
          </TabsTrigger>
          <TabsTrigger 
            value="privacy" 
            className={`pb-3 font-medium ${activeTab === "privacy" ? "tab-button active" : "text-gray-500 hover:text-softspot-500"}`}
          >
            Privacy & Security
          </TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {/* Basic Info Tab Content */}
            <TabsContent value="basic-info" className="space-y-6 pt-4">
              {/* Profile Picture Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Profile Picture</h3>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="relative">
                    <img 
                      src={selectedAvatar || form.getValues("profilePicture") || "https://i.pravatar.cc/300"} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-softspot-100"
                      onError={(e) => {
                        e.currentTarget.src = "https://i.pravatar.cc/300";
                      }}
                    />
                    <Button 
                      type="button"
                      className="absolute bottom-0 right-0 bg-softspot-500 text-white p-2 h-auto w-auto rounded-full hover:bg-softspot-600"
                      onClick={() => document.getElementById("picture-upload")?.click()}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    <input 
                      id="picture-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              setSelectedAvatar(ev.target.result as string);
                              form.setValue("profilePicture", ev.target.result as string);
                            }
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-4">Upload a new photo or choose from our cute plushie avatars</p>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {AVATAR_OPTIONS.map((avatar, index) => (
                        <div 
                          key={index}
                          className={`w-16 h-16 rounded-full cursor-pointer transition-all ${
                            selectedAvatar === avatar 
                              ? "transform scale-105 shadow-md ring-2 ring-softspot-500" 
                              : "bg-gray-100 hover:transform hover:scale-105"
                          }`}
                          onClick={() => handleAvatarSelect(avatar)}
                        >
                          <img 
                            src={avatar} 
                            alt={`Avatar option ${index+1}`} 
                            className="w-full h-full object-contain p-2 rounded-full"
                          />
                        </div>
                      ))}
                    </div>
                    <Button 
                      type="button"
                      variant="link" 
                      className="text-sm text-softspot-500 font-medium p-0 h-auto"
                      onClick={() => {
                        setSelectedAvatar(null);
                        form.setValue("profilePicture", "");
                      }}
                    >
                      <Redo className="h-4 w-4 mr-1" /> Reset to Default
                    </Button>
                  </div>
                </div>
              </div>

              {/* Account Information Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Account Information</h3>
                <div className="space-y-4">
                  <UsernameInput form={form} />
                  <BioInput form={form} />
                </div>
              </div>

              {/* Social Media Section */}
              <div className="pb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Social Media Links</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 text-white flex items-center justify-center mr-3">
                      <Instagram className="h-5 w-5" />
                    </div>
                    <Input 
                      placeholder="Instagram username"
                      className="flex-1"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center mr-3">
                      <Twitter className="h-5 w-5" />
                    </div>
                    <Input 
                      placeholder="Twitter username"
                      className="flex-1"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center mr-3">
                      <Youtube className="h-5 w-5" />
                    </div>
                    <Input 
                      placeholder="YouTube channel"
                      className="flex-1"
                    />
                  </div>
                  
                  <Button 
                    type="button"
                    variant="link" 
                    className="text-sm text-softspot-500 font-medium p-0 h-auto"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Another Platform
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Plush Preferences Tab Content */}
            <TabsContent value="plush-prefs" className="space-y-6 pt-4">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Favorite Plush Types</h3>
                <p className="text-sm text-gray-500 mb-4">Select the types of plushies you're most interested in</p>
                <PlushieTypeSelector plushieTypes={plushieTypes} form={form} />
              </div>
              
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Favorite Brands</h3>
                <p className="text-sm text-gray-500 mb-4">Select your favorite plush brands to see more of them</p>
                <PlushieBrandSelector plushieBrands={plushieBrands} form={form} />
              </div>
            </TabsContent>
            
            {/* Privacy Tab Content */}
            <TabsContent value="privacy" className="space-y-6 pt-4">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Account Privacy</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-700">Private Account</h4>
                      <p className="text-sm text-gray-500">Only approved followers can see your profile</p>
                    </div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={form.getValues("isPrivate")}
                        onChange={(e) => form.setValue("isPrivate", e.target.checked)}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-softspot-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-softspot-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-700">Show my collection publicly</h4>
                      <p className="text-sm text-gray-500">Allow others to see your plushie collection</p>
                    </div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        defaultChecked={true}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-softspot-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-softspot-500"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="pb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Data Management</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-700">Download Your Data</h4>
                      <p className="text-sm text-gray-500">Request a copy of your data</p>
                    </div>
                    <Button 
                      type="button"
                      variant="link" 
                      className="text-sm text-softspot-500 font-medium p-0 h-auto"
                    >
                      Request
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-700 text-red-500">Delete Account</h4>
                      <p className="text-sm text-gray-500">Permanently delete your account</p>
                    </div>
                    <Button 
                      type="button"
                      variant="link" 
                      className="text-sm text-red-500 font-medium p-0 h-auto"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Save Button */}
            <div className="pt-4 flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="bg-softspot-500 hover:bg-softspot-600"
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" className="mr-2" /> 
                    Saving...
                  </>
                ) : (
                  <>
                    Save changes
                    <Save className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default ProfileInformation;
