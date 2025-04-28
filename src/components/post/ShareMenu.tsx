
import { Share, Link, Mail, Facebook, Twitter, Linkedin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface ShareMenuProps {
  postId: string;
  title: string;
}

export const ShareMenu = ({ postId, title }: ShareMenuProps) => {
  const [hasCopied, setHasCopied] = useState(false);
  const shareUrl = `${window.location.origin}/post/${postId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setHasCopied(true);
      
      toast({
        title: "Success!",
        description: "Link copied to clipboard",
        duration: 2000, // Show for 2 seconds
      });

      // Reset the copied state after 2 seconds
      setTimeout(() => setHasCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please try again",
      });
    }
  };

  const shareToSocial = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      mail: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`
    };

    if (platform === 'mail') {
      window.location.href = urls[platform];
    } else {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-600 hover:text-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:outline-none"
        >
          <Share className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer flex items-center justify-between">
          <div className="flex items-center">
            {hasCopied ? (
              <Check className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <Link className="mr-2 h-4 w-4" />
            )}
            Copy link
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToSocial('facebook')} className="cursor-pointer">
          <Facebook className="mr-2 h-4 w-4" />
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToSocial('twitter')} className="cursor-pointer">
          <Twitter className="mr-2 h-4 w-4" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToSocial('linkedin')} className="cursor-pointer">
          <Linkedin className="mr-2 h-4 w-4" />
          Share on LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToSocial('mail')} className="cursor-pointer">
          <Mail className="mr-2 h-4 w-4" />
          Share via Email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
