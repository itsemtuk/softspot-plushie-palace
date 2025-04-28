
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings } from 'lucide-react';
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/post/PostCard";
import { getAllUserPosts } from "@/utils/postStorage";
import { ExtendedPost } from "@/types/marketplace";
import NotificationsTab from "@/components/profile/NotificationsTab";

const Profile = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState<ExtendedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <Button onClick={() => navigate('/settings')}><Settings className="mr-2 h-4 w-4" /> Settings</Button>
        </div>

        <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.imageUrl} alt={user.username || "Avatar"} />
                <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{user.firstName} {user.lastName}</h2>
                <p className="text-gray-500">@{user.username}</p>
                <p className="text-gray-600 mt-2">{user.emailAddresses[0].emailAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="posts" className="mt-8">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-4">
            {isLoading ? (
              <div className="text-center py-12">Loading posts...</div>
            ) : userPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">No posts yet.</div>
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
