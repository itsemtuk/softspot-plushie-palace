
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PlusSquare, ShoppingBag, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CreateButtonProps {
  onCreatePost: () => void;
}

export const CreateButton = ({ onCreatePost }: CreateButtonProps) => {
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default" className="flex items-center gap-2 bg-softspot-500 hover:bg-softspot-600">
          <PlusSquare className="h-4 w-4" />
          Create
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New</SheetTitle>
          <SheetDescription>Choose what you'd like to do</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 mt-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 justify-start"
            onClick={onCreatePost}
          >
            <PlusSquare className="h-4 w-4" />
            Create Post
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 justify-start"
            onClick={() => navigate('/marketplace/sell')}
          >
            <ShoppingBag className="h-4 w-4" />
            Sell Item
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 justify-start"
            onClick={() => navigate('/messages')}
          >
            <MessageSquare className="h-4 w-4" />
            Trade Request
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
