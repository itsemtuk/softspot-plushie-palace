
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { PrivacySetting, UserPrivacySettings } from "@/types/marketplace";

export function PrivacySettings() {
  const [privacySettings, setPrivacySettings] = useState<UserPrivacySettings>({
    profileVisibility: "public",
    messagePermission: "followers",
    activityVisibility: true,
    allowMessages: true,
    showActivity: true,
    allowTagging: true,
    profile: "public",
    posts: "public",
    wishlist: "public",
    marketplace: "public",
    messages: "followers"
  });

  const updatePrivacy = (field: keyof UserPrivacySettings, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // In a real app, this would save to a backend
    console.log("Saving privacy settings:", privacySettings);
    
    toast({
      title: "Privacy settings updated",
      description: "Your privacy preferences have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>
            Control who can see your content and interact with you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold">Profile Visibility</h3>
            <RadioGroup 
              value={privacySettings.profileVisibility} 
              onValueChange={(value: PrivacySetting) => updatePrivacy("profileVisibility", value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public-profile" />
                <Label htmlFor="public-profile">Public - Anyone can see your profile</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="followers" id="followers-profile" />
                <Label htmlFor="followers-profile">Followers - Only your followers can see your profile</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private-profile" />
                <Label htmlFor="private-profile">Private - Only you can see your profile</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Messages</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-messages">Allow messages from</Label>
              <RadioGroup 
                value={privacySettings.messagePermission} 
                onValueChange={(value: PrivacySetting) => updatePrivacy("messagePermission", value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public-messages" />
                  <Label htmlFor="public-messages">Anyone</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="followers" id="followers-messages" />
                  <Label htmlFor="followers-messages">Followers</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Activity</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-activity">Show your activity status</Label>
              <Switch 
                id="show-activity" 
                checked={privacySettings.showActivity}
                onCheckedChange={(checked) => updatePrivacy("showActivity", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-tagging">Allow others to tag you</Label>
              <Switch 
                id="allow-tagging" 
                checked={privacySettings.allowTagging}
                onCheckedChange={(checked) => updatePrivacy("allowTagging", checked)}
              />
            </div>
          </div>

          <Button onClick={handleSave} className="w-full mt-4">Save Privacy Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
