
import React from 'react';
import { Button } from '../ui/button';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';

export interface ProfileActionButtonProps {
  isFollowing: boolean;
  onFollowToggle: () => void;
  isOwnProfile: boolean;
  isPending: boolean;
}

export function ProfileActionButton({ 
  isFollowing, 
  onFollowToggle, 
  isOwnProfile, 
  isPending 
}: ProfileActionButtonProps) {
  
  if (isOwnProfile) return null;
  
  return (
    <Button
      variant={isFollowing ? "secondary" : "default"}
      onClick={onFollowToggle}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : isFollowing ? (
        <UserCheck className="h-4 w-4 mr-2" />
      ) : (
        <UserPlus className="h-4 w-4 mr-2" />
      )}
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}
