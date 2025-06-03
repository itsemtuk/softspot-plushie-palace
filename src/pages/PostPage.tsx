
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { PostDialog } from "@/components/PostDialog";
import { ExtendedPost } from "@/types/core";
import { getPosts } from "@/utils/postStorage";

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<ExtendedPost | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        const posts = await getPosts();
        const foundPost = posts.find(p => p.id === id);
        setPost(foundPost || null);
      }
    };
    fetchPost();
  }, [id]);

  const handleClose = () => {
    setIsOpen(false);
    // Navigate back or handle close as needed
  };

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
