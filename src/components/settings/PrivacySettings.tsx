
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserPrivacySettings } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";

export function PrivacySettings() {
  const [settings, setSettings] = useState<UserPrivacySettings>({
    privateProfile: false,
    hideFromSearch: false,
    showOnlineStatus: true,
    allowDirectMessages: true,
    allowComments: true,
    showWishlist: true,
    showCollection: true,
    profileVisibility: "public",
    messagePermission: "everyone",
    showActivity: true,
    allowTagging: true
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSwitchChange = (setting: keyof UserPrivacySettings, checked: boolean) => {
    setSettings({
      ...settings,
      [setting]: checked
    });
  };
  
  const handleSelectChange = (setting: keyof UserPrivacySettings, value: string) => {
    setSettings({
      ...settings,
      [setting]: value
    });
  };
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your privacy settings have been updated."
      });
      setIsSaving(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Privacy</CardTitle>
          <CardDescription>
            Control who can see your profile and collection.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-visibility">Profile Visibility</Label>
              <Select 
                value={settings.profileVisibility} 
                onValueChange={(value) => handleSelectChange("profileVisibility", value)}
              >
                <SelectTrigger id="profile-visibility">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Anyone can view your profile</SelectItem>
                  <SelectItem value="followers">Followers Only - Only your followers can view your profile</SelectItem>
                  <SelectItem value="private">Private - Only you can view your profile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message-permission">Direct Message Permissions</Label>
              <Select 
                value={settings.messagePermission} 
                onValueChange={(value) => handleSelectChange("messagePermission", value)}
              >
                <SelectTrigger id="message-permission">
                  <SelectValue placeholder="Select message permissions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyone">Everyone can message you</SelectItem>
                  <SelectItem value="followers">Followers only can message you</SelectItem>
                  <SelectItem value="nobody">Nobody can message you</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-online">Online Status</Label>
                <div className="text-sm text-muted-foreground">
                  Show when you're online to other users
                </div>
              </div>
              <Switch 
                id="show-online"
                checked={settings.showActivity}
                onCheckedChange={(checked) => handleSwitchChange("showActivity", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allow-tagging">Allow Tagging</Label>
                <div className="text-sm text-muted-foreground">
                  Allow other users to tag you in posts
                </div>
              </div>
              <Switch 
                id="allow-tagging"
                checked={settings.allowTagging}
                onCheckedChange={(checked) => handleSwitchChange("allowTagging", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="hide-search">Hide from Search</Label>
                <div className="text-sm text-muted-foreground">
                  Hide your profile from search results
                </div>
              </div>
              <Switch 
                id="hide-search"
                checked={settings.hideFromSearch}
                onCheckedChange={(checked) => handleSwitchChange("hideFromSearch", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allow-comments">Allow Comments</Label>
                <div className="text-sm text-muted-foreground">
                  Allow other users to comment on your posts
                </div>
              </div>
              <Switch 
                id="allow-comments"
                checked={settings.allowComments}
                onCheckedChange={(checked) => handleSwitchChange("allowComments", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Collection Privacy</CardTitle>
          <CardDescription>
            Control who can see your collection and wishlist.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-collection">Show Collection</Label>
                <div className="text-sm text-muted-foreground">
                  Make your collection visible to other users
                </div>
              </div>
              <Switch 
                id="show-collection"
                checked={settings.showCollection}
                onCheckedChange={(checked) => handleSwitchChange("showCollection", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-wishlist">Show Wishlist</Label>
                <div className="text-sm text-muted-foreground">
                  Make your wishlist visible to other users
                </div>
              </div>
              <Switch 
                id="show-wishlist"
                checked={settings.showWishlist}
                onCheckedChange={(checked) => handleSwitchChange("showWishlist", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          className="bg-softspot-400 hover:bg-softspot-500" 
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
