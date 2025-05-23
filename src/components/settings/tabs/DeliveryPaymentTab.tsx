
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function DeliveryPaymentTab({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Delivery & Payment Preferences</h3>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="preferredDeliveryMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Delivery Method</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || "shipping"}
              >
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select delivery method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  <SelectItem value="shipping">Shipping</SelectItem>
                  <SelectItem value="inperson">In-Person Meet Up</SelectItem>
                  <SelectItem value="both">Both Options</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="paymentMethods"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accepted Payment Methods</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || "all"}
              >
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select payment methods" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Payment Methods</SelectItem>
                  <SelectItem value="paypal">PayPal Only</SelectItem>
                  <SelectItem value="card">Credit/Debit Card Only</SelectItem>
                  <SelectItem value="cash">Cash Only (In-Person)</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="shippingAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Shipping Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your default shipping address"
                  {...field}
                  className="bg-white"
                />
              </FormControl>
              <FormDescription>
                This address will be used as your default delivery address for purchases
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
