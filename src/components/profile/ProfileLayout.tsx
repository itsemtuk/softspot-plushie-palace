
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
  const isClerkConfigured = localStorage.getItem('usingClerk') === 'true';
  
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = 
    isClerkConfigured ? useUser() : { user: null, isLoaded: true, isSignedIn: false };
  
  const { openPostDialog } = usePostDialog();
  const userIsAuthenticated = isClerkConfigured ? isSignedIn : !!localStorage.getItem('currentUserId');

  useEffect(() => {
    let isMounted = true;
    
    const fetchUserPosts = async () => {
      setIsLoading(true);
      
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
        const posts = await getPosts();
        if (isMounted) {
          setUserPosts(posts);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your posts. Please try again.",
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

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

  if ((isClerkConfigured && !isClerkLoaded) || isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  let userData = null;
  let username = '';
  let bio = '';
  let interests: string[] = [];
  
  if (isClerkConfigured && clerkUser) {
    username = clerkUser.username || '';
    bio = clerkUser.unsafeMetadata?.bio as string || "Hi! I'm a passionate plushie collector. Always looking to connect with fellow plushie enthusiasts!";
    interests = clerkUser.unsafeMetadata?.plushieInterests as string[] || ["Jellycat", "Squishmallows", "Build-A-Bear"];
  } else {
    const currentUser = getCurrentUser();
    username = currentUser?.username || '';
    
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
              <TabsList className="bg-white shadow-sm mb-6 rounded-full w-full flex justify-center p-1">
                <TabsTrigger 
                  value="posts" 
                  className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none"
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  <span>Posts</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="collections" 
                  className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none"
                >
                  <BookMarked className="h-4 w-4 mr-2" />
                  <span>Collections</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="sales" 
                  className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none"
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
                <Card className="shadow-sm">
                  <div className="text-center py-16">
                    <h3 className="text-lg font-medium">Collection Coming Soon</h3>
                    <p className="text-gray-500 mt-2">
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
