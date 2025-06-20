
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus } from 'lucide-react';
import { useFollowUser } from '@/hooks/useFollowUser';

interface ProfileActionButtonProps {
  userId?: string;
  isOwnProfile: boolean;
}

export const ProfileActionButton: React.FC<ProfileActionButtonProps> = ({ 
  userId, 
  isOwnProfile 
}) => {
  const { isFollowing, isLoading, toggleFollow } = useFollowUser(userId);

  if (isOwnProfile) {
    return null;
  }

  return (
    <Button
      onClick={toggleFollow}
      disabled={isLoading}
      variant={isFollowing ? "outline" : "default"}
      className={`rounded-full px-6 ${
        isFollowing 
          ? 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700' 
          : 'bg-softspot-500 hover:bg-softspot-600 text-white'
      }`}
    >
      {isLoading ? (
        'Loading...'
      ) : isFollowing ? (
        <>
          <UserMinus className="mr-2 h-4 w-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
};
