
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MarketplacePlushie } from "@/types/marketplace";
import { PlushieDetails } from "./plushie-detail/PlushieDetails";
import { PlushieActions } from "./plushie-detail/PlushieActions";
import { PlushieInfo } from "./plushie-detail/PlushieInfo";
import { PlushieComments } from "./plushie-detail/PlushieComments";

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
}

export function PlushieDetailDialog({ isOpen, onClose, plushie }: PlushieDetailDialogProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(plushie?.likes || 0);
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
  
  const handleLikeToggle = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  if (!plushie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Left side - Image */}
          <div className="bg-black flex items-center justify-center">
            <AspectRatio ratio={1} className="w-full">
              <img src={plushie.image} alt={plushie.title} className="object-cover w-full h-full" />
            </AspectRatio>
          </div>
          
          {/* Right side - Content */}
          <div className="p-6 flex flex-col h-full max-h-[90vh] overflow-y-auto">
            <PlushieDetails plushie={plushie} />
            <PlushieInfo plushie={plushie} />
            <PlushieActions 
              isLiked={isLiked}
              likeCount={likeCount}
              commentCount={comments.length}
              onLikeToggle={handleLikeToggle}
            />
            <PlushieComments 
              comments={comments}
              setComments={setComments}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PlushieDetailDialog;
