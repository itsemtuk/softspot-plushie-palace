
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

const UserProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [userPosts, setUserP osts] = useState<ExtendedPost[]>([]);
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
    <MainLayout noPadding>
      <div className="flex-grow">
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
              <TabsTrigger value="about" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
                About
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <Card className="overflow-hidden bg-transparent shadow-none">
                {userPosts.length > 0 ? (
                  <ProfilePostsGrid
                    posts={userPosts}
                    onPostClick={handlePostClick}
                    isOwnProfile={false}
                    showCreateButton={false}
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
      </div>
    </MainLayout>
  );
};

export default UserProfilePage;
