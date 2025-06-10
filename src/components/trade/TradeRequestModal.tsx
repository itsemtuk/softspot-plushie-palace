
import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUser } from '@clerk/clerk-react';
import { toast } from '@/hooks/use-toast';

interface TradeRequestModalProps {
  listingId: string;
  listingTitle: string;
  sellerId: string;
  trigger?: React.ReactNode;
}

export const TradeRequestModal = ({ listingId, listingTitle, sellerId, trigger }: TradeRequestModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tradeOffer, setTradeOffer] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to send trade requests",
      });
      return;
    }

    if (!tradeOffer.trim() || !message.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in both the trade offer and message",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual trade request creation once Supabase types are updated
      console.log('Trade request data:', {
        requester_id: user.id,
        listing_id: listingId,
        seller_id: sellerId,
        trade_offer: tradeOffer,
        message: message,
        status: 'pending'
      });

      toast({
        title: "Trade request sent!",
        description: "Your trade request has been sent to the seller.",
      });

      setIsOpen(false);
      setTradeOffer('');
      setMessage('');
    } catch (error) {
      console.error('Error sending trade request:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send trade request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="border-softspot-200 text-softspot-600 hover:bg-softspot-50 dark:border-softspot-700 dark:text-softspot-400 dark:hover:bg-softspot-900">
            <MessageSquare className="h-4 w-4 mr-2" />
            Request Trade
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            Request Trade for "{listingTitle}"
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tradeOffer" className="text-gray-700 dark:text-gray-300">
              What are you offering to trade?
            </Label>
            <Input
              id="tradeOffer"
              placeholder="e.g., Jellycat Bunny + $20"
              value={tradeOffer}
              onChange={(e) => setTradeOffer(e.target.value)}
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">
              Message to seller
            </Label>
            <Textarea
              id="message"
              placeholder="Tell the seller why you'd like to trade..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-softspot-600 hover:bg-softspot-700 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
