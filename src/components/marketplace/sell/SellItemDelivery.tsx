
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SellItemDeliveryProps {
  formData: {
    delivery_method: string;
    delivery_cost: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export const SellItemDelivery = ({ formData, onInputChange }: SellItemDeliveryProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="delivery_method">Delivery Method</Label>
          <Select value={formData.delivery_method} onValueChange={(value) => onInputChange('delivery_method', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shipping">Shipping</SelectItem>
              <SelectItem value="pickup">Local Pickup</SelectItem>
              <SelectItem value="both">Both Available</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="delivery_cost">Delivery Cost ($)</Label>
          <Input
            id="delivery_cost"
            type="number"
            step="0.01"
            value={formData.delivery_cost}
            onChange={(e) => onInputChange('delivery_cost', e.target.value)}
            placeholder="0.00"
          />
        </div>
      </div>
    </div>
  );
};
