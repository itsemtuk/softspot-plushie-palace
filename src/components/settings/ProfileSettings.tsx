
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { AvatarSelector } from "@/components/profile/AvatarSelector";
import { ProfileSettingsTabs } from "@/components/profile/ProfileSettingsTabs";
import { PencilIcon, InstagramIcon, TwitterIcon, YoutubeIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Plushie brand and type data
const plushieBrands = [
  { id: "jellycat", label: "Jellycat" },
  { id: "squishmallows", label: "Squishmallows" },
  { id: "buildabear", label: "Build-A-Bear" },
  { id: "sanrio", label: "Sanrio" },
  { id: "pokemon", label: "Pokemon" },
  { id: "disney", label: "Disney" },
  { id: "other", label: "Other" }
];

const plushieTypes = [
  { id: "bear", label: "Bears" },
  { id: "cat", label: "Cats" },
  { id: "dog", label: "Dogs" },
  { id: "bunny", label: "Bunnies" },
  { id: "dinosaur", label: "Dinosaurs" },
  { id: "fox", label: "Foxes" },
  { id: "unicorn", label: "Unicorns" },
  { id: "dragon", label: "Dragons" },
  { id: "elephant", label: "Elephants" },
  { id: "fish", label: "Fish/Sea Creatures" },
];

export function ProfileSettings() {
  const { form, isSubmitting, isSynced, activeTab, setActiveTab, saveProfile, user } = useProfileSettings();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [favoriteType, setFavoriteType] = useState<string>("");

  const tabs = [
    { id: "basic-info", label: "Basic Info" },
    { id: "plush-preferences", label: "Plush Preferences" },
    { id: "privacy-security", label: "Privacy & Security" },
    { id: "notifications", label: "Notifications" },
  ];

  // Toggle brand selection
  const toggleBrand = (brandId: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(id => id !== brandId) 
        : [...prev, brandId]
    );
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h2>
      
      <ProfileSettingsTabs 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(saveProfile)} className="space-y-6">
          {/* Basic Info Tab */}
          {activeTab === "basic-info" && (
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
          )}

          {/* Plush Preferences Tab */}
          {activeTab === "plush-preferences" && (
            <>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Favorite Plushie Brands</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {plushieBrands.map((brand) => (
                      <div key={brand.id} className="flex items-center space-x-3">
                        <Checkbox 
                          id={`brand-${brand.id}`} 
                          checked={selectedBrands.includes(brand.id)} 
                          onCheckedChange={() => toggleBrand(brand.id)}
                        />
                        <label
                          htmlFor={`brand-${brand.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {brand.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Favorite Plushie Type</h3>
                
                <div className="space-y-4">
                  <Select value={favoriteType} onValueChange={setFavoriteType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your favorite type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Plushie Types</SelectLabel>
                        {plushieTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Collection Preferences</h3>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="showCollection"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel className="font-medium text-gray-700">Show my collection publicly</FormLabel>
                          <FormDescription className="text-sm text-gray-500">
                            Allow others to see your plushie collection
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
                  
                  <FormField
                    control={form.control}
                    name="showWishlist"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel className="font-medium text-gray-700">Show wishlist publicly</FormLabel>
                          <FormDescription className="text-sm text-gray-500">
                            Allow others to see your plushie wishlist
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
                </div>
              </div>

              <div className="pb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Shopping Preferences</h3>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="receiveWishlistAlerts"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel className="font-medium text-gray-700">Wishlist price alerts</FormLabel>
                          <FormDescription className="text-sm text-gray-500">
                            Get notified when items on your wishlist go on sale
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="newReleaseAlerts"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel className="font-medium text-gray-700">New release alerts</FormLabel>
                          <FormDescription className="text-sm text-gray-500">
                            Get notified about new plushie releases from your favorite brands
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </>
          )}

          {/* Privacy & Security Tab */}
          {activeTab === "privacy-security" && (
            <>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Account Privacy</h3>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isPrivate"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel className="font-medium text-gray-700">Private Account</FormLabel>
                          <FormDescription className="text-sm text-gray-500">
                            Only approved followers can see your profile and activity
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
                  
                  <FormField
                    control={form.control}
                    name="hideFromSearch"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel className="font-medium text-gray-700">Hide from search engines</FormLabel>
                          <FormDescription className="text-sm text-gray-500">
                            Prevent search engines from indexing your profile
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
                  
                  <FormField
                    control={form.control}
                    name="showActivityStatus"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel className="font-medium text-gray-700">Activity Status</FormLabel>
                          <FormDescription className="text-sm text-gray-500">
                            Show when you're active on the platform
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
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Data & Security</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-700">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="link" className="text-sm text-softspot-500 font-medium">
                      Enable
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-700">Login History</h4>
                      <p className="text-sm text-gray-500">Review recent account activity</p>
                    </div>
                    <Button variant="link" className="text-sm text-softspot-500 font-medium">
                      View
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-700">Download Your Data</h4>
                      <p className="text-sm text-gray-500">Request a copy of your data</p>
                    </div>
                    <Button variant="link" className="text-sm text-softspot-500 font-medium">
                      Request
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-700">Delete Account</h4>
                      <p className="text-sm text-gray-500">Permanently delete your account</p>
                    </div>
                    <Button variant="link" className="text-sm text-red-500 font-medium">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Email Notifications</h3>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="receiveEmailUpdates"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel className="font-medium text-gray-700">Product updates</FormLabel>
                          <FormDescription className="text-sm text-gray-500">
                            News about new features and improvements
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
                  
                  <FormField
                    control={form.control}
                    name="receiveMarketingEmails"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel className="font-medium text-gray-700">Marketing emails</FormLabel>
                          <FormDescription className="text-sm text-gray-500">
                            Promotions, special offers, and news
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
                  
                  <FormField
                    control={form.control}
                    name="newReleaseAlerts"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel className="font-medium text-gray-700">New release alerts</FormLabel>
                          <FormDescription className="text-sm text-gray-500">
                            Get notified about new plushie releases from your favorite brands
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="receiveWishlistAlerts"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel className="font-medium text-gray-700">Wishlist alerts</FormLabel>
                          <FormDescription className="text-sm text-gray-500">
                            When items on your wishlist go on sale or are restocked
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </>
          )}
          
          {/* Save Button - show on all tabs */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-softspot-500 text-white hover:bg-softspot-600" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
