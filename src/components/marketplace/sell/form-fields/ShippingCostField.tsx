
import { FormControl, FormDescription, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ShippingCostFieldProps {
  register: any;
}

export const ShippingCostField = ({ register }: ShippingCostFieldProps) => {
  return (
    <FormItem>
      <FormLabel htmlFor="deliveryCost">Shipping Cost ($)</FormLabel>
      <FormControl>
        <Input 
          id="deliveryCost"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00 (free shipping)"
          {...register("deliveryCost")}
        />
      </FormControl>
      <FormDescription>Enter 0 for free shipping</FormDescription>
    </FormItem>
  );
};
