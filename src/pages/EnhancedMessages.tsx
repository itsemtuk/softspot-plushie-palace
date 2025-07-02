import { useState } from 'react';
import { Send, Search, MoreVertical, ArrowLeft, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/layout/MainLayout';
import { TradeRequestCard } from '@/components/messaging/TradeRequestCard';
import { EnhancedMessageInput, MessageBubble } from '@/components/messaging/EnhancedMessageComponents';
import { NewMessageDialog } from '@/components/messaging/NewMessageDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { MessengerInterfaceMobile } from '@/components/messaging/MessengerInterfaceMobile';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  hasTradeRequests?: number;
}

interface Message {
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
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    avatar: '',
    lastMessage: 'I sent you a trade request!',
    timestamp: '2m ago',
    unread: 1,
    online: true,
    hasTradeRequests: 1
  },
  {
    id: '2',
    name: 'PlushieCollector23',
    avatar: '',
    lastMessage: 'Thanks for accepting my offer!',
    timestamp: '1h ago',
    unread: 0,
    online: false
  },
  {
    id: '3',
    name: 'SanrioFan88',
    avatar: '',
    lastMessage: 'Would you consider $25 for the Kuromi?',
    timestamp: '3h ago',
    unread: 2,
    online: true
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hi! I\'m interested in your Jellycat bunny listing',
    sender: 'them',
    timestamp: '10:30 AM',
    type: 'text'
  },
  {
    id: '2',
    content: 'Hello! Yes, it\'s still available. Would you like to see more photos?',
    sender: 'me',
    timestamp: '10:32 AM',
    type: 'text'
  },
  {
    id: '3',
    content: 'That would be great! Also, would you be interested in a trade?',
    sender: 'them',
    timestamp: '10:33 AM',
    type: 'text'
  },
  {
    id: '4',
    content: 'I have a Squishmallow Axolotl that I could trade for your bunny',
    sender: 'them',
    timestamp: '10:35 AM',
    type: 'trade_request',
    tradeRequest: {
      id: 'tr1',
      offeredItems: 'Squishmallow Axolotl 8" - Perfect condition with tags',
      requestedItems: 'Jellycat Bashful Bunny - Medium Cream',
      status: 'pending'
    }
  }
];

const mockTradeRequests = [
  {
    id: '1',
    requesterName: 'Emma Johnson',
    requesterAvatar: '',
    offeredItems: 'Squishmallow Axolotl 8" - Perfect condition with tags',
    requestedItems: 'Jellycat Bashful Bunny - Medium Cream',
    message: 'Hi! I love your bunny and think this would be a fair trade. Let me know what you think!',
    status: 'pending' as const,
    createdAt: '2 hours ago'
  },
  {
    id: '2',
    requesterName: 'CollectorPro',
    requesterAvatar: '',
    offeredItems: 'Disney Stitch Plushie + $10 cash',
    requestedItems: 'Your Sanrio Hello Kitty Collection',
    message: 'Interested in your collection! This is a great deal.',
    status: 'counter_offered' as const,
    createdAt: '1 day ago'
  }
];

export default function EnhancedMessages() {
  const isMobile = useIsMobile();
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'messages' | 'trades'>('messages');
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleStartConversation = (userId: string, message: string) => {
    console.log('Starting conversation with user:', userId, 'Message:', message);
    setShowNewMessageDialog(false);
  };

  const selectedConv = mockConversations.find(c => c.id === selectedConversation);

  // Use mobile interface if on mobile
  if (isMobile) {
    return <MessengerInterfaceMobile />;
  }

  return (
    <MainLayout noPadding>
      <div className="h-screen bg-white dark:bg-gray-900 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col md:flex-none">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Messages</h2>
              <Button 
                size="sm" 
                onClick={() => setShowNewMessageDialog(true)}
                className="bg-softspot-500 hover:bg-softspot-600 text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-4">
              <button
                onClick={() => setActiveTab('messages')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'messages'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Messages
              </button>
              <button
                onClick={() => setActiveTab('trades')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors relative ${
                  activeTab === 'trades'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Trade Requests
                {mockTradeRequests.filter(t => t.status === 'pending').length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white">
                    {mockTradeRequests.filter(t => t.status === 'pending').length}
                  </Badge>
                )}
              </button>
            </div>

            {activeTab === 'messages' && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            {activeTab === 'messages' ? (
              <div className="p-2">
                {mockConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 mb-1 ${
                      selectedConversation === conversation.id
                        ? 'bg-softspot-100 dark:bg-softspot-900 border-l-4 border-softspot-500'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={conversation.avatar} />
                          <AvatarFallback className="bg-softspot-500 text-white">
                            {conversation.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {conversation.name}
                            {conversation.hasTradeRequests && (
                              <Badge className="ml-2 bg-orange-100 text-orange-800 text-xs">
                                Trade
                              </Badge>
                            )}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {conversation.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unread > 0 && (
                        <div className="bg-softspot-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {mockTradeRequests.map((tradeRequest) => (
                  <TradeRequestCard
                    key={tradeRequest.id}
                    tradeRequest={tradeRequest}
                    onAccept={() => console.log('Accept trade', tradeRequest.id)}
                    onDecline={() => console.log('Decline trade', tradeRequest.id)}
                    onCounterOffer={() => console.log('Counter offer', tradeRequest.id)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex-col ${selectedConv && activeTab === 'messages' ? 'flex' : 'hidden md:flex'}`}>
          {selectedConv && activeTab === 'messages' ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConv.avatar} />
                      <AvatarFallback className="bg-softspot-500 text-white">
                        {selectedConv.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {selectedConv.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedConv.online ? (
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                            Active now
                          </span>
                        ) : (
                          'Last seen 1h ago'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
                <div className="space-y-4">
                  {mockMessages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      conversationUser={{
                        name: selectedConv.name,
                        avatar: selectedConv.avatar
                      }}
                    />
                  ))}
                </div>
              </ScrollArea>

              {/* Enhanced Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <EnhancedMessageInput
                  message={newMessage}
                  onMessageChange={setNewMessage}
                  onSendMessage={handleSendMessage}
                  conversationUser={{
                    id: selectedConv.id,
                    name: selectedConv.name,
                    avatar: selectedConv.avatar
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {activeTab === 'messages' ? 'Your Messages' : 'Trade Requests'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {activeTab === 'messages' 
                    ? 'Send private messages to friends and other collectors'
                    : 'Manage your trade requests and offers'
                  }
                </p>
                <Button 
                  onClick={() => setShowNewMessageDialog(true)}
                  className="bg-softspot-500 hover:bg-softspot-600 text-white"
                >
                  {activeTab === 'messages' ? 'Send Message' : 'Send Trade Request'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* New Message Dialog */}
        <NewMessageDialog
          isOpen={showNewMessageDialog}
          onClose={() => setShowNewMessageDialog(false)}
          onStartConversation={handleStartConversation}
        />
      </div>
    </MainLayout>
  );
}