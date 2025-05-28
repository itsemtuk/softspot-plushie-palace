
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ShippingCostFieldProps {
  register: any;
}

export const ShippingCostField = ({ register }: ShippingCostFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="deliveryCost">Shipping Cost ($)</Label>
      <Input 
        id="deliveryCost"
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00 (free shipping)"
        {...register("deliveryCost", {
          valueAsNumber: true,
          setValueAs: (value: string) => {
            const num = parseFloat(value);
            return isNaN(num) ? 0 : num;
          }
        })}
      />
      <p className="text-sm text-muted-foreground">Enter 0 for free shipping</p>
    </div>
  );
};
