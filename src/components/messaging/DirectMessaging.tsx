import { useState, useEffect } from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Send, 
  Search, 
  User,
  Bell,
  ShieldAlert,
  Trash2,
  Feather
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { DirectMessage, MessageThread, UserProfile } from '@/types/marketplace';
import { toast } from '@/components/ui/use-toast';
import { useUser } from '@clerk/clerk-react';
import { formatTimeAgo } from '@/lib/utils';

// Mock data - in a real app, this would come from an API
const mockUsers: UserProfile[] = [
  { id: "user-1", username: "plushielover", profileImageUrl: "https://i.pravatar.cc/150?img=1", bio: "Plushie enthusiast", followers: 120, isFollowing: false, avatar: "https://i.pravatar.cc/150?img=1" },
  { id: "user-2", username: "sarahlovesplushies", profileImageUrl: "https://i.pravatar.cc/150?img=5", bio: "Sarah's plushie collection", followers: 78, isFollowing: false, avatar: "https://i.pravatar.cc/150?img=5" },
  { id: "user-3", username: "mikeplush", profileImageUrl: "https://i.pravatar.cc/150?img=12", bio: "Plushie trader", followers: 56, isFollowing: false, avatar: "https://i.pravatar.cc/150?img=12" },
  { id: "user-4", username: "emmacollects", profileImageUrl: "https://i.pravatar.cc/150?img=9", bio: "Plushie collector", followers: 91, isFollowing: false, avatar: "https://i.pravatar.cc/150?img=9" }
];

interface UpdatedMessageThread extends Omit<MessageThread, 'participants'> {
  participants: UserProfile[];
}

// Updated mockThreads to use UserProfile objects as participants
const mockThreads: UpdatedMessageThread[] = [
  {
    id: "thread-1",
    participants: [
      mockUsers[0],
      mockUsers[1]
    ],
    lastMessage: {
      id: "msg-1",
      senderId: "user-2",
      receiverId: "user-1",
      content: "Hi! I'm interested in your teddy bear listing.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: false,
    },
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 1
  },
  {
    id: "thread-2",
    participants: [
      mockUsers[0],
      mockUsers[2]
    ],
    lastMessage: {
      id: "msg-2",
      senderId: "user-1",
      receiverId: "user-3",
      content: "Would you consider trading for my bunny plush?",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      isRead: true,
    },
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    unreadCount: 0
  }
];

const mockMessages: DirectMessage[] = [
  {
    id: "msg-1",
    senderId: "user-2",
    receiverId: "user-1",
    content: "Hi! I'm interested in your teddy bear listing.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
  },
  {
    id: "msg-2",
    senderId: "user-1",
    receiverId: "user-2",
    content: "Hello! Yes, it's still available. Are you interested in buying or trading?",
    timestamp: new Date(Date.now() - 3500000).toISOString(),
    isRead: true,
  },
  {
    id: "msg-3",
    senderId: "user-2",
    receiverId: "user-1",
    content: "I'd like to buy it. Is the price negotiable?",
    timestamp: new Date(Date.now() - 3400000).toISOString(),
    isRead: false,
  }
];

