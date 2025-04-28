
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllUserPosts } from "@/utils/postStorage";
import { ExtendedPost } from "@/types/marketplace";
import NotificationsTab from "@/components/profile/NotificationsTab";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "@/components/navigation/MobileNav";
import { Navbar } from "@/components/Navbar";
import UserProfileHeader from "@/components/UserProfileHeader";
import { ProfilePostsGrid } from "@/components/profile/ProfilePostsGrid";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { Spinner } from "@/components/ui/spinner";

const Profile = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState<ExtendedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  // Use the post dialog properly 
  const { openPostDialog } = usePostDialog();

  useEffect(() => {
    const fetchUserPosts = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const posts = await getAllUserPosts(user.id);
          setUserPosts(posts);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  const handlePostClick = (post: ExtendedPost) => {
    // Call the imported openPostDialog function
    openPostDialog(post);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Extract profile data from user metadata for consistency
  const profileData = {
    bio: user.unsafeMetadata?.bio as string,
    interests: user.unsafeMetadata?.interests as string[],
    isPrivate: user.unsafeMetadata?.isPrivate as boolean,
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {isMobile ? <MobileNav /> : <Navbar />}
      
      {/* Use the UserProfileHeader component for consistent design */}
      <UserProfileHeader
        username={user.username || undefined}
        isOwnProfile={true}
        profileData={profileData}
      />

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="posts" className="mt-4">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-4">
            {isLoading ? (
              <div className="text-center py-12">
                <Spinner size="lg" className="mx-auto" />
                <p className="mt-4 text-gray-500">Loading posts...</p>
              </div>
            ) : (
              <ProfilePostsGrid 
                posts={userPosts} 
                onPostClick={handlePostClick} 
                isOwnProfile={true} 
              />
            )}
          </TabsContent>
          <TabsContent value="notifications" className="mt-4">
            <NotificationsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
