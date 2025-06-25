
import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { TabsContent } from "@/components/ui/tabs";
import { ProfilePostsGrid } from "@/components/profile/ProfilePostsGrid";
import { useState, useEffect } from "react";
import { ExtendedPost, PostCreationData } from "@/types/core";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { getPosts } from "@/utils/postStorage";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { addPost } from "@/utils/posts/postManagement";
import { toast } from "@/components/ui/use-toast";
import UserProfileHeader from "@/components/UserProfileHeader";
import MarketplaceReviews from "@/components/profile/MarketplaceReviews";
import { ProfileBadges } from "@/components/profile/ProfileBadges";

const Profile = () => {
  console.log("Profile page: Rendering");
  const { user } = useUser();
  const [userPosts, setUserPosts] = useState<ExtendedPost[]>([]);
  const [marketplacePosts, setMarketplacePosts] = useState<ExtendedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const { openPostDialog } = usePostDialog();

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
    }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // Fetch user data from Supabase
        const { data: supabaseUser } = await supabase
          .from('users')
          .select('*')
          .eq('clerk_id', user.id)
          .maybeSingle();

        if (supabaseUser) {
          setUserData(supabaseUser);

          // Fetch profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_uuid', supabaseUser.id)
            .maybeSingle();

          if (profile) {
            setProfileData({
              bio: profile.bio || '',
              interests: profile.favorite_brands || [],
              isPrivate: profile.is_private || false
            });
          }

          // Fetch user posts
          const { data: posts } = await supabase
            .from('posts')
            .select('*')
            .eq('user_id', supabaseUser.id)
            .order('created_at', { ascending: false });

          if (posts) {
            const formattedPosts: ExtendedPost[] = posts.map(post => ({
              ...post,
              userId: post.user_id,
              user_id: post.user_id,
              username: supabaseUser.username || supabaseUser.first_name || 'User',
              likes: 0,
              comments: 0,
              timestamp: post.created_at,
              createdAt: post.created_at,
              created_at: post.created_at,
              updatedAt: post.created_at,
              location: '',
              forSale: post.for_sale || false,
              tags: [],
              sold: false
            }));
            
            // Separate regular posts from marketplace items
            const regularPosts = formattedPosts.filter(post => !post.forSale);
            const marketplaceItems = formattedPosts.filter(post => post.forSale);
            
            setUserPosts(regularPosts);
            setMarketplacePosts(marketplaceItems);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id]);

  const handlePostClick = (post: ExtendedPost) => {
    openPostDialog(post);
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
        setUserPosts(prevPosts => [newPost, ...prevPosts]);
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-softspot-500"></div>
      </div>
    );
  }

  return (
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
            onPostClick={handlePostClick}
            isOwnProfile={true}
            showCreateButton={false}
            onPostCreated={handleMarketplacePostCreated}
          />
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
                      <div className="text-2xl font-bold text-softspot-500">{userPosts.length}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-softspot-500">{marketplacePosts.length}</div>
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

        <TabsContent value="reviews" className="mt-6">
          {userData?.id && <MarketplaceReviews userId={userData.id} />}
        </TabsContent>
      </ProfileLayout>
    </div>
  );
};

export default Profile;
