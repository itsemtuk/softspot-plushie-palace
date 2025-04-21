
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlushieCard } from "@/components/PlushieCard";
import { PlusCircle, Settings, Edit2, ImagePlus } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { PostCreationData } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";
import PostCreationFlow from "@/components/post/PostCreationFlow";

// Extended post type for consistency with Feed.tsx
interface ExtendedPost {
  id: string;
  image: string;
  title: string;
  username: string;
  likes: number;
  comments: number;
  description?: string;
  tags?: string[];
  timestamp?: string;
}

const Profile = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [userPosts, setUserPosts] = useState<ExtendedPost[]>([]);

  // Get profile data and user posts once user is loaded
  useEffect(() => {
    if (user) {
      // Get the profile picture from metadata
      const userProfilePicture = user.unsafeMetadata?.profilePicture as string;
      setProfileImage(userProfilePicture || user.imageUrl);
      
      // Load user posts from localStorage
      const storedPosts = localStorage.getItem('userPosts');
      if (storedPosts) {
        setUserPosts(JSON.parse(storedPosts));
      }
    }
  }, [user]);

  const handleCreatePost = (postData: PostCreationData) => {
    const username = user?.username || user?.firstName || "Anonymous";
    
    // Create new post with user data
    const newPost: ExtendedPost = {
      id: `post-${Date.now()}`,
      image: postData.image,
      title: postData.title,
      username: username as string,
      likes: 0,
      comments: 0,
      description: postData.description,
      tags: postData.tags || [],
      timestamp: new Date().toISOString(),
    };
    
    // Add new post to user posts
    const updatedPosts = [newPost, ...userPosts];
    setUserPosts(updatedPosts);
    
    // Store user's posts in localStorage
    const storedPosts = localStorage.getItem('userPosts');
    const existingUserPosts = storedPosts ? JSON.parse(storedPosts) : [];
    const updatedUserPosts = [newPost, ...existingUserPosts];
    localStorage.setItem('userPosts', JSON.stringify(updatedUserPosts));
    
    toast({
      title: "Post created successfully!",
      description: "Your post is now visible in your profile and feed."
    });
    
    // Close the dialog
    setIsPostDialogOpen(false);
  };

  // Display user's plushie interests (from metadata or default)
  const plushieInterests = user?.unsafeMetadata?.plushieInterests as string[] || ["Teddy Bears", "Unicorns", "Vintage"];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="bg-gradient-to-b from-softspot-100 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="w-28 h-28 bg-softspot-200 rounded-full overflow-hidden border-4 border-white">
                <img 
                  src={profileImage || "https://i.pravatar.cc/300"} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://i.pravatar.cc/300";
                  }}
                />
              </div>
            </div>
            
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-2xl font-bold text-gray-900">{user?.firstName || "Plushie Lover"}</h1>
              <p className="text-gray-500">@{user?.username || "plushielover"}</p>
              <p className="mt-2 text-gray-700 max-w-2xl">
                {user?.unsafeMetadata?.bio as string || "Passionate plushie collector for over 10 years. I love cute and cuddly friends of all kinds!"}
              </p>
              
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                {plushieInterests.map((interest, index) => (
                  <Badge key={index} variant="outline" className="bg-softspot-50 hover:bg-softspot-100 text-softspot-600 border-softspot-200">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="text-softspot-500 border-softspot-200"
                onClick={() => navigate('/settings')}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                className="text-gray-500 border-gray-200"
                onClick={() => navigate('/settings?tab=account')}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center mt-6 border-b">
            <div className="flex space-x-8">
              <div className="text-center px-4 py-2 border-b-2 border-softspot-500">
                <span className="block font-medium text-softspot-500">{userPosts.length || 0}</span>
                <span className="text-xs text-gray-500">Posts</span>
              </div>
              <div className="text-center px-4 py-2">
                <span className="block font-medium">1.2k</span>
                <span className="text-xs text-gray-500">Followers</span>
              </div>
              <div className="text-center px-4 py-2">
                <span className="block font-medium">450</span>
                <span className="text-xs text-gray-500">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
            
            {userPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {userPosts.map((post) => (
                  <div 
                    key={post.id} 
                    className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => navigate('/feed')} // Navigate to feed when clicking on a post
                  >
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex flex-col justify-end p-4 transition-all duration-300">
                      <h3 className="text-white font-medium opacity-0 hover:opacity-100">{post.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <div className="flex justify-center">
                    <ImagePlus className="h-12 w-12 text-softspot-300" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No posts yet</h3>
                  <p className="mt-2 text-gray-500">Create your first post to share with the community.</p>
                  <Button 
                    className="mt-4 bg-softspot-400 hover:bg-softspot-500 text-white"
                    onClick={() => setIsPostDialogOpen(true)}
                  >
                    Create Post
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="listings">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">My Listings</h2>
              <Button className="bg-softspot-400 hover:bg-softspot-500 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Listing
              </Button>
            </div>
            
            <div className="py-12 text-center">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="flex justify-center">
                  <ImagePlus className="h-12 w-12 text-softspot-300" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No listings yet</h3>
                <p className="mt-2 text-gray-500">Create your first listing to sell or trade.</p>
                <Button className="mt-4 bg-softspot-400 hover:bg-softspot-500 text-white">
                  Create Listing
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="liked-posts">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Liked Posts</h2>
            </div>
            
            <div className="py-12 text-center">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="flex justify-center">
                  <ImagePlus className="h-12 w-12 text-softspot-300" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No liked posts yet</h3>
                <p className="mt-2 text-gray-500">Like some posts to see them here.</p>
                <Button 
                  className="mt-4 bg-softspot-400 hover:bg-softspot-500 text-white"
                  onClick={() => navigate('/feed')}
                >
                  Browse Feed
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="liked-items">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Liked Marketplace Items</h2>
            
            <div className="py-12 text-center">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="flex justify-center">
                  <ImagePlus className="h-12 w-12 text-softspot-300" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No liked items yet</h3>
                <p className="mt-2 text-gray-500">Like some marketplace items to see them here.</p>
                <Button 
                  className="mt-4 bg-softspot-400 hover:bg-softspot-500 text-white"
                  onClick={() => navigate('/marketplace')}
                >
                  Browse Marketplace
                </Button>
              </div>
            </div>
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
