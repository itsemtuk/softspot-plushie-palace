
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { MobileNav } from "@/components/navigation/MobileNav";
import { Navbar } from "@/components/Navbar";
import UserProfileHeader from "@/components/UserProfileHeader";
import { ProfilePostsGrid } from "@/components/profile/ProfilePostsGrid";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import Footer from "@/components/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Grid3X3 } from "lucide-react";
import { getAllUserPosts } from "@/utils/postStorage";
import { ExtendedPost } from "@/types/marketplace";
import { useIsMobile } from "@/hooks/use-mobile";

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user: currentUser, isLoaded } = useUser();
  const [userPosts, setUserPosts] = useState<ExtendedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<{
    username: string,
    bio: string,
    interests: string[],
    isPrivate: boolean
  }>({
    username: '',
    bio: '',
    interests: [],
    isPrivate: false
  });
  
  const isMobile = useIsMobile();
  const { openPostDialog } = usePostDialog();
  
  // Determine if this is the current user's profile
  const isOwnProfile = currentUser?.id === userId;
  
  // If it's the current user's profile, redirect to /profile
  useEffect(() => {
    if (isLoaded && currentUser && isOwnProfile) {
      navigate('/profile');
    }
  }, [currentUser, isLoaded, isOwnProfile, navigate]);
  
  // Fetch posts and profile data for the requested user
  useEffect(() => {
    let isMounted = true;
    
    const fetchUserData = async () => {
      setIsLoading(true);
      
      if (!userId) return;
      
      try {
        // In a real app with a backend, you would fetch user data from an API
        // For now, we'll simulate this with existing functions
        const posts = await getAllUserPosts(userId);
        
        // Fetch user profile data (this would normally be a separate API call)
        // For now we'll use placeholder data
        const userData = {
          username: posts[0]?.username || 'User',
          bio: "This user hasn't added a bio yet.",
          interests: ["Plushies"],
          isPrivate: false
        };
        
        if (isMounted) {
          setUserPosts(posts);
          setProfileData(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user profile. Please try again."
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchUserData();
    
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handlePostClick = (post: ExtendedPost) => {
    openPostDialog(post);
  };
  
  // Handle post deletion (only for own posts, which shouldn't happen on this page)
  const handleDeletePost = async (postId: string) => {
    // This should never be called on other users' profiles
    console.warn("Delete post attempted on another user's profile");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Filter posts by type
  const regularPosts = userPosts.filter(post => !post.forSale);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <div className="flex-grow">
        <UserProfileHeader
          username={profileData.username}
          isOwnProfile={false}
          profileData={profileData}
        />

        <div className="container mx-auto px-4 py-4 mb-16">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="posts" className="flex items-center flex-1">
                <Grid3X3 className="h-4 w-4 mr-2" />
                Posts
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <ProfilePostsGrid 
                  posts={regularPosts} 
                  onPostClick={handlePostClick} 
                  onDeletePost={handleDeletePost}
                  isOwnProfile={false}
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

export default UserProfile;
