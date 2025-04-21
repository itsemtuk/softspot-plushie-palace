
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlushieCard } from "@/components/PlushieCard";
import { feedPosts, marketplacePlushies } from "@/data/plushies";
import { PlusCircle, Settings, Edit2, Heart, Store, Tag } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { PostCreationData } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";

const Profile = () => {
  // Filter posts to show only user's posts (for demo, showing first 3)
  const userPosts = feedPosts.slice(0, 3); 
  const userListings = marketplacePlushies.slice(0, 2);
  const userLikedPosts = feedPosts.slice(3, 6); // Dedicated liked posts
  const userLikedItems = marketplacePlushies.slice(2, 5);
  
  const { user } = useUser();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);

  // Get profile data once user is loaded
  useEffect(() => {
    if (user) {
      // Get the profile picture from metadata
      const userProfilePicture = user.unsafeMetadata?.profilePicture as string;
      setProfileImage(userProfilePicture || user.imageUrl);
    }
  }, [user]);

  const handleCreatePost = (postData: PostCreationData) => {
    console.log("New post created:", postData);
    toast({
      title: "Post created successfully!",
      description: "Your post is now visible in your profile and feed."
    });
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
                <span className="block font-medium text-softspot-500">128</span>
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
                  <PlushieCard 
                    key={post.id}
                    id={post.id}
                    image={post.image}
                    title={post.title}
                    username={post.username}
                    likes={post.likes}
                    comments={post.comments}
                    variant="feed"
                  />
                ))}
              </div>
            ) : null}
          </TabsContent>
          
          <TabsContent value="listings">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">My Listings</h2>
              <Button className="bg-softspot-400 hover:bg-softspot-500 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Listing
              </Button>
            </div>
            
            {userListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {userListings.map((listing) => (
                  <PlushieCard 
                    key={listing.id}
                    id={listing.id}
                    image={listing.image}
                    title={listing.title}
                    username={listing.username}
                    likes={listing.likes}
                    comments={listing.comments}
                    price={listing.price}
                    forSale={listing.forSale}
                    variant="marketplace"
                  />
                ))}
              </div>
            ) : null}
          </TabsContent>
          
          {/* Liked Posts Tab */}
          <TabsContent value="liked-posts">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Liked Posts</h2>
            </div>
            
            {userLikedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {userLikedPosts.map((post) => (
                  <PlushieCard 
                    key={post.id}
                    id={post.id}
                    image={post.image}
                    title={post.title}
                    username={post.username}
                    likes={post.likes}
                    comments={post.comments}
                    variant="feed"
                  />
                ))}
              </div>
            ) : null}
          </TabsContent>
          
          <TabsContent value="liked-items">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Liked Marketplace Items</h2>
            
            {userLikedItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {userLikedItems.map((item) => (
                  <PlushieCard 
                    key={item.id}
                    id={item.id}
                    image={item.image}
                    title={item.title}
                    username={item.username}
                    likes={item.likes}
                    comments={item.comments}
                    price={item.price}
                    forSale={item.forSale}
                    variant="marketplace"
                  />
                ))}
              </div>
            ) : null}
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

