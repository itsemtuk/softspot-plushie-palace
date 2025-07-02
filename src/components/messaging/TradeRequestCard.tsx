import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Handshake, Package, ArrowRight, CheckCircle, XCircle, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface TradeRequestCardProps {
  tradeRequest: {
    id: string;
    requesterName: string;
    requesterAvatar?: string;
    offeredItems: string;
    requestedItems: string;
    message: string;
    status: 'pending' | 'accepted' | 'declined' | 'counter_offered';
    createdAt: string;
  };
  isOwnRequest?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  onCounterOffer?: () => void;
}

export const TradeRequestCard = ({ 
  tradeRequest, 
  isOwnRequest = false,
  onAccept,
  onDecline,
  onCounterOffer 
}: TradeRequestCardProps) => {
  const getStatusIcon = () => {
    switch (tradeRequest.status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'declined':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'counter_offered':
        return <Handshake className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = () => {
    switch (tradeRequest.status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'counter_offered':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={tradeRequest.requesterAvatar} />
              <AvatarFallback className="bg-softspot-500 text-white">
                {tradeRequest.requesterName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {isOwnRequest ? 'Your trade request' : `${tradeRequest.requesterName}'s trade request`}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {tradeRequest.createdAt}
              </p>
            </div>
          </div>
          <Badge className={`${getStatusColor()} flex items-center gap-1`}>
            {getStatusIcon()}
            {tradeRequest.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Trade Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <Package className="h-3 w-3" />
              Offering
            </Label>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
              {tradeRequest.offeredItems}
            </p>
          </div>
          
          <div className="flex justify-center">
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <Package className="h-3 w-3" />
              Requesting
            </Label>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
              {tradeRequest.requestedItems}
            </p>
          </div>
        </div>

        {/* Message */}
        {tradeRequest.message && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Message</Label>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
              "{tradeRequest.message}"
            </p>
          </div>
        )}

        {/* Actions */}
        {!isOwnRequest && tradeRequest.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={onAccept}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Accept Trade
            </Button>
            <Button
              onClick={onCounterOffer}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              <Handshake className="h-4 w-4 mr-1" />
              Counter Offer
            </Button>
            <Button
              onClick={onDecline}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              size="sm"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Decline
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface TradeRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  targetListing?: {
    id: string;
    title: string;
    image?: string;
  };
}

export const TradeRequestDialog = ({ 
  isOpen, 
  onClose, 
  targetUser, 
  targetListing 
}: TradeRequestDialogProps) => {
  const [formData, setFormData] = useState({
    offeredItems: '',
    message: '',
    myListingId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Trade request submitted:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Handshake className="h-5 w-5 text-softspot-500" />
            Send Trade Request
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target Info */}
          {targetUser && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={targetUser.avatar} />
                <AvatarFallback className="bg-softspot-500 text-white">
                  {targetUser.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Trading with {targetUser.name}</p>
                {targetListing && (
                  <p className="text-sm text-gray-500">For: {targetListing.title}</p>
                )}
              </div>
            </div>
          )}

          {/* What you're offering */}
          <div className="space-y-3">
            <Label>What are you offering?</Label>
            <Select onValueChange={(value) => setFormData({...formData, myListingId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select one of your listings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="listing1">Jellycat Bunny - Medium (Cream)</SelectItem>
                <SelectItem value="listing2">Squishmallow - Axolotl 8"</SelectItem>
                <SelectItem value="listing3">Build-A-Bear Teddy</SelectItem>
                <SelectItem value="other">Other items (describe below)</SelectItem>
              </SelectContent>
            </Select>
            
            <Textarea
              placeholder="Describe what you're offering in detail..."
              value={formData.offeredItems}
              onChange={(e) => setFormData({...formData, offeredItems: e.target.value})}
              rows={3}
            />
          </div>

          {/* Message */}
          <div className="space-y-3">
            <Label>Message (optional)</Label>
            <Textarea
              placeholder="Add a personal message to your trade request..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-softspot-500 hover:bg-softspot-600">
              Send Trade Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};