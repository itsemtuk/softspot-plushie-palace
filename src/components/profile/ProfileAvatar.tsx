
import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

interface ProfileAvatarProps {
  profileImage: string | null;
}

export function ProfileAvatar({ profileImage }: ProfileAvatarProps) {
  const { user } = useUser();

  // Sync profile image with Clerk when it changes
  useEffect(() => {
    if (user && profileImage && profileImage !== user.imageUrl) {
      // For avatar URLs starting with data:, this is a file upload
      const syncProfileWithClerk = async () => {
        try {
          if (profileImage.startsWith('data:')) {
            const response = await fetch(profileImage);
            const blob = await response.blob();
            const file = new File([blob], "profile-image.png", { type: "image/png" });
            await user.setProfileImage({ file });
            console.log("Profile image synced with Clerk");
          } else if (!profileImage.startsWith('http')) {
            // For local avatars from the assets folder
            try {
              const response = await fetch(profileImage);
              const blob = await response.blob();
              const file = new File([blob], "profile-image.png", { type: "image/png" });
              await user.setProfileImage({ file });
              console.log("Profile image synced with Clerk from local file");
            } catch (error) {
              console.error("Failed to update profile image with local URL:", error);
            }
          } else {
            // For URL-based avatars - store the URL in user metadata
            try {
              await user.update({
                unsafeMetadata: {
                  ...user.unsafeMetadata,
                  customAvatarUrl: profileImage
                }
              });
              console.log("Custom avatar URL saved to Clerk metadata");
            } catch (error) {
              console.error("Failed to update profile image with URL:", error);
            }
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
      <div className="w-28 h-28 bg-softspot-200 rounded-full overflow-hidden border-4 border-white">
        <img 
          src={profileImage || "https://i.pravatar.cc/300"} 
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
