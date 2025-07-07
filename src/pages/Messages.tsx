
import { useState } from 'react';
import { Send, Plus, Search, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import MainLayout from '@/components/layout/MainLayout';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

const mockConversations: Conversation[] = [];

const mockMessages: Message[] = [];

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [newConversationUser, setNewConversationUser] = useState('');
  const [newConversationMessage, setNewConversationMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleNewConversation = () => {
    setShowNewMessageDialog(true);
  };

  const handleStartConversation = () => {
    if (newConversationUser.trim() && newConversationMessage.trim()) {
      console.log('Starting conversation with:', newConversationUser);
      setShowNewMessageDialog(false);
      setNewConversationUser('');
      setNewConversationMessage('');
    }
  };

  const selectedConv = mockConversations.find(c => c.id === selectedConversation);

  return (
    <MainLayout noPadding>
      <div className="h-screen bg-white dark:bg-gray-900 flex overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-full md:w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col md:flex-none">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Messages</h2>
              <Button 
                size="sm" 
                onClick={handleNewConversation}
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1">
            {mockConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No conversations yet
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  You can only message people who follow you. Start by building your network!
                </p>
              </div>
            ) : (
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
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex-col ${selectedConv ? 'flex' : 'hidden md:flex'}`}>
          {selectedConv ? (
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
                {mockMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 px-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No messages yet
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                      Start a conversation by sending a message!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                          message.sender === 'me' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          {message.sender === 'them' && (
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-gray-400 text-xs">
                                {selectedConv.name.slice(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`px-4 py-2 rounded-2xl shadow-sm ${
                              message.sender === 'me'
                                ? 'bg-softspot-500 text-white rounded-br-sm'
                                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-sm'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-end space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-softspot-500 hover:bg-softspot-600 text-white rounded-full h-10 w-10 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Your Messages
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Send private messages to friends and other collectors
                </p>
                <Button 
                  onClick={handleNewConversation}
                  className="bg-softspot-500 hover:bg-softspot-600 text-white"
                >
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* New Message Dialog */}
        {showNewMessageDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">New Message</h3>
              <Input 
                placeholder="Username..." 
                value={newConversationUser}
                onChange={(e) => setNewConversationUser(e.target.value)}
                className="mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              />
              <textarea 
                placeholder="Type your message..."
                value={newConversationMessage}
                onChange={(e) => setNewConversationMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                rows={4}
              />
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={() => setShowNewMessageDialog(false)}
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-softspot-500 hover:bg-softspot-600 text-white"
                  onClick={handleStartConversation}
                  disabled={!newConversationUser.trim() || !newConversationMessage.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
