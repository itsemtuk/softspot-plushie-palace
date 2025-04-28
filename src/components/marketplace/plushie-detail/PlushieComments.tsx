
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface PlushieCommentsProps {
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
}

export function PlushieComments({ comments, setComments }: PlushieCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCommentId, setLoadingCommentId] = useState<string | null>(null);

  const handleCommentLikeToggle = async (commentId: string) => {
    try {
      setLoadingCommentId(commentId);
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked
          };
        }
        return comment;
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update like status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingCommentId(null);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      setIsSubmitting(true);
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCommentObj: Comment = {
        id: `c${Date.now()}`,
        username: "currentUser",
        text: newComment,
        timestamp: "Just now",
        likes: 0,
        isLiked: false
      };
      
      setComments([...comments, newCommentObj]);
      setNewComment("");
      
      toast({
        title: "Comment posted",
        description: "Your comment has been added to the discussion.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not post your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mt-4">
        <h3 className="font-medium mb-4">Comments ({comments.length})</h3>
        <div className="space-y-4 mb-4">
          {comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between">
                <span className="font-medium">@{comment.username}</span>
                <span className="text-xs text-gray-500">{comment.timestamp}</span>
              </div>
              <p className="mt-1 text-gray-700">{comment.text}</p>
              <div className="flex items-center mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1 p-0 h-auto text-xs ${comment.isLiked ? "text-rose-500" : "text-gray-500"}`}
                  onClick={() => handleCommentLikeToggle(comment.id)}
                  disabled={loadingCommentId === comment.id}
                >
                  {loadingCommentId === comment.id ? (
                    <Loader className="h-3 w-3 animate-spin" />
                  ) : (
                    <Heart className={`h-3 w-3 ${comment.isLiked ? "fill-rose-500" : ""}`} />
                  )}
                  <span>{comment.likes}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-auto pt-4">
        <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
          <Textarea 
            placeholder="Add a comment..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="resize-none"
            disabled={isSubmitting}
          />
          <Button 
            type="submit" 
            className="bg-softspot-400 hover:bg-softspot-500 self-end"
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              'Post'
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
