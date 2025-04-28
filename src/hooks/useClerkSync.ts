
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
          status: currentStatus
        });
      }
    }
  }, [user]);

  const updateClerkProfile = async (data: {
    username?: string;
    imageUrl?: string;
    firstName?: string;
    lastName?: string;
    status?: string;
  }) => {
    if (!user) return;

    try {
      // Handle metadata separately using the correct API
      if (data.status) {
        // Use unsafeMetadata for status since publicMetadata is causing issues
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            status: data.status,
            lastUpdated: new Date().toISOString(),
          }
        });
        
        // Update in local storage
        setUserStatus(data.status as "online" | "offline" | "away" | "busy");
      }
      
      // Update other user properties if any are provided
      const profileData = { ...data };
      delete profileData.status; // Remove status as it's handled above
      
      if (Object.keys(profileData).length > 0) {
        await user.update(profileData);
      }
      
      await user.reload();
      
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
      status
    });
  };

  return { updateClerkProfile, updateUserStatus };
}
