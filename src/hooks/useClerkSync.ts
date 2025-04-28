
import { useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import { setUserStatus, getUserStatus } from "@/utils/storage/localStorageUtils";

export function useClerkSync() {
  const { user } = useUser();

  // Sync user status with Clerk on mount
  useEffect(() => {
    if (user) {
      // Get current status from localStorage
      const currentStatus = getUserStatus();
      
      // Set status in Clerk if it differs
      const clerkStatus = user.publicMetadata?.status as string || 'online';
      if (clerkStatus !== currentStatus) {
        updateClerkProfile({
          publicMetadata: {
            status: currentStatus
          }
        });
      }
    }
  }, [user]);

  const updateClerkProfile = async (data: {
    username?: string;
    imageUrl?: string;
    firstName?: string;
    lastName?: string;
    publicMetadata?: Record<string, any>;
  }) => {
    if (!user) return;

    try {
      // Clone the data object to avoid modifying the original
      const updateData = { ...data };
      
      // Handle metadata separately to avoid API errors
      if (updateData.publicMetadata) {
        await user.update({
          publicMetadata: updateData.publicMetadata
        });
        delete updateData.publicMetadata;
      }
      
      // Update other user properties if any are provided
      if (Object.keys(updateData).length > 0) {
        await user.update({
          ...updateData,
          unsafeMetadata: {
            ...user.unsafeMetadata,
            lastUpdated: new Date().toISOString(),
          },
        });
      }
      
      await user.reload();
      
      // If we're updating status, also update local storage
      if (data.publicMetadata?.status) {
        setUserStatus(data.publicMetadata.status as "online" | "offline" | "away" | "busy");
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating Clerk profile:', error);
      return { success: false, error };
    }
  };
  
  // Function to update user status
  const updateUserStatus = async (status: "online" | "offline" | "away" | "busy") => {
    setUserStatus(status);
    
    return updateClerkProfile({
      publicMetadata: {
        status
      }
    });
  };

  return { updateClerkProfile, updateUserStatus };
}
