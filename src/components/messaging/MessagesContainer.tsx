import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { DirectMessaging } from "./DirectMessaging";
import { Card } from "@/components/ui/card";
import { MessageCircle, Users } from "lucide-react";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status?: 'online' | 'offline' | 'away' | 'busy';
  isGroup?: boolean;
  participants?: {
    id: string;
    name: string;
    avatar: string;
  }[];
}

export const MessagesContainer = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      try {
        // Get current user's Supabase ID
        const { data: currentUser } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_id', user.id)
          .single();

        if (!currentUser) {
          setIsLoading(false);
          return;
        }

        // Fetch conversations where user is a participant
        const { data: conversationsData } = await supabase
          .from('conversations')
          .select(`
            id,
            participants,
            last_message_at,
            created_at
          `)
          .contains('participants', [currentUser.id]);

        if (conversationsData) {
          // Transform conversations data
          const formattedConversations: Conversation[] = await Promise.all(
            conversationsData.map(async (conv) => {
              // Get other participant's info
              const otherParticipantId = conv.participants.find(p => p !== currentUser.id);
              const { data: otherUser } = await supabase
                .from('users')
                .select('username, avatar_url')
                .eq('id', otherParticipantId)
                .single();

              // Get latest message
              const { data: latestMessage } = await supabase
                .from('messages')
                .select('content, created_at')
                .eq('conversation_id', conv.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

              return {
                id: conv.id,
                name: otherUser?.username || 'Unknown User',
                avatar: otherUser?.avatar_url || '/assets/avatars/PLUSH_Bear.PNG',
                lastMessage: latestMessage?.content || 'No messages yet',
                timestamp: latestMessage?.created_at 
                  ? new Date(latestMessage.created_at).toLocaleDateString()
                  : new Date(conv.created_at).toLocaleDateString(),
                unread: 0,
                status: 'offline' as const
              };
            })
          );

          setConversations(formattedConversations);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  if (isLoading) {
    return (
      <Card className="h-[calc(100vh-200px)] min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading conversations...</p>
        </div>
      </Card>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card className="h-[calc(100vh-200px)] min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
          <p className="text-gray-500 mb-4">
            Start messaging with users you follow to see conversations here.
          </p>
        </div>
      </Card>
    );
  }

  return <DirectMessaging initialConversations={conversations} />;
};