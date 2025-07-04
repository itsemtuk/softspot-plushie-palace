
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, MessageSquare, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExtendedPost } from "@/types/core";
import MainLayout from "@/components/layout/MainLayout";
import UserProfileHeader from "@/components/UserProfileHeader";
import { ProfilePostsGrid } from "@/components/profile/ProfilePostsGrid";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { getPosts } from "@/utils/postStorage";
import { toast } from "@/components/ui/use-toast";
import { UserProfile } from "@/types/user";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/integrations/supabase/client";
import { PostCreationData } from "@/types/core";
import { addPost } from "@/utils/posts/postManagement";

const UserProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState<ExtendedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const { openPostDialog } = usePostDialog();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) return;
      
      setIsLoading(true);
      try {
        // Fetch user data from Supabase
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .maybeSingle();

        if (user) {
          setUserData(user);

          // Fetch profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_uuid', user.id)
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
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (posts) {
            const formattedPosts: ExtendedPost[] = posts.map(post => ({
              ...post,
              userId: post.user_id,
              user_id: post.user_id,
              username: user.username || user.first_name || 'User',
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
            setUserPosts(formattedPosts);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user profile. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const handlePostClick = (post: ExtendedPost) => {
    openPostDialog(post);
  };

  const handlePostCreated = async (postData: PostCreationData) => {
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
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!userData) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            User not found
          </h2>
          <Button onClick={() => navigate('/users')}>
            Browse Users
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout includeFooter={true}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <UserProfileHeader
          username={userData.username || userData.first_name || 'User'}
          isOwnProfile={false}
          profileData={profileData}
          userId={userData.id}
        />

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="bg-white shadow-sm mb-6 rounded-full w-full flex justify-center p-1">
            <TabsTrigger value="posts" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
              Posts ({userPosts.length})
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
              Market
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
              Badges
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <Card className="overflow-hidden bg-transparent shadow-none">
              {userPosts.length > 0 || true ? (
                <ProfilePostsGrid
                  posts={userPosts}
                  onPostClick={handlePostClick}
                  isOwnProfile={false}
                  showCreateButton={false}
                  onPostCreated={handlePostCreated}
                />
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Posts Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    This user hasn't shared any posts yet.
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="market">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Marketplace Items
                </h3>
                <span className="text-sm text-gray-500">0 items for sale</span>
              </div>
              
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No items for sale
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  {userData.username || userData.first_name} hasn't listed any items for sale yet.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Reviews & Ratings
              </h3>
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No reviews available for this user yet.
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="badges">
            <Card className="shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Achievement Badges
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                No badges earned yet
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card className="shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                About {userData.username || userData.first_name}
              </h3>
              <div className="space-y-4">
                {profileData?.bio ? (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Bio</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{profileData.bio}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    This user hasn't added a bio yet.
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
                  <h4 className="font-medium text-gray-900 dark:text-white">Member Since</h4>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">2024</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default UserProfilePage;
