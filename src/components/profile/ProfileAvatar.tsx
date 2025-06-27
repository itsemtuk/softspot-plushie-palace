
import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

interface ProfileAvatarProps {
  profileImage: string | null;
}

export function ProfileAvatar({ profileImage }: ProfileAvatarProps) {
  const { user } = useUser();

  // Get the best available avatar URL
  const getAvatarUrl = () => {
    // Prioritize: custom profile image -> Clerk image -> fallback
    if (profileImage && profileImage !== user?.imageUrl) {
      return profileImage;
    }
    if (user?.imageUrl) {
      return user.imageUrl;
    }
    return "https://i.pravatar.cc/300";
  };

  // Sync profile image with Clerk when it changes
  useEffect(() => {
    if (user && profileImage && profileImage !== user.imageUrl) {
      const syncProfileWithClerk = async () => {
        try {
          if (profileImage.startsWith('data:')) {
            const response = await fetch(profileImage);
            const blob = await response.blob();
            const file = new File([blob], "profile-image.png", { type: "image/png" });
            await user.setProfileImage({ file });
            console.log("Profile image synced with Clerk");
          } else if (profileImage.startsWith('http')) {
            // For URL-based avatars - store the URL in user metadata
            await user.update({
              unsafeMetadata: {
                ...user.unsafeMetadata,
                customAvatarUrl: profileImage
              }
            });
            console.log("Custom avatar URL saved to Clerk metadata");
          }
        } catch (error) {
          console.error("Error syncing profile image with Clerk:", error);
        }
      };
      
      syncProfileWithClerk();
    }
  }, [profileImage, user]);

  return (
    <div className="relative">
      <div className="w-28 h-28 bg-softspot-200 rounded-full overflow-hidden border-4 border-white shadow-lg">
        <img 
          src={getAvatarUrl()} 
          alt="Profile" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://i.pravatar.cc/300";
          }}
        />
      </div>
    </div>
  );
}
