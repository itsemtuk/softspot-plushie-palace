
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, Users, MessageSquare } from "lucide-react";
import { UserPrivacySettings } from "@/types/marketplace";

export const PrivacySettings = () => {
  const [settings, setSettings] = useState<UserPrivacySettings>({
    isPrivate: false,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    allowTradeRequests: true,
    profileVisibility: "public",
    showLocation: true,
    allowFriendRequests: true,
    messagePermission: true,
    showActivity: true,
    hideFromSearch: false,
    allowComments: true,
    showCollections: true,
    showWishlist: true,
  });

  const updateSetting = (key: keyof UserPrivacySettings, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Privacy & Security</h3>
        <p className="text-sm text-gray-600">Control who can see your profile and content</p>
      </div>

      {/* Profile Visibility */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="h-5 w-5 text-blue-500" />
          <div>
            <h4 className="font-medium">Profile Visibility</h4>
            <p className="text-sm text-gray-600">Who can see your profile</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="profileVisibility">Profile Visibility</Label>
            <Select 
              value={settings.profileVisibility} 
              onValueChange={(value) => updateSetting("profileVisibility", value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="friends">Friends</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Label htmlFor="isPrivate">Private Account</Label>
            <Switch
              id="isPrivate"
              checked={settings.isPrivate}
              onCheckedChange={(checked) => updateSetting("isPrivate", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="showLocation">Show Location</Label>
            <Switch
              id="showLocation"
              checked={settings.showLocation}
              onCheckedChange={(checked) => updateSetting("showLocation", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="showEmail">Show Email</Label>
            <Switch
              id="showEmail"
              checked={settings.showEmail}
              onCheckedChange={(checked) => updateSetting("showEmail", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="showPhone">Show Phone</Label>
            <Switch
              id="showPhone"
              checked={settings.showPhone}
              onCheckedChange={(checked) => updateSetting("showPhone", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="allowFriendRequests">Allow Friend Requests</Label>
            <Switch
              id="allowFriendRequests"
              checked={settings.allowFriendRequests}
              onCheckedChange={(checked) => updateSetting("allowFriendRequests", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="hideFromSearch">Hide from Search</Label>
            <Switch
              id="hideFromSearch"
              checked={settings.hideFromSearch}
              onCheckedChange={(checked) => updateSetting("hideFromSearch", checked)}
            />
          </div>
        </div>
      </Card>

      {/* Activity & Content */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-5 w-5 text-green-500" />
          <div>
            <h4 className="font-medium">Activity & Content</h4>
            <p className="text-sm text-gray-600">Control what others can see</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="showActivity">Show Activity</Label>
            <Switch
              id="showActivity"
              checked={settings.showActivity}
              onCheckedChange={(checked) => updateSetting("showActivity", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="showCollections">Show Collections</Label>
            <Switch
              id="showCollections"
              checked={settings.showCollections}
              onCheckedChange={(checked) => updateSetting("showCollections", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="showWishlist">Show Wishlist</Label>
            <Switch
              id="showWishlist"
              checked={settings.showWishlist}
              onCheckedChange={(checked) => updateSetting("showWishlist", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="allowComments">Allow Comments</Label>
            <Switch
              id="allowComments"
              checked={settings.allowComments}
              onCheckedChange={(checked) => updateSetting("allowComments", checked)}
            />
          </div>
        </div>
      </Card>

      {/* Messages & Communication */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="h-5 w-5 text-purple-500" />
          <div>
            <h4 className="font-medium">Messages & Communication</h4>
            <p className="text-sm text-gray-600">Control how others can contact you</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="allowMessages">Allow Messages</Label>
            <Switch
              id="allowMessages"
              checked={settings.allowMessages}
              onCheckedChange={(checked) => updateSetting("allowMessages", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="allowTradeRequests">Allow Trade Requests</Label>
            <Switch
              id="allowTradeRequests"
              checked={settings.allowTradeRequests}
              onCheckedChange={(checked) => updateSetting("allowTradeRequests", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="messagePermission">Message Permission</Label>
            <Switch
              id="messagePermission"
              checked={settings.messagePermission}
              onCheckedChange={(checked) => updateSetting("messagePermission", checked)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
