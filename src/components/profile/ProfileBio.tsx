
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

interface ProfileBioProps {
  bio?: string;
  isOwnProfile?: boolean;
  onUpdateBio?: (bio: string) => void;
}

export const ProfileBio = ({ bio, isOwnProfile = false, onUpdateBio }: ProfileBioProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState(bio || "");
  
  const handleSaveBio = () => {
    if (onUpdateBio) {
      onUpdateBio(bioText);
      toast({
        title: "Bio updated",
        description: "Your bio has been updated successfully."
      });
    }
    setIsEditing(false);
  };
  
  return (
    <div className="mb-4 relative">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-gray-800">About Me</h2>
        {isOwnProfile && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 hover:text-softspot-500"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
        )}
      </div>
      
      <p className="text-gray-700 whitespace-pre-wrap">
        {bio || "No bio yet"}
      </p>
      
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Your Bio</DialogTitle>
          </DialogHeader>
          
          <Textarea
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            placeholder="Tell us about yourself..."
            className="min-h-[150px]"
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSaveBio}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
