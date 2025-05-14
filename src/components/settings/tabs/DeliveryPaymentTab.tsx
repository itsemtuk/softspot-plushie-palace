
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Package, Home } from "lucide-react";

export const DeliveryPaymentTab = ({ form }: { form: any }) => {
  return (
    <div className="space-y-6">
      {/* Billing Address */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Home className="h-5 w-5 mr-2 text-softspot-500" />
            <CardTitle>Billing Address</CardTitle>
          </div>
          <CardDescription>
            Your billing address will be used for invoices and payment processing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="billingAddress.fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billingAddress.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="billingAddress.addressLine1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 1</FormLabel>
                <FormControl>
                  <Input placeholder="Street address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="billingAddress.addressLine2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 2</FormLabel>
                <FormControl>
                  <Input placeholder="Apt, suite, etc. (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="billingAddress.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billingAddress.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billingAddress.zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input placeholder="ZIP Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-softspot-500" />
            <CardTitle>Shipping Address</CardTitle>
          </div>
          <CardDescription>
            Your shipping address will be used for delivering products you purchase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="sameAsBilling"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Same as Billing Address</FormLabel>
                  <FormDescription>
                    Use your billing address for shipping
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {!form.watch("sameAsBilling") && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="shippingAddress.fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingAddress.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="shippingAddress.addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shippingAddress.addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Apt, suite, etc. (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="shippingAddress.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingAddress.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingAddress.zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input placeholder="ZIP Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-softspot-500" />
            <CardTitle>Payment Options</CardTitle>
          </div>
          <CardDescription>
            Manage your payment methods for buying and selling plushies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="preferredPaymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Payment Method</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="apple_pay">Apple Pay</SelectItem>
                    <SelectItem value="google_pay">Google Pay</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  This will be your default method when making purchases.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acceptedPaymentMethods"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accepted Payment Methods (For Sellers)</FormLabel>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="credit_card_accept"
                      checked={field.value?.includes("credit_card")}
                      onCheckedChange={(checked) => {
                        const currentValues = field.value || [];
                        field.onChange(
                          checked
                            ? [...currentValues, "credit_card"]
                            : currentValues.filter((v: string) => v !== "credit_card")
                        );
                      }}
                    />
                    <label htmlFor="credit_card_accept" className="text-sm font-medium">
                      Credit Card
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="paypal_accept"
                      checked={field.value?.includes("paypal")}
                      onCheckedChange={(checked) => {
                        const currentValues = field.value || [];
                        field.onChange(
                          checked
                            ? [...currentValues, "paypal"]
                            : currentValues.filter((v: string) => v !== "paypal")
                        );
                      }}
                    />
                    <label htmlFor="paypal_accept" className="text-sm font-medium">
                      PayPal
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="digital_wallet_accept"
                      checked={field.value?.includes("digital_wallet")}
                      onCheckedChange={(checked) => {
                        const currentValues = field.value || [];
                        field.onChange(
                          checked
                            ? [...currentValues, "digital_wallet"]
                            : currentValues.filter((v: string) => v !== "digital_wallet")
                        );
                      }}
                    />
                    <label htmlFor="digital_wallet_accept" className="text-sm font-medium">
                      Digital Wallets (Apple Pay, Google Pay)
                    </label>
                  </div>
                </div>
                <FormDescription>
                  Select which payment methods you're willing to accept when selling items.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Separator className="my-4" />
          
          <FormField
            control={form.control}
            name="payoutInformation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payout Information</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Add details for how you'd like to receive payments from sales."
                    className="min-h-[80px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  This information will only be shared with buyers after a purchase is confirmed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      
      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
          <CardDescription>
            Secure your account with an extra layer of protection.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="twoFactorEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Enable Two-Factor Authentication</FormLabel>
                  <FormDescription>
                    Protect your account with an additional security layer
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {form.watch("twoFactorEnabled") && (
            <div className="rounded-lg border p-4 bg-gray-50">
              <p className="text-sm text-gray-700 mb-4">To setup 2FA:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li>We'll send a verification code to your email</li>
                <li>Enter the code to verify your identity</li>
                <li>You'll be asked for a verification code each time you log in from a new device</li>
              </ol>
              
              <Button variant="outline" className="mt-4">
                Complete 2FA Setup
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryPaymentTab;
