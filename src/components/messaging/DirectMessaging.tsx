import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Clock, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DirectMessage, MessageThread, UserProfile, UpdatedMessageThread } from "@/types/marketplace";
import { useUser } from "@clerk/clerk-react";
import { formatDistanceToNow } from "date-fns";

export function DirectMessaging() {
  const { user } = useUser();
  const [selectedThread, setSelectedThread] = useState<UpdatedMessageThread | null>(null);
  const [messageText, setMessageText] = useState("");
  const [threads, setThreads] = useState<UpdatedMessageThread[]>([]);
  
  // Load messages from localStorage on component mount
  useEffect(() => {
    const storedThreads = localStorage.getItem("messageThreads");
    if (storedThreads) {
      setThreads(JSON.parse(storedThreads));
    } else {
      // Create mock data if no threads exist
      const mockThreads = createMockThreads();
      setThreads(mockThreads);
      localStorage.setItem("messageThreads", JSON.stringify(mockThreads));
    }
  }, []);
  
  const currentUserId = user?.id || "user-1";
  
  const createMockThreads = (): UpdatedMessageThread[] => {
    const currentTime = new Date().toISOString();
    
    const thread1: UpdatedMessageThread = {
      id: "thread-1",
      participantIds: ["user-2", currentUserId],
      participants: [
        {
          id: "user-2",
          username: "SquishyCollector",
          profileImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
          bio: "Passionate about all things plushie!",
          followers: 129,
          isFollowing: true,
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
        }
      ],
      lastMessage: {
        id: "msg-1",
        senderId: "user-2",
        content: "Hey there! I'm interested in your Jellycat bunny!",
        timestamp: currentTime,
        read: false,
        recipientId: currentUserId
      },
      unreadCount: 1,
      createdAt: currentTime,
      updatedAt: currentTime
    };
    
    const thread2: UpdatedMessageThread = {
      id: "thread-2",
      participantIds: ["user-3", currentUserId],
      participants: [
        {
          id: "user-3",
          username: "PlushieTrades",
          profileImageUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a",
          bio: "Looking for rare plushies!",
          followers: 87,
          isFollowing: false,
          avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a"
        }
      ],
      lastMessage: {
        id: "msg-2",
        senderId: currentUserId,
        content: "Sure, I can meet up on Saturday for the trade.",
        timestamp: currentTime,
        read: true,
        recipientId: "user-3"
      },
      unreadCount: 0,
      createdAt: currentTime,
      updatedAt: currentTime
    };
    
    return [thread1, thread2];
  };
  
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedThread) return;
    
    const newMessage: DirectMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      content: messageText,
      timestamp: new Date().toISOString(),
      read: false,
      recipientId: selectedThread.participants[0].id
    };
    
    // Update selected thread
    const updatedSelectedThread: UpdatedMessageThread = {
      ...selectedThread,
      lastMessage: newMessage,
      updatedAt: new Date().toISOString(),
      unreadCount: 0
    };
    
    setSelectedThread(updatedSelectedThread);
    
    // Update threads list
    const updatedThreads = threads.map(thread => 
      thread.id === selectedThread.id ? updatedSelectedThread : thread
    );
    
    setThreads(updatedThreads);
    setMessageText("");
    
    // Save to localStorage
    localStorage.setItem("messageThreads", JSON.stringify(updatedThreads));
    
    // Simulate reply
    setTimeout(() => {
      const replyMessage: DirectMessage = {
        id: `msg-${Date.now()}`,
        senderId: selectedThread.participants[0].id,
        content: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date().toISOString(),
        read: true,
        recipientId: currentUserId
      };
      
      const threadWithReply: UpdatedMessageThread = {
        ...updatedSelectedThread,
        lastMessage: replyMessage,
        updatedAt: new Date().toISOString(),
        unreadCount: 0
      };
      
      setSelectedThread(threadWithReply);
      
      // Update threads list with the reply
      const threadsWithReply = updatedThreads.map(thread => 
        thread.id === selectedThread.id ? threadWithReply : thread
      );
      
      setThreads(threadsWithReply);
      localStorage.setItem("messageThreads", JSON.stringify(threadsWithReply));
    }, 2000);
  };
  
  const handleSelectThread = (thread: UpdatedMessageThread) => {
    // Mark thread as read
    const updatedThread: UpdatedMessageThread = {
      ...thread,
      unreadCount: 0,
      lastMessage: {
        ...thread.lastMessage,
        read: true,
        recipientId: thread.lastMessage.recipientId
      }
    };
    
    setSelectedThread(updatedThread);
    
    // Update threads list
    const updatedThreads = threads.map(t => 
      t.id === thread.id ? updatedThread : t
    );
    
    setThreads(updatedThreads);
    localStorage.setItem("messageThreads", JSON.stringify(updatedThreads));
  };
  
  const formatMessageTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "Recently";
    }
  };

  return (
    <div className="flex h-screen">
      {/* Threads List */}
      <div className="w-80 border-r bg-gray-50">
        <ScrollArea className="h-full">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Direct Messages</h3>
            {threads.map((thread) => (
              <Card
                key={thread.id}
                className={`mb-2 cursor-pointer ${selectedThread?.id === thread.id ? "bg-softspot-100" : "hover:bg-gray-100"}`}
                onClick={() => handleSelectThread(thread)}
              >
                <CardContent className="flex items-center space-x-4 p-3">
                  <Avatar>
                    <AvatarImage src={thread.participants[0].profileImageUrl} />
                    <AvatarFallback>{thread.participants[0].username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{thread.participants[0].username}</h4>
                    <div className="text-sm text-gray-500">
                      {thread.lastMessage.content.length > 30 ? thread.lastMessage.content.substring(0, 30) + "..." : thread.lastMessage.content}
                    </div>
                  </div>
                  {thread.unreadCount > 0 && (
                    <Badge variant="secondary">{thread.unreadCount}</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Message Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedThread ? (
          <>
            {/* Header */}
            <div className="border-b p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={selectedThread.participants[0].profileImageUrl} />
                  <AvatarFallback>{selectedThread.participants[0].username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{selectedThread.participants[0].username}</h4>
                  <p className="text-sm text-gray-500">
                    Last active {formatMessageTime(selectedThread.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4">
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {/* Mock messages */}
                  <div className="flex items-start space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedThread.participants[0].profileImageUrl} />
                      <AvatarFallback>{selectedThread.participants[0].username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="rounded-xl bg-gray-100 p-2 text-sm">
                        {selectedThread.lastMessage.content}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatMessageTime(selectedThread.lastMessage.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end space-x-2 justify-end">
                    <div>
                      <div className="rounded-xl bg-softspot-500 text-white p-2 text-sm">
                        Hey! How's it going?
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-right">
                        {formatMessageTime(selectedThread.lastMessage.timestamp)}
                        <Check className="inline-block w-4 h-4 ml-1" />
                      </div>
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.imageUrl || ""} />
                      <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  className="rounded-full"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a thread to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
