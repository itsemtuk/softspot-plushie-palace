
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ActivityStatus } from "@/components/ui/activity-status";

interface UserStatusDropdownProps {
  currentStatus: "online" | "offline" | "away" | "busy";
  onStatusChange: (status: "online" | "offline" | "away" | "busy") => void;
}

export const UserStatusDropdown = ({
  currentStatus,
  onStatusChange,
}: UserStatusDropdownProps) => {
  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online";
      case "offline":
        return "Invisible";
      case "away":
        return "Away";
      case "busy":
        return "Do Not Disturb";
      default:
        return "Online";
    }
  };

  const handleStatusChange = (newStatus: string) => {
    console.log("Changing status to:", newStatus);
    onStatusChange(newStatus as "online" | "offline" | "away" | "busy");
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex w-full items-center cursor-pointer">
        <div className="flex items-center">
          <ActivityStatus status={currentStatus} className="mr-2" />
          <span>{getStatusText(currentStatus)}</span>
        </div>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuRadioGroup
          value={currentStatus}
          onValueChange={handleStatusChange}
        >
          <DropdownMenuRadioItem value="online" className="cursor-pointer">
            <div className="flex items-center">
              <ActivityStatus status="online" className="mr-2" />
              <span>Online</span>
            </div>
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="away" className="cursor-pointer">
            <div className="flex items-center">
              <ActivityStatus status="away" className="mr-2" />
              <span>Away</span>
            </div>
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="busy" className="cursor-pointer">
            <div className="flex items-center">
              <ActivityStatus status="busy" className="mr-2" />
              <span>Do Not Disturb</span>
            </div>
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="offline" className="cursor-pointer">
            <div className="flex items-center">
              <ActivityStatus status="offline" className="mr-2" />
              <span>Invisible</span>
            </div>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};
