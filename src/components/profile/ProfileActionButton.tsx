
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit2, UserPlus, UserMinus, UserCheck } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ProfileActionButtonProps {
  isOwnProfile: boolean;
  isFollowing: boolean;
  isPending: boolean;
  isPrivate?: boolean;
  username?: string;
  onEditProfile?: () => void;
  onFollowToggle?: () => void;
}

export function ProfileActionButton({
  isOwnProfile,
  isFollowing,
  isPending,
  isPrivate = false,
  username,
  onEditProfile,
  onFollowToggle
}: ProfileActionButtonProps) {
  if (isOwnProfile) {
    return (
      <Button 
        variant="outline" 
        className="text-softspot-500 border-softspot-200"
        onClick={onEditProfile}
      >
        <Edit2 className="mr-2 h-4 w-4" />
        Edit Profile
      </Button>
    );
  } else if (isPending) {
    return (
      <Button 
        variant="outline" 
        className="text-gray-500 border-gray-200"
        disabled
      >
        <UserCheck className="mr-2 h-4 w-4" />
        Requested
      </Button>
    );
  } else if (isFollowing) {
    return (
      <Button 
        variant="outline" 
        className="text-softspot-500 border-softspot-200"
        onClick={onFollowToggle}
      >
        <UserMinus className="mr-2 h-4 w-4" />
        Unfollow
      </Button>
    );
  } else {
    return (
      <Button 
        className="bg-softspot-500 hover:bg-softspot-600 text-white"
        onClick={onFollowToggle}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        {isPrivate ? "Request to Follow" : "Follow"}
      </Button>
    );
  }
}
