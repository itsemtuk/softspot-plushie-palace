
import { useState } from "react";
import { AlertTriangle, Loader } from "lucide-react";
import { 
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MarketplacePlushie } from "@/types/marketplace";
import { PlushieDetails } from "./plushie-detail/PlushieDetails";
import { PlushieActions } from "./plushie-detail/PlushieActions";
import { PlushieInfo } from "./plushie-detail/PlushieInfo";
import { PlushieComments } from "./plushie-detail/PlushieComments";
import { toast } from "@/components/ui/use-toast";

interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface PlushieDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plushie: MarketplacePlushie;
  isLoading?: boolean;
  error?: string;
}

export function PlushieDetailDialog({ 
  isOpen, 
  onClose, 
  plushie,
  isLoading = false,
  error
}: PlushieDetailDialogProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(plushie?.likes || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    { 
      id: "c1", 
      username: "plushmaster", 
      text: "This looks amazing! How soft is it?",
      timestamp: "2 days ago",
      likes: 3,
      isLiked: false
    }
  ]);
  
  const handleLikeToggle = async () => {
    try {
      setIsLiking(true);
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (isLiked) {
        setLikeCount(prev => prev - 1);
      } else {
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
      
      toast({
        title: isLiked ? "Removed like" : "Added like",
        description: isLiked ? "You've removed your like" : "You've liked this plushie",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update like status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  if (!plushie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        {error ? (
          <div className="p-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Left side - Image */}
            <div className="bg-black flex items-center justify-center relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <Loader className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <AspectRatio ratio={1} className="w-full">
                  <img 
                    src={plushie.image} 
                    alt={plushie.title} 
                    className="object-cover w-full h-full" 
                  />
                </AspectRatio>
              )}
            </div>
            
            {/* Right side - Content */}
            <div className="p-6 flex flex-col h-full max-h-[90vh] overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col gap-4 animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-24 bg-gray-200 rounded w-full"></div>
                </div>
              ) : (
                <>
                  <PlushieDetails plushie={plushie} />
                  <PlushieInfo plushie={plushie} />
                  <PlushieActions 
                    isLiked={isLiked}
                    likeCount={likeCount}
                    commentCount={comments.length}
                    onLikeToggle={handleLikeToggle}
                    isLoading={isLiking}
                  />
                  <PlushieComments 
                    comments={comments}
                    setComments={setComments}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PlushieDetailDialog;
