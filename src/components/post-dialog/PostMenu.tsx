
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export interface PostMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function PostMenu({ onEdit, onDelete }: PostMenuProps) {
  const isMobile = useIsMobile();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`text-gray-500 hover:text-gray-800 ${isMobile ? 'absolute top-2 right-14' : ''}`}
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[60]">
        <DropdownMenuItem onClick={onEdit} className="flex items-center cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit Post</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="flex items-center cursor-pointer text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete Post</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
