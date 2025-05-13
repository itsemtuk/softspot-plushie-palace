
import { useState } from "react";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription 
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

// Social media platform data
const socialPlatforms = [
  { id: "instagram", label: "Instagram", icon: "instagram" },
  { id: "facebook", label: "Facebook", icon: "facebook" },
  { id: "twitter", label: "X (Twitter)", icon: "twitter" },
  { id: "pinterest", label: "Pinterest", icon: "link" },
  { id: "tiktok", label: "TikTok", icon: "link" },
  { id: "youtube", label: "YouTube", icon: "youtube" },
  { id: "bluesky", label: "Bluesky", icon: "link" },
  { id: "other", label: "Other", icon: "link" }
];

interface SocialMediaTabProps {
  form: UseFormReturn<any>;
}

export const SocialMediaTab = ({ form }: SocialMediaTabProps) => {
  const [newPlatform, setNewPlatform] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const socialLinks = form.watch("socialLinks") || [];
  
  const addSocialLink = () => {
    if (!newPlatform || !newUsername) return;
    
    const updatedLinks = [...socialLinks, {
      platform: newPlatform,
      username: newUsername
    }];
    
    form.setValue("socialLinks", updatedLinks);
    setNewPlatform("");
    setNewUsername("");
    setDialogOpen(false);
  };
  
  const removeSocialLink = (index: number) => {
    const updatedLinks = [...socialLinks];
    updatedLinks.splice(index, 1);
    form.setValue("socialLinks", updatedLinks);
  };
  
  const getPlatformLabel = (platformId: string) => {
    const platform = socialPlatforms.find(p => p.id === platformId);
    return platform ? platform.label : platformId;
  };
  
  return (
    <div className="border-b border-gray-200 pb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Social Media Profiles</h3>
      <p className="text-sm text-gray-500 mb-4">
        Connect your social media accounts to show them on your profile
      </p>
      
      <div className="space-y-4">
        {/* Display existing social links */}
        {socialLinks.length > 0 && (
          <div className="space-y-3 mb-4">
            {socialLinks.map((link: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">{getPlatformLabel(link.platform)}</p>
                  <p className="text-sm text-gray-500">{link.username}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSocialLink(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {/* Add new social media platform */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Platform</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Social Media Platform</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <FormLabel htmlFor="platform">Platform</FormLabel>
                <Select value={newPlatform} onValueChange={setNewPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {socialPlatforms.map(platform => (
                        <SelectItem key={platform.id} value={platform.id}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <FormLabel htmlFor="username">Username/URL</FormLabel>
                <Input 
                  id="username" 
                  value={newUsername} 
                  onChange={e => setNewUsername(e.target.value)} 
                  placeholder="Enter username or profile URL"
                />
              </div>
              <div className="flex justify-end gap-3">
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={addSocialLink} disabled={!newPlatform || !newUsername}>
                  Add
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Help text */}
        <p className="text-sm text-gray-500">
          Add your social media profiles to help others connect with you.
        </p>
      </div>
    </div>
  );
};
