
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserStatusBadge } from "./UserStatusBadge";
import { toast } from "@/components/ui/use-toast";

interface MessageRequestProps {
  id: string;
  name: string;
  username?: string;
  avatar: string;
  preview: string;
  timestamp: string;
  mutualCount?: number;
  isVerified?: boolean;
  status?: "online" | "offline" | "away" | "busy";
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

export const MessageRequest: React.FC<MessageRequestProps> = ({
  id,
  name,
  username,
  avatar,
  preview,
  timestamp,
  mutualCount = 0,
  isVerified = false,
  status,
  onAccept,
  onDecline
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<"accept" | "decline" | null>(null);

  const handleAccept = async () => {
    setIsLoading(true);
    setAction("accept");
    try {
      // In a production app, this would call your API
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      onAccept(id);
      toast({
        title: "Request accepted",
        description: `You can now message with ${name}.`
      });
    } catch (error) {
      console.error("Error accepting request:", error);
      toast({
        title: "Error",
        description: "Failed to accept request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    setIsLoading(true);
    setAction("decline");
    try {
      // In a production app, this would call your API
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      onDecline(id);
      toast({
        title: "Request declined",
        description: "The request has been removed."
      });
    } catch (error) {
      console.error("Error declining request:", error);
      toast({
        title: "Error",
        description: "Failed to decline request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 transition-all hover:shadow-md animate-fade-in">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar>
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          {status && (
            <UserStatusBadge status={status} className="absolute -bottom-0.5 -right-0.5" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{name}</span>
            {username && <span className="text-sm text-gray-500">@{username}</span>}
            {isVerified && (
              <Badge variant="outline" className="bg-blue-100 text-blue-700 text-xs">
                Verified
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{preview}</p>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <span>{timestamp}</span>
            {mutualCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-gray-100 rounded-full">
                {mutualCount} mutual{mutualCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDecline}
          disabled={isLoading}
        >
          {isLoading && action === "decline" ? (
            <span className="flex items-center">
              <span className="animate-spin h-3 w-3 mr-1 rounded-full border-2 border-gray-500 border-t-transparent"></span>
              Declining...
            </span>
          ) : (
            "Decline"
          )}
        </Button>
        <Button
          size="sm"
          className="bg-softspot-500 hover:bg-softspot-600"
          onClick={handleAccept}
          disabled={isLoading}
        >
          {isLoading && action === "accept" ? (
            <span className="flex items-center">
              <span className="animate-spin h-3 w-3 mr-1 rounded-full border-2 border-white border-t-transparent"></span>
              Accepting...
            </span>
          ) : (
            "Accept"
          )}
        </Button>
      </div>
    </Card>
  );
};
