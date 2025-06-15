
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUser, useClerk } from "@clerk/clerk-react";
import { toast } from "@/components/ui/use-toast";
import { useSupabaseProfile } from "./useSupabaseProfile";

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
  website?: string;
  location?: string;
  full_name?: string;
  phone_number?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  country?: string;
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

  const { profile, loading: profileLoading, saving: profileSaving, saveProfile: saveSupabaseProfile, userSyncError } = useSupabaseProfile();

  const form = useForm<ProfileSettingsFormData>({
    defaultValues: {
      username: "",
      bio: "",
      email: "",
      phone: "",
      avatarUrl: "",
      full_name: "",
      phone_number: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state_province: "",
      postal_code: "",
      country: "us",
      website: "",
      location: "",
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

  // Load user data from Clerk and Supabase when available
  useEffect(() => {
    if (isUserLoaded && isSignedIn && user && profile !== null && !profileLoading && !userSyncError) {
      const loadProfileData = async () => {
        try {
          // Get meta data with defaults
          const meta = user.unsafeMetadata || {};
          
          // Populate form with combined Clerk and Supabase data
          form.reset({
            username: user.username || user.firstName || "",
            bio: profile?.bio || meta.bio as string || "",
            email: user.emailAddresses[0]?.emailAddress || "",
            phone: user.phoneNumbers[0]?.phoneNumber || "",
            avatarUrl: user.imageUrl || "",
            full_name: profile?.full_name || "",
            phone_number: profile?.phone_number || "",
            address_line_1: profile?.address_line_1 || "",
            address_line_2: profile?.address_line_2 || "",
            city: profile?.city || "",
            state_province: profile?.state_province || "",
            postal_code: profile?.postal_code || "",
            country: profile?.country || "us",
            website: profile?.website || "",
            location: profile?.location || "",
            instagram: profile?.instagram || meta.instagram as string || "",
            twitter: profile?.twitter || meta.twitter as string || "",
            youtube: profile?.youtube || meta.youtube as string || "",
            isPrivate: profile?.is_private ?? meta.isPrivate as boolean ?? false,
            hideFromSearch: profile?.hide_from_search ?? meta.hideFromSearch as boolean ?? true,
            showActivityStatus: profile?.show_activity_status ?? meta.showActivityStatus as boolean ?? true,
            showCollection: profile?.show_collection ?? meta.showCollection as boolean ?? true,
            showWishlist: profile?.show_wishlist ?? meta.showWishlist as boolean ?? true,
            receiveEmailUpdates: profile?.receive_email_updates ?? meta.receiveEmailUpdates as boolean ?? true,
            receiveMarketingEmails: profile?.receive_marketing_emails ?? meta.receiveMarketingEmails as boolean ?? false,
            receiveWishlistAlerts: profile?.receive_wishlist_alerts ?? meta.receiveWishlistAlerts as boolean ?? false,
            newReleaseAlerts: profile?.new_release_alerts ?? meta.newReleaseAlerts as boolean ?? false,
            favoriteBrands: profile?.favorite_brands || meta.favoriteBrands as string[] || [],
            favoriteTypes: profile?.favorite_types || meta.favoriteTypes as string[] || [],
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
  }, [isUserLoaded, isSignedIn, user, profile, profileLoading, userSyncError, form]);

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
      
      // Save to Supabase profiles table
      const supabaseSuccess = await saveSupabaseProfile({
        full_name: data.full_name,
        phone_number: data.phone_number,
        address_line_1: data.address_line_1,
        address_line_2: data.address_line_2,
        city: data.city,
        state_province: data.state_province,
        postal_code: data.postal_code,
        country: data.country,
        bio: data.bio,
        website: data.website,
        location: data.location,
        instagram: data.instagram,
        twitter: data.twitter,
        youtube: data.youtube,
        is_private: data.isPrivate,
        hide_from_search: data.hideFromSearch,
        show_activity_status: data.showActivityStatus,
        show_collection: data.showCollection,
        show_wishlist: data.showWishlist,
        receive_email_updates: data.receiveEmailUpdates,
        receive_marketing_emails: data.receiveMarketingEmails,
        receive_wishlist_alerts: data.receiveWishlistAlerts,
        new_release_alerts: data.newReleaseAlerts,
        favorite_brands: data.favoriteBrands,
        favorite_types: data.favoriteTypes,
      });

      if (!supabaseSuccess) {
        throw new Error("Failed to save to Supabase");
      }
      
      // Build updated Clerk metadata object (for social links, etc.)
      const updatedMetadata = {
        ...user.unsafeMetadata,
        socialLinks: data.socialLinks,
        storeLinks: data.storeLinks,
        // Sync plushie interests with favorite collections
        plushieInterests: data.favoriteBrands || []
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
    isSubmitting: isSubmitting || profileSaving,
    isSynced: isSynced && !profileLoading && !userSyncError,
    activeTab,
    setActiveTab,
    saveProfile,
    user
  };
};
