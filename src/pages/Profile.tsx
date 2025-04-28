
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { PostCreationData } from "@/types/marketplace";
import { UserProfileHeader } from "@/components/UserProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfilePostsGrid } from "@/components/profile/ProfilePostsGrid";
import { EmptyContentSection } from "@/components/profile/EmptyContentSection";
import { ExtendedPost } from "@/types/marketplace";

const Profile = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [userPosts, setUserPosts] = useState<ExtendedPost[]>([]);

  useEffect(() => {
    if (user) {
      const storedPosts = localStorage.getItem('userPosts');
      if (storedPosts) {
        setUserPosts(JSON.parse(storedPosts));
      }
    }
  }, [user]);

  const handleCreatePost = async (postData: PostCreationData): Promise<void> => {
    const username = user?.username || user?.firstName || "Anonymous";
    
    const newPost: ExtendedPost = {
      id: `post-${Date.now()}`,
      userId: user?.id || "anonymous",
      image: postData.image,
      title: postData.title,
      username: username,
      likes: 0,
      comments: 0,
      description: postData.description,
      tags: postData.tags || [],
      timestamp: new Date().toISOString(),
    };
    
    const updatedPosts = [newPost, ...userPosts];
    setUserPosts(updatedPosts);
    
    localStorage.setItem('userPosts', JSON.stringify(updatedPosts));
    
    toast({
      title: "Post created successfully!",
      description: "Your post is now visible in your profile and feed."
    });
    
    setIsPostDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <UserProfileHeader 
        isOwnProfile={true}
        profileData={{
          bio: user?.unsafeMetadata?.bio as string,
          interests: user?.unsafeMetadata?.plushieInterests as string[],
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="posts">My Posts</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="liked-posts">Liked Posts</TabsTrigger>
            <TabsTrigger value="liked-items">Liked Items</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">My Posts</h2>
              <Button 
                className="bg-softspot-400 hover:bg-softspot-500 text-white"
                onClick={() => setIsPostDialogOpen(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </div>
            
            <ProfilePostsGrid 
              posts={userPosts}
              onPostClick={() => navigate('/feed')}
            />
          </TabsContent>
          
          <TabsContent value="listings">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">My Listings</h2>
              <Button className="bg-softspot-400 hover:bg-softspot-500 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Listing
              </Button>
            </div>
            
            <EmptyContentSection 
              title="No listings yet"
              description="Create your first listing to sell or trade."
              buttonText="Create Listing"
              navigateTo="/marketplace"
            />
          </TabsContent>
          
          <TabsContent value="liked-posts">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Liked Posts</h2>
            </div>
            
            <EmptyContentSection 
              title="No liked posts yet"
              description="Like some posts to see them here."
              buttonText="Browse Feed"
              navigateTo="/feed"
            />
          </TabsContent>
          
          <TabsContent value="liked-items">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Liked Marketplace Items</h2>
            
            <EmptyContentSection 
              title="No liked items yet"
              description="Like some marketplace items to see them here."
              buttonText="Browse Marketplace"
              navigateTo="/marketplace"
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <PostCreationFlow 
        isOpen={isPostDialogOpen}
        onClose={() => setIsPostDialogOpen(false)}
        onPostCreated={handleCreatePost}
      />
    </div>
  );
};

export default Profile;
