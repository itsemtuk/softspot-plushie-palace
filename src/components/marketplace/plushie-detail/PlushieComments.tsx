
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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

  const handleCommentLikeToggle = (commentId: string) => {
    setComments(prevComments => prevComments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked
        };
      }
      return comment;
    }));
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const newCommentObj: Comment = {
      id: `c${Date.now()}`,
      username: "currentUser",
      text: newComment,
      timestamp: "Just now",
      likes: 0,
      isLiked: false
    };
    
    setComments(prev => [...prev, newCommentObj]);
    setNewComment("");
    toast({
      title: "Comment posted",
      description: "Your comment has been added to the discussion.",
    });
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
                >
                  <Heart className={`h-3 w-3 ${comment.isLiked ? "fill-rose-500" : ""}`} />
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
          />
          <Button 
            type="submit" 
            className="bg-softspot-400 hover:bg-softspot-500 self-end"
            disabled={!newComment.trim()}
          >
            Post
          </Button>
        </form>
      </div>
    </>
  );
}