const DirectMessaging = () => {
  const { user } = useUser();
  const [threads, setThreads] = useState<UpdatedMessageThread[]>(mockThreads);
  const [messages, setMessages] = useState<DirectMessage[]>(mockMessages);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [requestsTab, setRequestsTab] = useState("messages");

  const formatTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 86400000) { // less than 24 hours
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeThread) return;
    
    const currentThread = threads.find(t => t.id === activeThread);
    if (!currentThread) return;
    
    const recipientUser = currentThread.participants.find(p => p.id !== "user-1");
    const recipientId = recipientUser ? recipientUser.id : "";
    
    const newMessage: DirectMessage = {
      id: `msg-${Date.now()}`,
      senderId: "user-1",
      receiverId: recipientId,
      content: messageText,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update the thread's last message
    setThreads(prev => prev.map(thread => 
      thread.id === activeThread 
        ? { 
            ...thread, 
            lastMessage: newMessage, 
            updatedAt: new Date().toISOString(), 
            unreadCount: 0 
          } 
        : thread
    ));
    
    setMessageText("");
    toast({ title: "Message sent" });
  };

  const handleStartNewConversation = () => {
    if (!selectedUser) return;
    
    // Find the selected user profile
    const selectedUserProfile = mockUsers.find(u => u.id === selectedUser);
    if (!selectedUserProfile) return;
    
    // Create a new thread
    const existingThread = threads.find(t => 
      t.participants.some(p => p.id === "user-1") && 
      t.participants.some(p => p.id === selectedUser)
    );
    
    if (existingThread) {
      setActiveThread(existingThread.id);
      setIsNewMessageDialogOpen(false);
      return;
    }
    
    // Find current user profile
    const currentUserProfile = mockUsers.find(u => u.id === "user-1")!;
    
    const newThread: UpdatedMessageThread = {
      id: `thread-${Date.now()}`,
      participants: [currentUserProfile, selectedUserProfile],
      lastMessage: {
        id: "",
        senderId: "",
        receiverId: "",
        content: "Start a new conversation",
        timestamp: new Date().toISOString(),
        isRead: true,
      },
      updatedAt: new Date().toISOString(),
      unreadCount: 0
    };
    
    setThreads(prev => [...prev, newThread]);
    setActiveThread(newThread.id);
    setIsNewMessageDialogOpen(false);
  };

  const handleReportSpam = (threadId: string) => {
    setThreads(prev => prev.filter(t => t.id !== threadId));
    if (activeThread === threadId) {
      setActiveThread(null);
    }
    toast({ 
      title: "Thread reported as spam", 
      description: "This conversation has been reported and removed."
    });
  };

  const filteredUsers = mockUsers.filter(u => 
    u.id !== "user-1" && // exclude current user
    (u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-lg shadow flex flex-col h-[calc(100vh-160px)] max-h-[800px] overflow-hidden">
      <Tabs value={requestsTab} onValueChange={setRequestsTab} className="flex flex-col h-full">
        <div className="border-b p-3 flex items-center justify-between">
          <TabsList className="grid grid-cols-2 w-64">
            <TabsTrigger value="messages" className="relative">
              Messages
              {threads.some(t => t.unreadCount > 0) && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-softspot-500">
                  {threads.reduce((acc, t) => acc + t.unreadCount, 0)}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="requests">Message Requests</TabsTrigger>
          </TabsList>
          <Button
            variant="default"
            size="sm"
            className="bg-softspot-400 hover:bg-softspot-500 flex items-center gap-2"
            onClick={() => setIsNewMessageDialogOpen(true)}
          >
            <Feather className="h-4 w-4" />
            Compose
          </Button>
        </div>
        
        <div className="flex h-full">
          <TabsContent value="messages" className="flex h-full w-full m-0">
            <div className="w-1/3 border-r h-full md:block hidden">
              <div className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search messages..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <ScrollArea className="h-[calc(100%-64px)]">
                {threads.length > 0 ? (
                  threads.map(thread => {
                    const otherUser = thread.participants.find(p => p.id !== "user-1");
                    
                    if (!otherUser) return null;
                    
                    return (
                      <div 
                        key={thread.id}
                        className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
                          activeThread === thread.id ? 'bg-softspot-50' : ''
                        } ${thread.unreadCount > 0 ? 'font-semibold' : ''}`}
                        onClick={() => setActiveThread(thread.id)}
                      >
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={otherUser.profileImageUrl} alt={otherUser.username} />
                          <AvatarFallback>{otherUser.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="block truncate">{otherUser.username}</span>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(thread.lastMessage?.timestamp || thread.updatedAt)}
                            </span>
                          </div>
                          <p className="text-sm truncate text-gray-500">
                            {thread.lastMessage?.senderId === "user-1" ? "You: " : ""}
                            {thread.lastMessage?.content}
                          </p>
                        </div>
                        {thread.unreadCount > 0 && (
                          <Badge className="ml-2 bg-softspot-500">
                            {thread.unreadCount}
                          </Badge>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 text-sm text-gray-500">No messages yet</p>
                  </div>
                )}
              </ScrollArea>
            </div>
            
            <div className="w-full md:w-2/3 flex flex-col h-full">
              {activeThread ? (
                <>
                  <div className="border-b p-3 flex items-center justify-between">
                    {(() => {
                      const thread = threads.find(t => t.id === activeThread);
                      const otherUser = thread?.participants.find(p => p.id !== "user-1");
                      
                      return otherUser ? (
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={otherUser.profileImageUrl} alt={otherUser.username} />
                            <AvatarFallback>{otherUser.username.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{otherUser.username}</div>
                            <div className="text-xs text-gray-500">@{otherUser.username}</div>
                          </div>
                        </div>
                      ) : null;
                    })()}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive md:block hidden"
                      onClick={() => activeThread && handleReportSpam(activeThread)}
                    >
                      <ShieldAlert className="h-4 w-4 mr-1" />
                      Report Spam
                    </Button>
                  </div>
                  
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map(message => {
                        const isCurrentUser = message.senderId === "user-1";
                        const sender = mockUsers.find(u => u.id === message.senderId);
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            {!isCurrentUser && sender && (
                              <Avatar className="h-8 w-8 mr-2 mt-1">
                                <AvatarImage src={sender.profileImageUrl} alt={sender.username} />
                                <AvatarFallback>{sender.username.charAt(0)}</AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`rounded-lg p-3 max-w-[70%] ${
                                isCurrentUser 
                                  ? 'bg-softspot-100 text-gray-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <p>{message.content}</p>
                              <div
                                className={`text-xs mt-1 ${
                                  isCurrentUser ? 'text-gray-500' : 'text-gray-500'
                                }`}
                              >
                                {formatTimestamp(message.timestamp)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                  
                  <div className="border-t p-3">
                    <div className="flex">
                      <Textarea
                        placeholder="Type a message..."
                        className="flex-1 resize-none h-16"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button
                        className="ml-2 self-end bg-softspot-400 hover:bg-softspot-500"
                        onClick={handleSendMessage}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No conversation selected</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Choose a conversation from the sidebar or start a new one.
                    </p>
                    <Button
                      className="mt-4 bg-softspot-400 hover:bg-softspot-500 flex items-center gap-2"
                      onClick={() => setIsNewMessageDialogOpen(true)}
                    >
                      <Feather className="h-4 w-4" />
                      Compose
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="requests" className="flex h-full w-full m-0">
            <div className="w-full p-6 text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No message requests</h3>
              <p className="mt-1 text-sm text-gray-500">
                When someone you don't follow sends you a message, it will appear here.
              </p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
      
      <Dialog open={isNewMessageDialogOpen} onOpenChange={setIsNewMessageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compose Message</DialogTitle>
            <DialogDescription>
              Start a new conversation with another plushie enthusiast
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div
                    key={user.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer ${
                      selectedUser === user.id ? 'bg-softspot-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedUser(user.id)}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={user.profileImageUrl} alt={user.username} />
                      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-xs text-gray-500">@{user.username}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4">
                  <User className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">No users found</p>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsNewMessageDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleStartNewConversation}
              disabled={!selectedUser}
              className="bg-softspot-400 hover:bg-softspot-500"
            >
              Start Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DirectMessaging;
