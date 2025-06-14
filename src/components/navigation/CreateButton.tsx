
import { useState } from "react";
import { PlusCircle, Image, Tag, Handshake } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useCreatePost } from "@/hooks/use-create-post";

export const CreateButton = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { setIsPostCreationOpen } = useCreatePost();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCreatePost = () => {
    console.log("CreateButton: handleCreatePost called");
    
    if (!user) {
      console.log("CreateButton: No user, redirecting to sign in");
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a post."
      });
      navigate('/sign-in');
      return;
    }

    setIsDropdownOpen(false);
    console.log("CreateButton: Setting post creation open to true");
    
    // Add a small delay to ensure the dropdown closes first
    setTimeout(() => {
      setIsPostCreationOpen(true);
    }, 100);
  };

  const handleSellItem = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to sell an item."
      });
      navigate('/sign-in');
      return;
    }

    setIsDropdownOpen(false);
    navigate('/sell');
  };
  
  const handleTradeRequest = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a trade request."
      });
      navigate('/sign-in');
      return;
    }

    setIsDropdownOpen(false);
    navigate('/messages');
    
    toast({
      title: "Trade Request",
      description: "Trade request feature coming soon!"
    });
  };

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          className="bg-softspot-500 hover:bg-softspot-600 text-white rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
          size="sm"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          <span>Create</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px] bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700 z-50">
        <DropdownMenuLabel>Create New</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleCreatePost} 
          className="cursor-pointer rounded-lg mx-1 hover:bg-softspot-50 dark:hover:bg-softspot-900"
        >
          <Image className="mr-2 h-4 w-4" />
          <span>New Post</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleTradeRequest} 
          className="cursor-pointer rounded-lg mx-1 hover:bg-softspot-50 dark:hover:bg-softspot-900"
        >
          <Handshake className="mr-2 h-4 w-4" />
          <span>Trade Request</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleSellItem} 
          className="cursor-pointer rounded-lg mx-1 hover:bg-softspot-50 dark:hover:bg-softspot-900"
        >
          <Tag className="mr-2 h-4 w-4" />
          <span>Sell Plushie</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
