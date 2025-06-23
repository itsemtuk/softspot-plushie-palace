
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ConversationHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNewConversation: () => void;
}

export const ConversationHeader = ({ 
  searchTerm, 
  onSearchChange, 
  onNewConversation 
}: ConversationHeaderProps) => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Messages</h2>
        <Button 
          size="sm" 
          onClick={onNewConversation}
          className="bg-softspot-500 hover:bg-softspot-600 text-white"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
        />
      </div>
    </div>
  );
};
