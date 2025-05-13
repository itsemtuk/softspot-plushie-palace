
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUser, useClerk } from "@clerk/clerk-react";
import { toast } from "@/components/ui/use-toast";

interface SocialLink {
  platform: string;
  username: string;
}

interface StoreLink {
  platform: string;
  url: string;
}

interface ProfileSettingsFormData {
  username: string;
  bio: string;
  email: string;
  phone?: string;
  avatarUrl: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  isPrivate?: boolean;
  hideFromSearch?: boolean;
  showActivityStatus?: boolean;
  showCollection?: boolean;
  showWishlist?: boolean;
  receiveEmailUpdates?: boolean;
  receiveMarketingEmails?: boolean;
  receiveWishlistAlerts?: boolean;
  newReleaseAlerts?: boolean;
  favoriteBrands?: string[];
  favoriteTypes?: string[];
  socialLinks?: SocialLink[];
  storeLinks?: StoreLink[];
}

export const useProfileSettings = () => {
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const { session } = useClerk();
  const [activeTab, setActiveTab] = useState("basic-info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  const form = useForm<ProfileSettingsFormData>({
    defaultValues: {
      username: "",
      bio: "",
      email: "",
      phone: "",
      avatarUrl: "",
      isPrivate: false,
      hideFromSearch: true,
      showActivityStatus: true,
      showCollection: true,
      showWishlist: true,
      receiveEmailUpdates: true,
      receiveMarketingEmails: false,
      newReleaseAlerts: false,
      receiveWishlistAlerts: false,
      favoriteBrands: [],
      favoriteTypes: [],
      socialLinks: [],
      storeLinks: []
    }
  });

  // Load user data from Clerk when available
  useEffect(() => {
    if (isUserLoaded && isSignedIn && user) {
      const loadProfileData = async () => {
        try {
          // Get meta data with defaults
          const meta = user.unsafeMetadata || {};
          
          // Populate form with Clerk user data
          form.reset({
            username: user.username || user.firstName || "",
            bio: meta.bio as string || "",
            email: user.emailAddresses[0]?.emailAddress || "",
            phone: user.phoneNumbers[0]?.phoneNumber || "",
            avatarUrl: user.imageUrl || "",
            instagram: meta.instagram as string || "",
            twitter: meta.twitter as string || "",
            youtube: meta.youtube as string || "",
            isPrivate: meta.isPrivate as boolean || false,
            hideFromSearch: meta.hideFromSearch as boolean || true,
            showActivityStatus: meta.showActivityStatus as boolean || true,
            showCollection: meta.showCollection as boolean || true,
            showWishlist: meta.showWishlist as boolean || true,
            receiveEmailUpdates: meta.receiveEmailUpdates as boolean || true,
            receiveMarketingEmails: meta.receiveMarketingEmails as boolean || false,
            receiveWishlistAlerts: meta.receiveWishlistAlerts as boolean || false,
            newReleaseAlerts: meta.newReleaseAlerts as boolean || false,
            favoriteBrands: meta.favoriteBrands as string[] || [],
            favoriteTypes: meta.favoriteTypes as string[] || [],
            socialLinks: meta.socialLinks as SocialLink[] || [],
            storeLinks: meta.storeLinks as StoreLink[] || [],
          });
          
          setIsSynced(true);
        } catch (error) {
          console.error("Error loading profile data:", error);
          toast({
            variant: "destructive",
            title: "Error loading profile",
            description: "Could not load your profile information. Please try again."
          });
        }
      };

      loadProfileData();
    }
  }, [isUserLoaded, isSignedIn, user, form]);

  // Save profile data
  const saveProfile = async (data: ProfileSettingsFormData) => {
    if (!user) {
      console.error("No user found when trying to save profile");
      toast({
        variant: "destructive",
        title: "Error saving profile",
        description: "You must be logged in to save profile information."
      });
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Saving profile data:", data);
      
      // Build updated metadata object
      const updatedMetadata = {
        ...user.unsafeMetadata,
        bio: data.bio,
        instagram: data.instagram,
        twitter: data.twitter,
        youtube: data.youtube,
        isPrivate: data.isPrivate,
        hideFromSearch: data.hideFromSearch,
        showActivityStatus: data.showActivityStatus,
        showCollection: data.showCollection,
        showWishlist: data.showWishlist,
        receiveEmailUpdates: data.receiveEmailUpdates,
        receiveMarketingEmails: data.receiveMarketingEmails,
        receiveWishlistAlerts: data.receiveWishlistAlerts,
        newReleaseAlerts: data.newReleaseAlerts,
        favoriteBrands: data.favoriteBrands,
        favoriteTypes: data.favoriteTypes,
        socialLinks: data.socialLinks,
        storeLinks: data.storeLinks,
      };
      
      // Save username if changed
      if (data.username && data.username !== user.username) {
        await user.update({
          username: data.username,
        });
      }
      
      // Save metadata to user
      await user.update({
        unsafeMetadata: updatedMetadata,
      });
      
      // Update profile image if changed
      if (data.avatarUrl && data.avatarUrl !== user.imageUrl) {
        // For avatar URLs starting with data:, this is a file upload
        if (data.avatarUrl.startsWith('data:')) {
          const response = await fetch(data.avatarUrl);
          const blob = await response.blob();
          const file = new File([blob], "profile-image.png", { type: "image/png" });
          await user.setProfileImage({ file });
        } else if (data.avatarUrl.startsWith('/')) {
          // For local avatars from the assets folder
          try {
            const response = await fetch(data.avatarUrl);
            const blob = await response.blob();
            const file = new File([blob], "profile-image.png", { type: "image/png" });
            await user.setProfileImage({ file });
          } catch (error) {
            console.error("Failed to update profile image with local URL:", error);
          }
        } else {
          // For URL-based avatars - handle with caution as Clerk might reject some URLs
          try {
            // Store the URL in user metadata instead
            await user.update({
              unsafeMetadata: {
                ...updatedMetadata,
                customAvatarUrl: data.avatarUrl
              }
            });
          } catch (error) {
            console.error("Failed to update profile image with URL:", error);
          }
        }
      }
      
      // Update localStorage with user settings 
      localStorage.setItem('currentUsername', data.username);
      localStorage.setItem('userAvatarUrl', user.imageUrl);
      
      // Dispatch event to update components that rely on this data
      window.dispatchEvent(new CustomEvent('profile-update', { 
        detail: { username: data.username, avatarUrl: user.imageUrl } 
      }));
      
      toast({
        title: "Profile updated",
        description: "Your profile settings have been saved successfully."
      });
      
      return true;
      
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        variant: "destructive",
        title: "Error saving profile",
        description: `Could not save your profile information: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    isSynced,
    activeTab,
    setActiveTab,
    saveProfile,
    user
  };
};
