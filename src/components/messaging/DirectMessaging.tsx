
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserStatusBadge } from "./UserStatusBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { getUserStatus } from "@/utils/storage/localStorageUtils";

// Mock user data for demonstration
const MOCK_USERS = [
  { id: "user1", name: "Jane Cooper", username: "jane", status: "online", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: "user2", name: "Cody Fisher", username: "cody", status: "busy", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: "user3", name: "Robert Fox", username: "robert", status: "offline", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: "user4", name: "Leslie Alexander", username: "leslie", status: "away", avatar: "https://i.pravatar.cc/150?img=4" },
  { id: "user5", name: "Jacob Jones", username: "jacob", status: "online", avatar: "https://i.pravatar.cc/150?img=5" }
];

// Mock conversation data
const MOCK_CONVERSATIONS: Record<string, any[]> = {
  user1: [
    { id: "msg1", from: "user1", text: "Hey there! How's your collection coming along?", time: "10:30 AM" },
    { id: "msg2", from: "currentUser", text: "Pretty good! Just got a new teddy yesterday.", time: "10:32 AM" },
    { id: "msg3", from: "user1", text: "Oh nice! Can you send a picture?", time: "10:33 AM" }
  ],
  user2: [
    { id: "msg1", from: "user2", text: "Are you interested in trading your unicorn plushie?", time: "Yesterday" },
    { id: "msg2", from: "currentUser", text: "Maybe, what do you have to offer?", time: "Yesterday" }
  ],
  user3: [
    { id: "msg1", from: "currentUser", text: "Hi Robert, I saw your post about vintage plushies", time: "2 days ago" },
    { id: "msg2", from: "user3", text: "Yes, I have quite a collection!", time: "2 days ago" },
    { id: "msg3", from: "user3", text: "Would you like to see some of them?", time: "2 days ago" }
  ]
};

export const DirectMessaging = () => {
  const { user } = useUser();
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userStatus, setUserStatus] = useState("online");

  useEffect(() => {
    // Get user status
    const status = getUserStatus();
    setUserStatus(status);

    // Set first conversation as active by default if none selected
    if (!activeConversation && MOCK_USERS.length > 0) {
      setActiveConversation(MOCK_USERS[0].id);
      setMessages(MOCK_CONVERSATIONS[MOCK_USERS[0].id] || []);
    }
  }, [activeConversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const newMsg = {
      id: `msg${Date.now()}`,
      from: "currentUser",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    
    // Update mock conversations (in a real app, this would be a database update)
    MOCK_CONVERSATIONS[activeConversation] = updatedMessages;
    
    setNewMessage("");
  };

  const selectConversation = (userId: string) => {
    setActiveConversation(userId);
    setMessages(MOCK_CONVERSATIONS[userId] || []);
  };

  const filteredUsers = MOCK_USERS.filter(user => 
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const activeUser = MOCK_USERS.find(u => u.id === activeConversation);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 min-h-[600px]">
        {/* User list sidebar */}
        <div className="border-r border-gray-200 bg-gray-50">
          <div className="p-4">
            <Input
              placeholder="Search conversations..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="mb-4"
            />
            <ScrollArea className="h-[530px] pr-4">
              {filteredUsers.map(chatUser => (
                <div
                  key={chatUser.id}
                  className={`flex items-center gap-3 p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-100 ${
                    activeConversation === chatUser.id ? "bg-softspot-50" : ""
                  }`}
                  onClick={() => selectConversation(chatUser.id)}
                >
                  <div className="relative">
                    <img
                      src={chatUser.avatar}
                      alt={chatUser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <UserStatusBadge status={chatUser.status as any} className="absolute bottom-0 right-0" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{chatUser.name}</p>
                    <p className="text-xs text-gray-500 truncate">@{chatUser.username}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>

        {/* Chat area */}
        <div className="col-span-2 flex flex-col h-[600px]">
          {activeConversation ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 p-4 border-b">
                {activeUser && (
                  <>
                    <div className="relative">
                      <img
                        src={activeUser.avatar}
                        alt={activeUser.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <UserStatusBadge status={activeUser.status as any} className="absolute bottom-0 right-0" />
                    </div>
                    <div>
                      <p className="font-medium">{activeUser.name}</p>
                      <p className="text-xs text-gray-500">@{activeUser.username}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.from === "currentUser" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.from === "currentUser"
                            ? "bg-softspot-500 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.from === "currentUser" ? "text-softspot-100" : "text-gray-500"
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message input */}
              <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-700">No conversation selected</h3>
                <p className="text-gray-500">Choose a conversation from the sidebar to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
