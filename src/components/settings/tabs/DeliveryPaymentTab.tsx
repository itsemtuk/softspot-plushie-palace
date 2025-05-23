
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, CreditCard } from "lucide-react";

export function DeliveryPaymentTab({ form }: { form: UseFormReturn<any> }) {
  return (
    <div className="space-y-6">
      <Card className="bg-white rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Truck className="h-5 w-5 mr-2 text-softspot-500" />
            Delivery Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel>Full Name</FormLabel>
              <Input placeholder="Your full name" />
            </div>
            <div className="space-y-2">
              <FormLabel>Phone Number</FormLabel>
              <Input placeholder="Your phone number" />
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel>Address Line 1</FormLabel>
            <Input placeholder="Street address" />
          </div>
          
          <div className="space-y-2">
            <FormLabel>Address Line 2</FormLabel>
            <Input placeholder="Apartment, suite, etc. (optional)" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <FormLabel>City</FormLabel>
              <Input placeholder="City" />
            </div>
            <div className="space-y-2">
              <FormLabel>State/Province</FormLabel>
              <Input placeholder="State/Province" />
            </div>
            <div className="space-y-2">
              <FormLabel>Postal Code</FormLabel>
              <Input placeholder="Postal code" />
            </div>
          </div>
          
          <div className="space-y-2">
            <FormLabel>Country</FormLabel>
            <Select defaultValue="us">
              <SelectTrigger className="rounded-md">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-md">
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-softspot-500" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            You haven't added any payment methods yet.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-2">Add Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormLabel>Card Number</FormLabel>
                <Input placeholder="**** **** **** ****" />
              </div>
              <div className="space-y-2">
                <FormLabel>Name on Card</FormLabel>
                <Input placeholder="Your full name" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <FormLabel>Expiration Date</FormLabel>
                <Input placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <FormLabel>Security Code</FormLabel>
                <Input placeholder="CVC" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
