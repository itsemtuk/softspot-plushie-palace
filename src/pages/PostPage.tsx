
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { PostDialog } from "@/components/PostDialog";
import { ExtendedPost } from "@/types/core";
import { getPosts } from "@/utils/postStorage";

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<ExtendedPost | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const posts = await getPosts();
          const foundPost = posts.find(p => p.id === id);
          setPost(foundPost || null);
        } catch (error) {
          console.error("Error fetching post:", error);
          setPost(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleClose = () => {
    setIsOpen(false);
    navigate(-1); // Go back to previous page
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading post...</div>
        </div>
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Post not found</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PostDialog 
        post={post} 
        isOpen={isOpen}
        onClose={handleClose}
      />
    </MainLayout>
  );
};

export default PostPage;
