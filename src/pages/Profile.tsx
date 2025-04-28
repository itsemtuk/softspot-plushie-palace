
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ExtendedPost } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";
import { getUserPosts } from "@/utils/postStorage";
import { useUser } from "@clerk/clerk-react";
import { Spinner } from "@/components/ui/spinner";
import { ProfileStats } from "@/components/profile/ProfileStats";
import NotificationsTab from "@/components/profile/NotificationsTab";
import { WishlistManager } from "@/components/profile/WishlistManager";
import { ProfilePostsGrid } from "@/components/profile/ProfilePostsGrid";
import UserProfileHeader from "@/components/UserProfileHeader";
import { PostDialog } from "@/components/PostDialog";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";

const Profile = () => {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<ExtendedPost | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const loadUserPosts = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const fetchedPosts = await getUserPosts(user.id);
      console.log("Fetched user posts:", fetchedPosts);
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
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <UserProfileHeader
        username={user?.username || undefined}
        isOwnProfile={!!user}
        profileData={profileData}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileStats postsCount={posts.length} />
        
        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("posts")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "posts"
                    ? "border-softspot-500 text-softspot-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "notifications"
                    ? "border-softspot-500 text-softspot-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "wishlist"
                    ? "border-softspot-500 text-softspot-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Wishlist
              </button>
            </nav>
          </div>
          
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
        </div>
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
