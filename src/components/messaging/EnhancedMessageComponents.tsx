import { useState } from 'react';
import { Send, Handshake, DollarSign, Package, Plus, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TradeRequestDialog } from './TradeRequestCard';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface EnhancedMessageInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onSendTradeRequest?: () => void;
  onSendOffer?: () => void;
  onShareListing?: () => void;
  conversationUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export const EnhancedMessageInput = ({
  message,
  onMessageChange,
  onSendMessage,
  onSendTradeRequest,
  onSendOffer,
  onShareListing,
  conversationUser
}: EnhancedMessageInputProps) => {
  const [showTradeDialog, setShowTradeDialog] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <>
      <div className="flex items-end gap-2">
        {/* Main Input */}
        <div className="flex-1 relative">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pr-12 py-3 rounded-full bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700">
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Actions Menu */}
        <DropdownMenu open={showActionsMenu} onOpenChange={setShowActionsMenu}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full h-10 w-10 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              onClick={() => {
                setShowTradeDialog(true);
                setShowActionsMenu(false);
              }}
              className="cursor-pointer"
            >
              <Handshake className="mr-2 h-4 w-4 text-orange-600" />
              <span>Send Trade Request</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {
                onSendOffer?.();
                setShowActionsMenu(false);
              }}
              className="cursor-pointer"
            >
              <DollarSign className="mr-2 h-4 w-4 text-green-600" />
              <span>Make an Offer</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {
                onShareListing?.();
                setShowActionsMenu(false);
              }}
              className="cursor-pointer"
            >
              <Package className="mr-2 h-4 w-4 text-blue-600" />
              <span>Share Listing</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Send Button */}
        <Button
          onClick={onSendMessage}
          disabled={!message.trim()}
          className="bg-softspot-500 hover:bg-softspot-600 text-white rounded-full h-10 w-10 p-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Trade Request Dialog */}
      <TradeRequestDialog
        isOpen={showTradeDialog}
        onClose={() => setShowTradeDialog(false)}
        targetUser={conversationUser}
      />
    </>
  );
};

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    sender: 'me' | 'them';
    timestamp: string;
    type?: 'text' | 'trade_request' | 'offer' | 'listing_share';
    tradeRequest?: {
      id: string;
      offeredItems: string;
      requestedItems: string;
      status: string;
    };
    offer?: {
      id: string;
      amount: number;
      status: string;
    };
    sharedListing?: {
      id: string;
      title: string;
      price: number;
      image?: string;
    };
  };
  conversationUser?: {
    name: string;
    avatar?: string;
  };
}

export const MessageBubble = ({ message, conversationUser }: MessageBubbleProps) => {
  const isFromMe = message.sender === 'me';

  if (message.type === 'trade_request' && message.tradeRequest) {
    return (
      <div className={`flex ${isFromMe ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className="max-w-md">
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Handshake className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-900 dark:text-orange-100">
                  Trade Request
                </span>
                <Badge variant="outline" className="text-xs">
                  {message.tradeRequest.status}
                </Badge>
              </div>
              <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">
                {message.content}
              </p>
              <div className="text-xs text-orange-700 dark:text-orange-300">
                <p><strong>Offering:</strong> {message.tradeRequest.offeredItems}</p>
                <p><strong>For:</strong> {message.tradeRequest.requestedItems}</p>
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                {message.timestamp}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (message.type === 'offer' && message.offer) {
    return (
      <div className={`flex ${isFromMe ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className="max-w-md">
          <Card className="border-green-200 bg-green-50 dark:bg-green-950">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900 dark:text-green-100">
                  Offer: ${message.offer.amount}
                </span>
                <Badge variant="outline" className="text-xs">
                  {message.offer.status}
                </Badge>
              </div>
              <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                {message.content}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {message.timestamp}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (message.type === 'listing_share' && message.sharedListing) {
    return (
      <div className={`flex ${isFromMe ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className="max-w-md">
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900 dark:text-blue-100">
                  Shared Listing
                </span>
              </div>
              <div className="flex gap-3">
                {message.sharedListing.image && (
                  <img 
                    src={message.sharedListing.image} 
                    alt={message.sharedListing.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm">
                    {message.sharedListing.title}
                  </h4>
                  <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                    ${message.sharedListing.price}
                  </p>
                </div>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-2">
                {message.content}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                {message.timestamp}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Regular text message
  return (
    <div className={`flex ${isFromMe ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
        isFromMe
          ? 'bg-softspot-500 text-white rounded-br-sm'
          : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-sm'
      }`}>
        <p className="text-sm">{message.content}</p>
        <p className={`text-xs mt-1 ${
          isFromMe ? 'text-softspot-100' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};