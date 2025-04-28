import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UserPrivacySettings, PrivacySetting } from "@/types/marketplace";

const PrivacySettings = () => {
  const [profileVisibility, setProfileVisibility] = useState<PrivacySetting>("public");
  const [allowMessages, setAllowMessages] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [allowTagging, setAllowTagging] = useState(true);
  
  // Fix the type errors by ensuring all state is correctly typed
  const [privacySettings, setPrivacySettings] = useState<UserPrivacySettings>({
    profileVisibility: "public" as PrivacySetting,
    allowMessages: true,
    showActivity: true,
    allowTagging: true,
    profile: "public" as PrivacySetting,
    posts: "public" as PrivacySetting,
    wishlist: "public" as PrivacySetting,
    marketplace: "public" as PrivacySetting,
    messages: "friends" as PrivacySetting,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>
          Manage your privacy preferences to control who can see your profile
          and activity.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="profile-visibility">Profile Visibility</Label>
            <p className="text-sm text-muted-foreground">
              Who can view your profile?
            </p>
          </div>
          <select
            id="profile-visibility"
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={privacySettings.profileVisibility}
            onChange={(e) =>
              setPrivacySettings({
                ...privacySettings,
                profileVisibility: e.target.value as PrivacySetting,
              })
            }
          >
            <option value="public">Public</option>
            <option value="friends">Friends</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="allow-messages">Allow Messages</Label>
            <p className="text-sm text-muted-foreground">
              Allow other users to send you direct messages.
            </p>
          </div>
          <Switch
            id="allow-messages"
            checked={privacySettings.allowMessages}
            onCheckedChange={(checked) =>
              setPrivacySettings({ ...privacySettings, allowMessages: checked })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="show-activity">Show Activity</Label>
            <p className="text-sm text-muted-foreground">
              Display your recent activity to other users.
            </p>
          </div>
          <Switch
            id="show-activity"
            checked={privacySettings.showActivity}
            onCheckedChange={(checked) =>
              setPrivacySettings({ ...privacySettings, showActivity: checked })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="allow-tagging">Allow Tagging</Label>
            <p className="text-sm text-muted-foreground">
              Allow other users to tag you in their posts.
            </p>
          </div>
          <Switch
            id="allow-tagging"
            checked={privacySettings.allowTagging}
            onCheckedChange={(checked) =>
              setPrivacySettings({ ...privacySettings, allowTagging: checked })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;
