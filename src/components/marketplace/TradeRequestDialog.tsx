
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MarketplacePlushie, PlushieCondition, PlushieMaterial, PlushieFilling, PlushieSpecies, PlushieBrand } from '@/types/marketplace';
import { toast } from '@/components/ui/use-toast';

interface TradeRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlushie?: MarketplacePlushie;
  userPlushies: MarketplacePlushie[];
}

export const TradeRequestDialog = ({
  isOpen,
  onClose,
  selectedPlushie,
  userPlushies = []
}: TradeRequestDialogProps) => {
  const [selectedUserPlushie, setSelectedUserPlushie] = useState<MarketplacePlushie | null>(null);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);

  const handleClose = () => {
    setStep(1);
    setSelectedUserPlushie(null);
    setMessage('');
    onClose();
  };

  const handlePlushieSelect = (plushie: MarketplacePlushie) => {
    setSelectedUserPlushie(plushie);
  };

  const handleContinue = () => {
    if (selectedUserPlushie) {
      setStep(2);
    } else {
      toast({
        title: "Please select a plushie",
        description: "You need to select one of your plushies to propose a trade.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = () => {
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please add a message to the trade owner.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would send the trade request to the API
    toast({
      title: "Trade request sent!",
      description: "The owner will be notified of your trade request.",
    });

    handleClose();
  };

  if (!selectedPlushie) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Propose a Trade" : "Finalize Trade Request"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Select one of your plushies to propose for a trade."
              : "Send a message to the owner about your trade request."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 border rounded-md bg-gray-50">
              <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-md">
                <img
                  src={selectedPlushie.image}
                  alt={selectedPlushie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{selectedPlushie.title}</h4>
                <p className="text-sm text-gray-500">Owner: {selectedPlushie.username}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
              {userPlushies.length > 0 ? (
                userPlushies.map((plushie) => (
                  <div
                    key={plushie.id}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedUserPlushie?.id === plushie.id
                        ? "border-primary bg-primary/10"
                        : "hover:border-gray-400"
                    }`}
                    onClick={() => handlePlushieSelect(plushie)}
                  >
                    <div className="aspect-square mb-2 overflow-hidden rounded-md">
                      <img
                        src={plushie.image}
                        alt={plushie.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h5 className="font-medium text-sm truncate">{plushie.title}</h5>
                    <p className="text-xs text-gray-500">${plushie.price}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 p-4 text-center border rounded-md">
                  <p>You don't have any plushies listed for trade.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleClose}
                  >
                    Add a Listing First
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 p-3 border rounded-md">
                <div className="flex items-center mb-2">
                  <div className="flex-shrink-0 mr-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=you`} />
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  </div>
                  <p className="text-sm font-medium">Your plushie</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 overflow-hidden rounded-md">
                    <img
                      src={selectedUserPlushie?.image}
                      alt={selectedUserPlushie?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-medium">{selectedUserPlushie?.title}</h5>
                    <p className="text-xs text-gray-500">${selectedUserPlushie?.price}</p>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 font-bold">for</div>

              <div className="flex-1 p-3 border rounded-md">
                <div className="flex items-center mb-2">
                  <div className="flex-shrink-0 mr-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${selectedPlushie.username}`} />
                      <AvatarFallback>{selectedPlushie.username[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <p className="text-sm font-medium">{selectedPlushie.username}'s plushie</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 overflow-hidden rounded-md">
                    <img
                      src={selectedPlushie.image}
                      alt={selectedPlushie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-medium">{selectedPlushie.title}</h5>
                    <p className="text-xs text-gray-500">${selectedPlushie.price}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="trade-message">Message to {selectedPlushie.username}</Label>
              <Textarea
                id="trade-message"
                placeholder={`Hi ${selectedPlushie.username}, I'd like to trade my ${selectedUserPlushie?.title} for your ${selectedPlushie.title}!`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 1 ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleContinue}>Continue</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSubmit}>Send Trade Request</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TradeRequestDialog;
