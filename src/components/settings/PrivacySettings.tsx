
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserPrivacySettings } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";

export function PrivacySettings() {
  const [privacySettings, setPrivacySettings] = useState<UserPrivacySettings>({
    profileVisibility: "public",
    showCollections: true,
    allowMessages: "everyone",
    showOnlineStatus: true,
    allowTagging: true,
    messagePermission: "everyone",
    showActivity: true,
    hideFromSearch: false,
    allowComments: true,
    showWishlist: true
  });

  const handlePrivacyChange = <K extends keyof UserPrivacySettings>(
    key: K, 
    value: UserPrivacySettings[K]
  ) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    toast({
      title: "Privacy Setting Updated",
      description: "Your privacy preferences have been saved."
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Visibility</CardTitle>
          <CardDescription>
            Control who can see your profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={privacySettings.profileVisibility} 
            onValueChange={(value) => 
              handlePrivacyChange('profileVisibility', value as "public" | "friends" | "private")
            }
          >
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public">Public</Label>
              <p className="text-sm text-gray-500 ml-1">
                (Anyone can view your profile)
              </p>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="friends" id="friends" />
              <Label htmlFor="friends">Friends Only</Label>
              <p className="text-sm text-gray-500 ml-1">
                (Only people you follow can view your profile)
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private">Private</Label>
              <p className="text-sm text-gray-500 ml-1">
                (Only you can view your full profile)
              </p>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>
            Control who can send you direct messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={privacySettings.messagePermission} 
            onValueChange={(value) => 
              handlePrivacyChange('messagePermission', value as "everyone" | "friends" | "none")
            }
          >
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="everyone" id="msg-everyone" />
              <Label htmlFor="msg-everyone">Everyone</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="friends" id="msg-friends" />
              <Label htmlFor="msg-friends">Only People You Follow</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="msg-none" />
              <Label htmlFor="msg-none">No One</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Activity Status */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Status</CardTitle>
          <CardDescription>
            Control if others can see when you're active
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label htmlFor="activity-status">Show my activity status</Label>
          <Switch
            id="activity-status"
            checked={privacySettings.showActivity}
            onCheckedChange={(checked) =>
              handlePrivacyChange('showActivity', checked)
            }
          />
        </CardContent>
      </Card>

      {/* Search Discovery */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Discovery</CardTitle>
          <CardDescription>
            Control how people can find you
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label htmlFor="search-discovery">Hide from search results</Label>
          <Switch
            id="search-discovery"
            checked={privacySettings.hideFromSearch}
            onCheckedChange={(checked) =>
              handlePrivacyChange('hideFromSearch', checked)
            }
          />
        </CardContent>
      </Card>

      {/* Comments */}
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
          <CardDescription>
            Control who can comment on your posts
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label htmlFor="comments">Allow comments on posts</Label>
          <Switch
            id="comments"
            checked={privacySettings.allowComments}
            onCheckedChange={(checked) =>
              handlePrivacyChange('allowComments', checked)
            }
          />
        </CardContent>
      </Card>

      {/* Collections Visibility */}
      <Card>
        <CardHeader>
          <CardTitle>Collections Visibility</CardTitle>
          <CardDescription>
            Control who can see your plushie collections
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label htmlFor="collections">Show collections on profile</Label>
          <Switch
            id="collections"
            checked={privacySettings.showCollections}
            onCheckedChange={(checked) =>
              handlePrivacyChange('showCollections', checked)
            }
          />
        </CardContent>
      </Card>

      {/* Wishlist Visibility */}
      <Card>
        <CardHeader>
          <CardTitle>Wishlist Visibility</CardTitle>
          <CardDescription>
            Control who can see your wishlist
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label htmlFor="wishlist">Show wishlist on profile</Label>
          <Switch
            id="wishlist"
            checked={privacySettings.showWishlist}
            onCheckedChange={(checked) =>
              handlePrivacyChange('showWishlist', checked)
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
