import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarketplacePlushie } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";
import { Percent, Tag } from "lucide-react";

interface DiscountDialogProps {
  item: MarketplacePlushie;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyDiscount: (itemId: string, discountType: string, discountValue: number) => Promise<void>;
}

export function DiscountDialog({ item, open, onOpenChange, onApplyDiscount }: DiscountDialogProps) {
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const originalPrice = item.price || 0;
  
  const calculateDiscountedPrice = () => {
    const value = parseFloat(discountValue);
    if (isNaN(value) || value <= 0) return originalPrice;
    
    if (discountType === 'percentage') {
      if (value > 100) return 0;
      return originalPrice - (originalPrice * (value / 100));
    } else {
      return Math.max(0, originalPrice - value);
    }
  };
  
  const discountedPrice = calculateDiscountedPrice();
  const validDiscount = discountValue !== '' && !isNaN(parseFloat(discountValue)) && parseFloat(discountValue) > 0;
  
  const handleSubmit = async () => {
    if (!validDiscount) {
      toast({
        title: "Invalid discount",
        description: "Please enter a valid discount value",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onApplyDiscount(
        item.id, 
        discountType, 
        parseFloat(discountValue)
      );
      
      toast({
        title: "Discount applied",
        description: `Your item is now listed at $${discountedPrice.toFixed(2)}`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error applying discount:", error);
      toast({
        title: "Error applying discount",
        description: "Could not apply discount. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Tag className="h-5 w-5 mr-2 text-softspot-500" />
            Apply Discount
          </DialogTitle>
          <DialogDescription>
            Create a special offer for your listing "{item.title}".
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="originalPrice" className="text-right">
              Original Price
            </Label>
            <Input 
              id="originalPrice"
              value={`$${originalPrice.toFixed(2)}`}
              disabled
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discountType" className="text-right">
              Discount Type
            </Label>
            <Select 
              value={discountType}
              onValueChange={(value) => setDiscountType(value as 'percentage' | 'fixed')}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select discount type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage (%)</SelectItem>
                <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discountValue" className="text-right">
              Discount Value
            </Label>
            <div className="col-span-3 flex items-center">
              <Input 
                id="discountValue"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                type="number"
                min="0"
                max={discountType === 'percentage' ? "100" : undefined}
                step="0.01"
                placeholder={discountType === 'percentage' ? "e.g. 10%" : "e.g. $5.00"}
                className="flex-1"
              />
              <span className="ml-2 text-lg font-medium">{discountType === 'percentage' ? '%' : '$'}</span>
            </div>
          </div>
          
          <div className="mt-2 bg-softspot-50 rounded-md p-3">
            <div className="flex items-center justify-between text-sm">
              <span>New price after discount:</span>
              <span className="font-bold text-softspot-600">${discountedPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
              <span>Savings:</span>
              <span>${(originalPrice - discountedPrice).toFixed(2)} 
                {discountType === 'percentage' && discountValue && !isNaN(parseFloat(discountValue)) && (
                  <span className="ml-1">({discountValue}% off)</span>
                )}
              </span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isSubmitting || !validDiscount}
            className="bg-softspot-500 hover:bg-softspot-600"
          >
            {isSubmitting ? (
              <>Applying...</>
            ) : (
              <>
                <Percent className="mr-2 h-4 w-4" />
                Apply Discount
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DiscountDialog;
