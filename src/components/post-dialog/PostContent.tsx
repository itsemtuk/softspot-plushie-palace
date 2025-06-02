
import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PostCommentForm } from "./PostCommentForm";
import { ExtendedPost, Comment } from "@/types/core";
import { useUser } from "@clerk/clerk-react";
import { usePostActions } from "@/hooks/usePostActions";
import { useOfflinePostOperations } from "@/hooks/useOfflinePostOperations";

interface PostContentProps {
  post: ExtendedPost;
  onClose: () => void;
  onPostEdited: (editedPost: ExtendedPost) => void;
  onPostDeleted: (postId: string) => void;
}

export const PostContent = ({ post, onClose, onPostEdited, onPostDeleted }: PostContentProps) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useUser();
  const { handleEditPost, handleDeletePost } = usePostActions();
  const { addOfflinePost } = useOfflinePostOperations();

  useEffect(() => {
    // Mock comments for demonstration
    const mockComments: Comment[] = [
      {
        id: "comment-1",
        postId: post.id,
        userId: "user-1",
        username: "JohnDoe",
        content: "Great post!",
        likes: 5,
        timestamp: new Date().toISOString(),
      },
      {
        id: "comment-2",
        postId: post.id,
        userId: "user-2",
        username: "JaneSmith",
        content: "I agree!",
        likes: 2,
        timestamp: new Date().toISOString(),
      },
    ];
    setComments(mockComments);
  }, [post.id]);

  const handleCommentSubmit = (commentText: string) => {
    if (commentText.trim() === "") return;

    if (!user) {
      console.error("User is not authenticated.");
      return;
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId: post.id,
      userId: user.id,
      username: user.username || "Anonymous",
      content: commentText,
      likes: 0,
      timestamp: new Date().toISOString(),
    };

    setComments((prevComments) => [...prevComments, newComment]);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const editPost = () => {
    setIsEditing(true);
  };

  const deletePost = async () => {
    await handleDeletePost(post.id);
    onPostDeleted(post.id);
    onClose();
  };

  return (
    <div className="space-y-4">
      {/* Post Content */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <p>{post.content}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center space-x-2">
            {post.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleLike}>
            <Heart className={`h-5 w-5 ${isLiked ? "text-red-500" : ""}`} />
            <span>{post.likes}</span>
          </Button>
          <Button variant="ghost" size="icon">
            <MessageCircle className="h-5 w-5" />
            <span>{comments.length}</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={sharePost}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Edit and Delete Buttons */}
        {user?.id === post.userId && (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={editPost}>
              <Edit className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={deletePost}>
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Comment Form */}
      <PostCommentForm onSubmit={handleCommentSubmit} />

      {/* Comments List */}
      <div>
        {comments.map((comment) => (
          <div key={comment.id} className="py-2 border-b">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{comment.username}</div>
              <div className="text-sm text-gray-500">{comment.timestamp}</div>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
