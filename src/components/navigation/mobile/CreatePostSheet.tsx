
import { useState } from "react";
import { PlusSquare, ShoppingBag, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function CreatePostSheet() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button size="icon" className="rounded-full bg-softspot-500 hover:bg-softspot-600">
          <PlusSquare className="h-5 w-5 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[40vh]">
        <SheetHeader>
          <SheetTitle>Create New</SheetTitle>
          <SheetDescription>Choose what you'd like to do</SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => {
              setIsSheetOpen(false);
              navigate('/create-post');
            }}
          >
            <PlusSquare className="h-6 w-6" />
            <span>Post</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4"
            disabled
          >
            <ShoppingBag className="h-6 w-6" />
            <span>Sell</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => {
              setIsSheetOpen(false);
              navigate('/messages');
            }}
          >
            <MessageSquare className="h-6 w-6" />
            <span>Trade</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
