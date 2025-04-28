
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Tab, Tabs } from "@/components/ui/tabs";
import { ExtendedPost } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";
import { getUserPosts } from "@/utils/postStorage";
import { useUser } from "@clerk/clerk-react";
import { Spinner } from "@/components/ui/spinner";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { NotificationsTab } from "@/components/profile/NotificationsTab";
import { WishlistManager } from "@/components/profile/WishlistManager";
import { ProfilePostsGrid } from "@/components/profile/ProfilePostsGrid";
import UserProfileHeader from "@/components/UserProfileHeader";
import { PostDialog } from "@/components/PostDialog";

const Profile = () => {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<ExtendedPost | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadUserPosts = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const fetchedPosts = await getUserPosts(user.id);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      toast({
        variant: "destructive",
        title: "Error loading posts",
        description: "Failed to load your posts. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserPosts();
    } else if (isLoaded && !user) {
      setIsLoading(false);
    }
  }, [user, isLoaded]);

  const handlePostClick = (post: ExtendedPost) => {
    setSelectedPost(post);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    // Reload posts to ensure any changes are reflected
    loadUserPosts();
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Get user metadata
  const profileData = user ? {
    bio: user.unsafeMetadata?.bio as string,
    interests: user.unsafeMetadata?.interests as string[],
    isPrivate: user.unsafeMetadata?.isPrivate as boolean,
  } : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <UserProfileHeader
        username={user?.username || undefined}
        isOwnProfile={!!user}
        profileData={profileData}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileStats postsCount={posts.length} />
        
        <Tabs className="mt-6">
          <Tab 
            isActive={activeTab === "posts"}
            onClick={() => setActiveTab("posts")}
            label="Posts"
          />
          <Tab 
            isActive={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
            label="Notifications"
          />
          <Tab 
            isActive={activeTab === "wishlist"}
            onClick={() => setActiveTab("wishlist")}
            label="Wishlist"
          />
          
          <div className="mt-6">
            {activeTab === "posts" && (
              isLoading ? (
                <div className="py-12 flex justify-center">
                  <Spinner size="lg" />
                </div>
              ) : (
                <ProfilePostsGrid 
                  posts={posts} 
                  onPostClick={handlePostClick}
                />
              )
            )}
            
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "wishlist" && <WishlistManager />}
          </div>
        </Tabs>
      </div>

      <PostDialog
        isOpen={dialogOpen}
        onClose={handleDialogClose}
        post={selectedPost}
      />
    </div>
  );
};

export default Profile;
