
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Smile } from "lucide-react";

interface MessageInputProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
}

export const MessageInput = ({ message, onMessageChange, onSendMessage }: MessageInputProps) => {
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 safe-area-bottom">
      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            className="pr-20 py-3 rounded-full bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700">
              <Smile className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button
          onClick={onSendMessage}
          disabled={!message.trim()}
          className="bg-softspot-500 hover:bg-softspot-600 text-white rounded-full h-10 w-10 p-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
