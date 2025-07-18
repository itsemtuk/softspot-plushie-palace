
import MainLayout from "@/components/layout/MainLayout";
import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { TabsContent } from "@/components/ui/tabs";
import { ProfilePostsGrid } from "@/components/profile/ProfilePostsGrid";
import { useState } from "react";
import { ExtendedPost, PostCreationData } from "@/types/core";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { addPost } from "@/utils/posts/postManagement";
import { toast } from "@/hooks/use-toast";
import UserProfileHeader from "@/components/UserProfileHeader";
import MarketplaceReviews from "@/components/profile/MarketplaceReviews";
import { ProfileBadges } from "@/components/profile/ProfileBadges";
import { Star, User, Heart, MessageSquare } from "lucide-react";
import { EditMarketplaceItem } from "@/components/marketplace/EditMarketplaceItem";
import { useUserData } from "@/hooks/useUserData";
import { useUserPosts } from "@/hooks/useUserPosts";

const Profile = () => {
  console.log("Profile page: Rendering");
  const { user } = useUser();
  const { userData, profileData, isLoading } = useUserData();
  const { posts: userPosts, marketplacePosts, archivedPosts, setPosts, setMarketplacePosts } = useUserPosts(userData?.id);
  const { openPostDialog } = usePostDialog();

  // State for editing marketplace item
  const [editingMarketplaceItem, setEditingMarketplaceItem] = useState<ExtendedPost | null>(null);
  const [isEditMarketplaceModalOpen, setIsEditMarketplaceModalOpen] = useState(false);

  // Mock badges data
  const userBadges = [
    {
      id: "profile-photo",
      name: "Profile Photo",
      image: "/assets/Badges/Changed_Profile_Photo.PNG",
      description: "Added a profile photo"
    },
    {
      id: "completed-profile",
      name: "Complete Profile",
      image: "/assets/Badges/Completed_Profile.PNG",
      description: "Completed profile setup"
    },
    {
      id: "first-post",
      name: "First Post",
      image: "/assets/Badges/First_Post.PNG",
      description: "Created your first post"
    }
  ];

  // Mock reviews data
  const mockReviews = [
    {
      id: "1",
      reviewer: "PlushieLover92",
      rating: 5,
      comment: "Great seller! Item was exactly as described and shipped quickly.",
      date: "2 weeks ago",
      item: "Jellycat Bunny"
    },
    {
      id: "2", 
      reviewer: "CuddleCollector",
      rating: 4,
      comment: "Very responsive and helpful. Would buy again!",
      date: "1 month ago",
      item: "Squishmallow Set"
    }
  ];

  // Remove the useEffect - data fetching is now handled by hooks

  // Handler for regular post click
  const handlePostClick = (post: ExtendedPost) => {
    openPostDialog(post);
  };

  // Handler for marketplace item click (edit if owner)
  const handleMarketplaceItemClick = (item: ExtendedPost) => {
    if (user && (item.user_id === user.id || item.userId === user.id)) {
      setEditingMarketplaceItem(item);
      setIsEditMarketplaceModalOpen(true);
    }
  };

  // Handler for updating item in state after edit
  const handleMarketplaceItemUpdate = (updatedItem: ExtendedPost) => {
    setMarketplacePosts((prev) => prev.map((item) => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleRegularPostCreated = async (postData: PostCreationData) => {
    if (!userData) return;
    
    try {
      const newPost: ExtendedPost = {
        ...postData,
        id: `post-${Date.now()}`,
        userId: userData.id,
        user_id: userData.id,
        username: userData.username || userData.first_name || 'User',
        likes: 0,
        comments: 0,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        location: '',
        forSale: false,
        tags: [],
        sold: false
      };

      const result = await addPost(newPost);
      if (result.success) {
        setPosts(prevPosts => [newPost, ...prevPosts]);
        toast({
          title: "Post created!",
          description: "Your post has been added successfully.",
        });
      }
    } catch (error) {
      console.error("Error creating regular post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again.",
      });
    }
  };

  const handleMarketplacePostCreated = async (postData: PostCreationData) => {
    if (!userData) return;
    
    try {
      const newPost: ExtendedPost = {
        ...postData,
        id: `post-${Date.now()}`,
        userId: userData.id,
        user_id: userData.id,
        username: userData.username || userData.first_name || 'User',
        likes: 0,
        comments: 0,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        location: '',
        forSale: true,
        tags: [],
        sold: false
      };

      const result = await addPost(newPost);
      if (result.success) {
        setMarketplacePosts(prevPosts => [newPost, ...prevPosts]);
        toast({
          title: "Marketplace item listed!",
          description: "Your item has been added to the marketplace.",
        });
      }
    } catch (error) {
      console.error("Error creating marketplace post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to list item. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <UserProfileHeader
          username={userData?.username || userData?.first_name || user?.username || 'User'}
          isOwnProfile={true}
          profileData={profileData}
          userId={userData?.id}
        />

        <ProfileLayout>
          <TabsContent value="posts" className="mt-6">
            <ProfilePostsGrid
              posts={userPosts}
                onPostClick={handlePostClick}
                isOwnProfile={true}
                showCreateButton={true}
                onPostCreated={handleRegularPostCreated}
              />
            </TabsContent>
            
            <TabsContent value="marketplace" className="mt-6">
              <ProfilePostsGrid
                posts={marketplacePosts}
                onPostClick={handleMarketplaceItemClick}
                isOwnProfile={true}
                showCreateButton={false}
                onPostCreated={handleMarketplacePostCreated}
              />
            {/* Edit Marketplace Item Modal */}
            {editingMarketplaceItem && (
              <EditMarketplaceItem
                post={editingMarketplaceItem}
                isOpen={isEditMarketplaceModalOpen}
                onClose={() => {
                  setIsEditMarketplaceModalOpen(false);
                  setEditingMarketplaceItem(null);
                }}
                onUpdate={handleMarketplaceItemUpdate}
              />
            )}
          </TabsContent>
          
          <TabsContent value="about" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  About You
                </h3>
                <div className="space-y-4">
                  {profileData?.bio ? (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Bio</h4>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{profileData.bio}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      Add a bio in your profile settings to tell others about yourself.
                    </p>
                  )}
                  
                  {profileData?.interests && profileData.interests.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Favorite Brands</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profileData.interests.map((interest: string, index: number) => (
                          <Badge key={index} variant="secondary">{interest}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Stats</h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{userPosts.length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{marketplacePosts.length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Marketplace Items</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="mt-6">
            <ProfileBadges badges={userBadges} />
          </TabsContent>

          <TabsContent value="archived" className="mt-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">Archived Posts</h3>
                <ProfilePostsGrid posts={archivedPosts} onPostClick={handlePostClick} isOwnProfile={true} />
                {archivedPosts.length === 0 && !isLoading && (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No archived posts yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Marketplace Reviews
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium ml-1">4.8</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({mockReviews.length} reviews)
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{review.reviewer}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-1">{review.comment}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Item: {review.item}</p>
                    </div>
                  ))}
                  
                  {mockReviews.length === 0 && (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">No reviews yet</h4>
                      <p className="text-gray-500 dark:text-gray-400">
                        Start selling items to receive reviews from buyers.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </ProfileLayout>
      </div>
    </MainLayout>
  );
};

export default Profile;
