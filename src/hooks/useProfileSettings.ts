
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";

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
}

export const useProfileSettings = () => {
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const { session } = useClerk();
  const { toast } = useToast();
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
    }
  });

  // Load user data from Clerk when available
  useEffect(() => {
    if (isUserLoaded && isSignedIn && user) {
      const loadProfileData = async () => {
        try {
          // Populate form with Clerk user data
          form.reset({
            username: user.username || user.firstName || "",
            bio: user.unsafeMetadata?.bio as string || "",
            email: user.emailAddresses[0]?.emailAddress || "",
            phone: user.phoneNumbers[0]?.phoneNumber || "",
            avatarUrl: user.imageUrl || "",
            instagram: user.unsafeMetadata?.instagram as string || "",
            twitter: user.unsafeMetadata?.twitter as string || "",
            youtube: user.unsafeMetadata?.youtube as string || "",
            isPrivate: user.unsafeMetadata?.isPrivate as boolean || false,
            hideFromSearch: user.unsafeMetadata?.hideFromSearch as boolean || true,
            showActivityStatus: user.unsafeMetadata?.showActivityStatus as boolean || true,
            showCollection: user.unsafeMetadata?.showCollection as boolean || true,
            showWishlist: user.unsafeMetadata?.showWishlist as boolean || true,
            receiveEmailUpdates: user.unsafeMetadata?.receiveEmailUpdates as boolean || true,
            receiveMarketingEmails: user.unsafeMetadata?.receiveMarketingEmails as boolean || false,
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
  }, [isUserLoaded, isSignedIn, user]);

  // Save profile data
  const saveProfile = async (data: ProfileSettingsFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Save unsafe metadata to the user
      await user.update({
        username: data.username,
        unsafeMetadata: {
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
        },
      });
      
      // Update profile image if changed
      if (data.avatarUrl && data.avatarUrl !== user.imageUrl) {
        // For avatar URLs starting with data:, this is a file upload
        if (data.avatarUrl.startsWith('data:')) {
          const response = await fetch(data.avatarUrl);
          const blob = await response.blob();
          const file = new File([blob], "profile-image.png", { type: "image/png" });
          await user.setProfileImage({ file });
        } else {
          // For URL-based avatars - handle with caution as Clerk might reject some URLs
          try {
            // Store the URL in user metadata instead
            await user.update({
              unsafeMetadata: {
                ...user.unsafeMetadata,
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
      
      toast({
        title: "Profile updated",
        description: "Your profile settings have been saved."
      });
      
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        variant: "destructive",
        title: "Error saving profile",
        description: "Could not save your profile information. Please try again."
      });
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
