import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExtendedPost } from "@/types/core";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { getAllPosts } from "@/utils/postStorage";
import MainLayout from "@/components/layout/MainLayout";
import { PostDialog } from "@/components/PostDialog";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";

const PostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<ExtendedPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { openPostDialog } = usePostDialog();

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const allPosts = await getAllPosts();
        const foundPost = allPosts.find((p) => p.id === postId) || null;
        setPost(foundPost);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load the post. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleBackClick = () => {
    navigate(-1);
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

  if (!post) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="text-center">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Post Not Found</h2>
              <p className="text-gray-500">
                The post you are looking for does not exist or has been deleted.
              </p>
              <Button onClick={handleBackClick} className="mt-4">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <Button onClick={handleBackClick} variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="overflow-hidden">
          <AspectRatio ratio={16 / 9}>
            <img
              src={post.image}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            <p className="text-gray-500 mb-4">
              Posted by {post.username} on {post.timestamp}
            </p>
            <p className="text-gray-700">{post.description}</p>
            <div className="flex items-center mt-4">
              <Button variant="ghost" size="sm" className="mr-2">
                <Heart className="mr-2 h-4 w-4" />
                {post.likes} Likes
              </Button>
              <Button variant="ghost" size="sm" className="mr-2">
                <MessageCircle className="mr-2 h-4 w-4" />
                {post.comments} Comments
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <PostDialog />
    </MainLayout>
  );
};

export default PostPage;
