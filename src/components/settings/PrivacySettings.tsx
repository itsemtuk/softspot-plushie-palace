import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { UserPrivacySettings } from "@/types/user";

interface PrivacySettingsProps {
  initialSettings: UserPrivacySettings;
  onSave: (settings: UserPrivacySettings) => Promise<void>;
}

export function PrivacySettings({ initialSettings, onSave }: PrivacySettingsProps) {
  const [settings, setSettings] = useState<UserPrivacySettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleSettingChange = (key: keyof UserPrivacySettings, value: any) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(settings);
      alert("Privacy settings saved!");
    } catch (error) {
      console.error("Error saving privacy settings:", error);
      alert("Failed to save privacy settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm p-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Privacy Settings</CardTitle>
        <CardDescription>Manage your privacy preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="isPrivate">Private Account</Label>
          <Switch
            id="isPrivate"
            checked={settings.isPrivate}
            onCheckedChange={(checked) => handleSettingChange("isPrivate", checked)}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="showEmail">Show Email</Label>
          <Switch
            id="showEmail"
            checked={settings.showEmail}
            onCheckedChange={(checked) => handleSettingChange("showEmail", checked)}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="showPhone">Show Phone</Label>
          <Switch
            id="showPhone"
            checked={settings.showPhone}
            onCheckedChange={(checked) => handleSettingChange("showPhone", checked)}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="allowMessages">Allow Messages</Label>
          <Switch
            id="allowMessages"
            checked={settings.allowMessages}
            onCheckedChange={(checked) => handleSettingChange("allowMessages", checked)}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="allowTradeRequests">Allow Trade Requests</Label>
          <Switch
            id="allowTradeRequests"
            checked={settings.allowTradeRequests}
            onCheckedChange={(checked) => handleSettingChange("allowTradeRequests", checked)}
          />
        </div>
        <Separator />
        <div>
          <Label htmlFor="profileVisibility">Profile Visibility</Label>
          <Select value={settings.profileVisibility} onValueChange={(value) => handleSettingChange("profileVisibility", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select visibility" />
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
          <Label htmlFor="showLocation">Show Location</Label>
          <Switch
            id="showLocation"
            checked={settings.showLocation}
            onCheckedChange={(checked) => handleSettingChange("showLocation", checked)}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="allowFriendRequests">Allow Friend Requests</Label>
          <Switch
            id="allowFriendRequests"
            checked={settings.allowFriendRequests}
            onCheckedChange={(checked) => handleSettingChange("allowFriendRequests", checked)}
          />
        </div>
         <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="messagePermission">Message Permission</Label>
          <Switch
            id="messagePermission"
            checked={settings.messagePermission}
            onCheckedChange={(checked) => handleSettingChange("messagePermission", checked)}
          />
        </div>
         <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="showActivity">Show Activity</Label>
          <Switch
            id="showActivity"
            checked={settings.showActivity}
            onCheckedChange={(checked) => handleSettingChange("showActivity", checked)}
          />
        </div>
         <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="hideFromSearch">Hide From Search</Label>
          <Switch
            id="hideFromSearch"
            checked={settings.hideFromSearch}
            onCheckedChange={(checked) => handleSettingChange("hideFromSearch", checked)}
          />
        </div>
         <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="allowComments">Allow Comments</Label>
          <Switch
            id="allowComments"
            checked={settings.allowComments}
            onCheckedChange={(checked) => handleSettingChange("allowComments", checked)}
          />
        </div>
         <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="showCollections">Show Collections</Label>
          <Switch
            id="showCollections"
            checked={settings.showCollections}
            onCheckedChange={(checked) => handleSettingChange("showCollections", checked)}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="showWishlist">Show Wishlist</Label>
          <Switch
            id="showWishlist"
            checked={settings.showWishlist}
            onCheckedChange={(checked) => handleSettingChange("showWishlist", checked)}
          />
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
