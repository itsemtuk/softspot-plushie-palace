
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { getAllUserPosts, deletePost } from "@/utils/postStorage";
import { ExtendedPost } from "@/types/marketplace";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "@/components/navigation/MobileNav";
import { Navbar } from "@/components/Navbar";
import UserProfileHeader from "@/components/UserProfileHeader";
import { ProfilePostsGrid } from "@/components/profile/ProfilePostsGrid";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import { isAuthenticated, getCurrentUser } from "@/utils/auth/authState";
import Footer from "@/components/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Grid3X3, BookMarked, ShoppingBag } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState<ExtendedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const isClerkConfigured = localStorage.getItem('usingClerk') === 'true';
  
  // Use Clerk's hooks if configured
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = 
    isClerkConfigured ? useUser() : { user: null, isLoaded: true, isSignedIn: false };
  
  // Use the post dialog properly 
  const { openPostDialog } = usePostDialog();

  // Check authentication status
  const isAuthenticated = isClerkConfigured ? isSignedIn : !!localStorage.getItem('currentUserId');

  // Only fetch posts when user is authenticated
  useEffect(() => {
    let isMounted = true;
    
    const fetchUserPosts = async () => {
      setIsLoading(true);
      
      // Get user ID based on authentication method
      let userId;
      if (isClerkConfigured && clerkUser) {
        userId = clerkUser.id;
      } else {
        userId = localStorage.getItem('currentUserId');
      }
      
      if (!userId) {
        if (isClerkConfigured) {
          if (isClerkLoaded && !isSignedIn) {
            navigate('/sign-in');
          }
        } else {
          navigate('/sign-in');
        }
        return;
      }
      
      try {
        const posts = await getAllUserPosts(userId);
        if (isMounted) {
          setUserPosts(posts);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Wait for Clerk to load if using it
    if (isClerkConfigured) {
      if (isClerkLoaded) {
        fetchUserPosts();
      }
    } else {
      fetchUserPosts();
    }
    
    return () => {
      isMounted = false;
    };
  }, [isClerkConfigured, clerkUser, isClerkLoaded, isSignedIn, navigate]);

  const handlePostClick = (post: ExtendedPost) => {
    openPostDialog(post);
  };
  
  // Handle post deletion
  const handleDeletePost = async (postId: string) => {
    try {
      const result = await deletePost(postId);
      
      if (result.success) {
        // Remove from local state
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

  // Show loading state while checking authentication
  if ((isClerkConfigured && !isClerkLoaded) || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Get user data based on authentication method
  let userData = null;
  let username = '';
  let bio = '';
  let interests: string[] = [];
  
  if (isClerkConfigured && clerkUser) {
    username = clerkUser.username || '';
    bio = clerkUser.unsafeMetadata?.bio as string || "Hi! I'm a passionate plushie collector. Always looking to connect with fellow plushie enthusiasts!";
    interests = clerkUser.unsafeMetadata?.plushieInterests as string[] || ["Jellycat", "Squishmallows", "Build-A-Bear"];
  } else {
    // Use localStorage for non-Clerk
    const currentUser = getCurrentUser();
    username = currentUser?.username || '';
    
    // Try to get profile data from localStorage
    try {
      const userProfile = localStorage.getItem('userProfile');
      if (userProfile) {
        const parsedProfile = JSON.parse(userProfile);
        bio = parsedProfile.bio || "Hi! I'm a passionate plushie collector. Always looking to connect with fellow plushie enthusiasts!";
        interests = parsedProfile.interests || ["Jellycat", "Squishmallows", "Build-A-Bear"];
      }
    } catch (error) {
      console.error("Error parsing user profile:", error);
    }
  }
  
  // Extract profile data for consistency
  const profileData = {
    bio: bio,
    interests: interests,
    isPrivate: false,
  };
  
  // Filter posts by type
  const regularPosts = userPosts.filter(post => !post.forSale);
  const salesPosts = userPosts.filter(post => post.forSale === true);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <div className="flex-grow">
        <UserProfileHeader
          username={username}
          isOwnProfile={true}
          profileData={profileData}
        />

        <div className="container mx-auto px-4 py-4 mb-16">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-4">
              <TabsTrigger value="posts" className="flex items-center">
                <Grid3X3 className="h-4 w-4 mr-2" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="collections" className="flex items-center">
                <BookMarked className="h-4 w-4 mr-2" />
                Collections
              </TabsTrigger>
              <TabsTrigger value="sales" className="flex items-center">
                <ShoppingBag className="h-4 w-4 mr-2" />
                For Sale
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <ProfilePostsGrid 
                  posts={regularPosts} 
                  onPostClick={handlePostClick} 
                  onDeletePost={handleDeletePost}
                  isOwnProfile={true}
                  showCreateButton={true}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="collections">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="text-center py-16">
                  <h3 className="text-lg font-medium">Collection Coming Soon</h3>
                  <p className="text-gray-500 mt-2">
                    This feature will be available in a future update.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sales">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <ProfilePostsGrid 
                  posts={salesPosts} 
                  onPostClick={handlePostClick} 
                  onDeletePost={handleDeletePost}
                  isOwnProfile={true}
                  showCreateButton={false}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
