
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserPrivacySettings } from '@/types/marketplace';

export function PrivacySettings() {
  const [settings, setSettings] = useState<UserPrivacySettings>({
    profileVisibility: 'public',
    showEmail: false,
    showLocation: true,
    allowMessages: true,
    allowFriendRequests: true,
    messagePermission: true,
    showActivity: true,
    hideFromSearch: false,
    allowComments: true,
    showCollections: true,
    showWishlist: true,
  });
  
  const { toast } = useToast();

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('privacySettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading privacy settings:', error);
      }
    }
  }, []);

  const handleSettingChange = (key: keyof UserPrivacySettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('privacySettings', JSON.stringify(settings));
      toast({
        title: "Settings saved",
        description: "Your privacy settings have been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save privacy settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Visibility</CardTitle>
          <CardDescription>
            Control who can see your profile and information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-visibility">Profile Visibility</Label>
            <Select 
              value={settings.profileVisibility} 
              onValueChange={(value: 'public' | 'friends' | 'private') => 
                handleSettingChange('profileVisibility', value)
              }
            >
              <SelectTrigger id="profile-visibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-email">Show Email Address</Label>
              <p className="text-sm text-muted-foreground">
                Display your email on your public profile
              </p>
            </div>
            <Switch
              id="show-email"
              checked={settings.showEmail}
              onCheckedChange={(checked) => handleSettingChange('showEmail', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-location">Show Location</Label>
              <p className="text-sm text-muted-foreground">
                Display your location on your profile
              </p>
            </div>
            <Switch
              id="show-location"
              checked={settings.showLocation}
              onCheckedChange={(checked) => handleSettingChange('showLocation', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Communication</CardTitle>
          <CardDescription>
            Manage how others can communicate with you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-messages">Allow Messages</Label>
              <p className="text-sm text-muted-foreground">
                Let other users send you direct messages
              </p>
            </div>
            <Switch
              id="allow-messages"
              checked={settings.allowMessages}
              onCheckedChange={(checked) => handleSettingChange('allowMessages', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-friend-requests">Allow Friend Requests</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to send you friend requests
              </p>
            </div>
            <Switch
              id="allow-friend-requests"
              checked={settings.allowFriendRequests}
              onCheckedChange={(checked) => handleSettingChange('allowFriendRequests', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Visibility</CardTitle>
          <CardDescription>
            Control what content is visible to others
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-activity">Show Activity</Label>
              <p className="text-sm text-muted-foreground">
                Display your recent activity and posts
              </p>
            </div>
            <Switch
              id="show-activity"
              checked={settings.showActivity}
              onCheckedChange={(checked) => handleSettingChange('showActivity', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-collections">Show Collections</Label>
              <p className="text-sm text-muted-foreground">
                Display your plushie collections publicly
              </p>
            </div>
            <Switch
              id="show-collections"
              checked={settings.showCollections}
              onCheckedChange={(checked) => handleSettingChange('showCollections', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-wishlist">Show Wishlist</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to see your wishlist
              </p>
            </div>
            <Switch
              id="show-wishlist"
              checked={settings.showWishlist}
              onCheckedChange={(checked) => handleSettingChange('showWishlist', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-comments">Allow Comments</Label>
              <p className="text-sm text-muted-foreground">
                Let others comment on your posts
              </p>
            </div>
            <Switch
              id="allow-comments"
              checked={settings.allowComments}
              onCheckedChange={(checked) => handleSettingChange('allowComments', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search & Discovery</CardTitle>
          <CardDescription>
            Control how you appear in search results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="hide-from-search">Hide from Search</Label>
              <p className="text-sm text-muted-foreground">
                Prevent your profile from appearing in search results
              </p>
            </div>
            <Switch
              id="hide-from-search"
              checked={settings.hideFromSearch}
              onCheckedChange={(checked) => handleSettingChange('hideFromSearch', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveSettings}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}
