
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "@/utils/postStorage";
import { ExtendedPost } from "@/types/core";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import { isAuthenticated, getCurrentUser } from "@/utils/auth/authState";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Grid3X3, BookMarked, ShoppingBag } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import UserProfileHeader from "@/components/UserProfileHeader";
import { ProfilePostsGrid } from "@/components/profile/ProfilePostsGrid";
import { Card } from "@/components/ui/card";
import ErrorBoundary from "@/components/ui/error-boundary";
import { deletePost as deletePostFromStorage } from "@/utils/postStorage";

export const ProfileLayout = () => {
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState<ExtendedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Check if Clerk is configured
  let isClerkConfigured = localStorage.getItem('usingClerk') === 'true';
  
  // Safely handle Clerk hooks with fallback
  let clerkUser = null;
  let isClerkLoaded = true;
  let isSignedIn = false;
  
  try {
    if (isClerkConfigured) {
      const clerkData = useUser();
      clerkUser = clerkData.user;
      isClerkLoaded = clerkData.isLoaded;
      isSignedIn = clerkData.isSignedIn;
    }
  } catch (error) {
    console.warn("Clerk hooks not available, using fallback auth");
    isClerkConfigured = false;
  }
  
  const { openPostDialog } = usePostDialog();
  const userIsAuthenticated = isClerkConfigured ? isSignedIn : isAuthenticated();

  console.log("ProfileLayout: Auth state", {
    isClerkConfigured,
    userIsAuthenticated,
    isClerkLoaded,
    isSignedIn,
    clerkUser: !!clerkUser
  });

  useEffect(() => {
    let isMounted = true;
    
    const initializeProfile = async () => {
      console.log("ProfileLayout: Initializing...");
      setAuthError(null);
      
      try {
        // Check authentication first
        if (isClerkConfigured) {
          if (!isClerkLoaded) {
            console.log("ProfileLayout: Waiting for Clerk to load");
            return;
          }
          if (!isSignedIn) {
            console.log("ProfileLayout: User not signed in with Clerk, redirecting");
            if (isMounted) {
              setAuthError("Please sign in to view your profile");
              navigate('/');
            }
            return;
          }
        } else {
          if (!userIsAuthenticated) {
            console.log("ProfileLayout: User not authenticated with fallback, redirecting");
            if (isMounted) {
              setAuthError("Please sign in to view your profile");
              navigate('/');
            }
            return;
          }
        }

        // Get user ID
        let userId;
        if (isClerkConfigured && clerkUser) {
          userId = clerkUser.id;
        } else {
          const currentUser = getCurrentUser();
          userId = currentUser?.userId;
        }
        
        if (!userId) {
          console.log("ProfileLayout: No user ID found");
          if (isMounted) {
            setAuthError("Unable to identify user");
            setIsLoading(false);
            setIsInitialized(true);
          }
          return;
        }

        console.log("ProfileLayout: Fetching posts for user", userId);
        
        setIsLoading(true);
        const posts = await getPosts();
        
        if (isMounted) {
          console.log("ProfileLayout: Posts loaded", posts.length);
          // Filter posts for the current user
          const userSpecificPosts = posts.filter(post => 
            post.userId === userId || post.user_id === userId
          );
          console.log("ProfileLayout: User-specific posts", userSpecificPosts.length);
          setUserPosts(userSpecificPosts);
        }
      } catch (error) {
        console.error("ProfileLayout: Error during initialization:", error);
        if (isMounted) {
          setAuthError("Failed to load profile data");
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load your profile. Please try again.",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeProfile();
    
    return () => {
      isMounted = false;
    };
  }, [isClerkConfigured, clerkUser, isClerkLoaded, isSignedIn, userIsAuthenticated, navigate]);

  const handlePostClick = (post: ExtendedPost) => {
    openPostDialog(post);
  };
  
  const handleDeletePost = async (postId: string) => {
    try {
      const result = await deletePostFromStorage(postId);
      
      if (result.success) {
        setUserPosts(prev => prev.filter(post => post.id !== postId));
        toast({
          title: "Post deleted",
          description: "Your post has been successfully deleted.",
        });
      } else {
        throw new Error(result.error || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the post. Please try again.",
      });
    }
  };

  // Show loading while initializing
  if (!isInitialized || (isClerkConfigured && !isClerkLoaded) || isLoading) {
    console.log("ProfileLayout: Showing loading state");
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your profile...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show error state if there's an authentication error
  if (authError) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-lg text-red-600 dark:text-red-400">{authError}</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-softspot-500 text-white rounded-lg hover:bg-softspot-600"
            >
              Go Home
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Get user data for profile
  let username = '';
  let bio = '';
  let interests: string[] = [];
  
  if (isClerkConfigured && clerkUser) {
    username = clerkUser.username || clerkUser.firstName || 'User';
    bio = (clerkUser.unsafeMetadata?.bio as string) || "Hi! I'm a passionate plushie collector. Always looking to connect with fellow plushie enthusiasts!";
    interests = (clerkUser.unsafeMetadata?.plushieInterests as string[]) || ["Jellycat", "Squishmallows", "Build-A-Bear"];
  } else {
    const currentUser = getCurrentUser();
    username = currentUser?.username || 'User';
    
    try {
      const userProfile = localStorage.getItem('userProfile');
      if (userProfile) {
        const parsedProfile = JSON.parse(userProfile);
        bio = parsedProfile.bio || "Hi! I'm a passionate plushie collector. Always looking to connect with fellow plushie enthusiasts!";
        interests = parsedProfile.interests || ["Jellycat", "Squishmallows", "Build-A-Bear"];
      } else {
        bio = "Hi! I'm a passionate plushie collector. Always looking to connect with fellow plushie enthusiasts!";
        interests = ["Jellycat", "Squishmallows", "Build-A-Bear"];
      }
    } catch (error) {
      console.error("Error parsing user profile:", error);
      bio = "Hi! I'm a passionate plushie collector. Always looking to connect with fellow plushie enthusiasts!";
      interests = ["Jellycat", "Squishmallows", "Build-A-Bear"];
    }
  }
  
  console.log("ProfileLayout: Rendering profile for", username, "with", userPosts.length, "posts");
  
  const profileData = {
    bio: bio,
    interests: interests,
    isPrivate: false,
  };
  
  const regularPosts = userPosts.filter(post => !post.forSale);
  const salesPosts = userPosts.filter(post => post.forSale === true);

  return (
    <MainLayout noPadding>
      <ErrorBoundary>
        <div className="flex-grow">
          <UserProfileHeader
            username={username}
            isOwnProfile={true}
            profileData={profileData}
          />

          <div className="container mx-auto px-4 py-2 max-w-4xl">
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="bg-white dark:bg-gray-800 shadow-sm mb-6 rounded-full w-full flex justify-center p-1">
                <TabsTrigger 
                  value="posts" 
                  className="flex items-center data-[state=active]:bg-softspot-100 dark:data-[state=active]:bg-softspot-800 rounded-full data-[state=active]:shadow-none"
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  <span>Posts</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="collections" 
                  className="flex items-center data-[state=active]:bg-softspot-100 dark:data-[state=active]:bg-softspot-800 rounded-full data-[state=active]:shadow-none"
                >
                  <BookMarked className="h-4 w-4 mr-2" />
                  <span>Collections</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="sales" 
                  className="flex items-center data-[state=active]:bg-softspot-100 dark:data-[state=active]:bg-softspot-800 rounded-full data-[state=active]:shadow-none"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  <span>For Sale</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts">
                <Card className="overflow-hidden bg-transparent shadow-none">
                  <ProfilePostsGrid 
                    posts={regularPosts} 
                    onPostClick={handlePostClick} 
                    onDeletePost={handleDeletePost}
                    isOwnProfile={true}
                    showCreateButton={true}
                  />
                </Card>
              </TabsContent>
              
              <TabsContent value="collections">
                <Card className="shadow-sm bg-white dark:bg-gray-800 rounded-2xl">
                  <div className="text-center py-16">
                    <h3 className="text-lg font-medium dark:text-white">Collection Coming Soon</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                      This feature will be available in a future update.
                    </p>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="sales">
                <Card className="overflow-hidden bg-transparent shadow-none">
                  <ProfilePostsGrid 
                    posts={salesPosts} 
                    onPostClick={handlePostClick} 
                    onDeletePost={handleDeletePost}
                    isOwnProfile={true}
                    showCreateButton={false}
                  />
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ErrorBoundary>
    </MainLayout>
  );
};
