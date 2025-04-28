
import { useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";

export function useClerkSync() {
  const { user } = useUser();

  const updateClerkProfile = async (data: {
    username?: string;
    imageUrl?: string;
    firstName?: string;
    lastName?: string;
    publicMetadata?: Record<string, any>;
  }) => {
    if (!user) return;

    try {
      await user.update({
        ...data,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          lastUpdated: new Date().toISOString(),
        },
      });
      
      await user.reload();
      
      return { success: true };
    } catch (error) {
      console.error('Error updating Clerk profile:', error);
      return { success: false, error };
    }
  };

  return { updateClerkProfile };
}
