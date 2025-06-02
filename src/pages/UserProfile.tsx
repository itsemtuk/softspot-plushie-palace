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
import { getAllUserPosts } from "@/utils/postStorage";
import { toast } from "@/components/ui/use-toast";
import { UserProfile } from "@/types/user";
import { Spinner } from "@/components/ui/spinner";

const MOCK_USER_PROFILE: UserProfile = {
  id: 'user-123',
  username: 'PlushieLover',
  bio: "Hi! I'm a passionate plushie collector. Always looking to connect with fellow plushie enthusiasts!",
  interests: ["Jellycat", "Squishmallows", "Build-A-Bear"],
  isPrivate: false,
  avatar: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
  followersCount: 123,
  followingCount: 456,
  postsCount: 789,
  collectionsCount: 12,
  marketplaceListingsCount: 34,
  joinDate: '2023-01-01',
};

const MOCK_USER_POSTS: ExtendedPost[] = [
  {
    id: 'post-1',
    userId: 'user-123',
    user_id: 'user-123',
    username: 'PlushieLover',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    title: 'My Plushie Collection',
    description: 'Just added some new friends to my collection!',
    content: 'Just added some new friends to my collection!',
    tags: ['collection', 'plushies', 'cute'],
    likes: 15,
    comments: 3,
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location: 'New York, NY',
    forSale: false,
    price: 25,
    brand: 'Jellycat',
    condition: 'new',
    material: 'plush',
    filling: 'polyester',
    species: 'bear',
    deliveryMethod: 'shipping',
    deliveryCost: 5,
    size: 'medium',
    sold: false,
    color: 'brown'
  },
  {
    id: 'post-2',
    userId: 'user-123',
    user_id: 'user-123',
    username: 'PlushieLover',
    image: 'https://images.unsplash.com/photo-1560417804-4bca91490332?w=400',
    title: 'New Squishmallow Find',
    description: 'Found this adorable Squishmallow at a local store!',
    content: 'Found this adorable Squishmallow at a local store!',
    tags: ['squishmallow', 'plushies', 'cute'],
    likes: 22,
    comments: 5,
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location: 'Los Angeles, CA',
    forSale: false,
    price: 20,
    brand: 'Squishmallow',
    condition: 'new',
    material: 'plush',
    filling: 'polyester',
    species: 'cat',
    deliveryMethod: 'shipping',
    deliveryCost: 5,
    size: 'small',
    sold: false,
    color: 'pink'
  },
];

const MOCK_USER_BADGES = [
  {
    id: 'badge-1',
    name: 'Early Adopter',
    description: 'Joined the platform early on',
    icon: 'star',
    criteria: { requirement: 'Join date', value: 1, type: 'date' },
    type: 'achievement',
  },
  {
    id: 'badge-2',
    name: 'Active User',
    description: 'Posted more than 10 times',
    icon: 'message-square',
    criteria: { requirement: 'Posts', value: 10, type: 'posts' },
    type: 'milestone',
  },
];

const UserProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState<ExtendedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { openPostDialog } = usePostDialog();

  useEffect(() => {
    const fetchUserPosts = async () => {
      setIsLoading(true);
      try {
        // Simulate fetching user posts from a server
        // Replace this with your actual data fetching logic
        const posts = await getAllUserPosts('user-123');
        setUserPosts(posts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user posts. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPosts();
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

  return (
    <MainLayout noPadding>
      <div className="flex-grow">
        <UserProfileHeader
          username={username || 'PlushieLover'}
          isOwnProfile={false}
          profileData={MOCK_USER_PROFILE}
        />

        <div className="container mx-auto px-4 py-2 max-w-4xl">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="bg-white shadow-sm mb-6 rounded-full w-full flex justify-center p-1">
              <TabsTrigger value="posts" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
                Posts
              </TabsTrigger>
              <TabsTrigger value="collections" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
                Collections
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <Card className="overflow-hidden bg-transparent shadow-none">
                <ProfilePostsGrid
                  posts={userPosts}
                  onPostClick={handlePostClick}
                  isOwnProfile={false}
                  showCreateButton={false}
                />
              </Card>
            </TabsContent>

            <TabsContent value="collections">
              <Card className="shadow-sm">
                <div className="text-center py-16">
                  <h3 className="text-lg font-medium">Collection Coming Soon</h3>
                  <p className="text-gray-500 mt-2">
                    This feature will be available in a future update.
                  </p>
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
