
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, ShoppingBag, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface PaymentFormProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function PaymentForm({ onSubmit, onBack, isSubmitting }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <Tabs defaultValue="card" onValueChange={setPaymentMethod}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Card</span>
            </TabsTrigger>
            <TabsTrigger value="paypal" className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.384a.641.641 0 0 1 .632-.547h6.914c2.256 0 3.495.702 3.924 1.439.473.796.369 1.817.244 2.483l-.002.012c-.709 3.9-3.058 5.263-6.589 5.263h-.67a.641.641 0 0 0-.632.548l-.736 4.22-1.439 8.263a.127.127 0 0 1-.127.11h-3.37v.003ZM4.502 6.708l-1.493 9.54h2.178l1.492-9.534.005-.026a.127.127 0 0 1 .126-.108h1.217l-.001-.001h.873c2.086 0 3.431-.674 4.079-2.86.308-1.088.244-1.478.193-1.613-.15-.243-.49-.576-1.95-.576H6.529a.641.641 0 0 0-.632.547l-1.362 4.582-.033.049Z" />
                <path fill="currentColor" d="M17.071 9.447c-.028.1-.056.202-.088.31v.001c-.971 4.987-4.353 6.109-8.499 6.109H7.349c-.203 0-.38.142-.427.341L5.458 24h3.368c.203 0 .38-.142.427-.341l.574-3.65.036-.066a.428.428 0 0 1 .426-.342h.893c3.645 0 6.705-.941 7.566-5.259.359-1.795.218-3.116-.677-3.895"/>
              </svg>
              <span className="hidden sm:inline">PayPal</span>
            </TabsTrigger>
            <TabsTrigger value="apple" className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M14.94,5.19A4.38,4.38,0,0,0,16,2,4.44,4.44,0,0,0,13,3.52,4.17,4.17,0,0,0,12,6.61,3.69,3.69,0,0,0,14.94,5.19Zm2.52,7.44a4.51,4.51,0,0,1,2.16-3.81,4.66,4.66,0,0,0-3.66-2c-1.56-.16-3,.91-3.83.91s-2-.89-3.3-.87A4.92,4.92,0,0,0,4.69,9.39C2.93,12.45,4.24,17,6,19.47,6.8,20.68,7.8,22.05,9.12,22s1.75-.82,3.28-.82,2,.82,3.3.79,2.22-1.23,3.06-2.45a11,11,0,0,0,1.38-2.85A4.41,4.41,0,0,1,17.46,12.63Z" />
              </svg>
              <span className="hidden sm:inline">Apple Pay</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="card">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Name on card</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  autoComplete="cc-name"
                  {...register('cardName', { required: 'Card name is required' })}
                  aria-invalid={errors.cardName ? 'true' : 'false'}
                  className={errors.cardName ? 'border-red-500' : ''}
                />
                {errors.cardName && (
                  <p className="text-red-500 text-sm">{errors.cardName.message as string}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  autoComplete="cc-number"
                  {...register('cardNumber', { 
                    required: 'Card number is required',
                    pattern: {
                      value: /^[0-9]{16}$/,
                      message: 'Please enter a valid card number'
                    }
                  })}
                  aria-invalid={errors.cardNumber ? 'true' : 'false'}
                  className={errors.cardNumber ? 'border-red-500' : ''}
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm">{errors.cardNumber.message as string}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expDate">Expiration date</Label>
                  <Input
                    id="expDate"
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                    {...register('expDate', { 
                      required: 'Expiration date is required',
                      pattern: {
                        value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                        message: 'Please use MM/YY format'
                      }
                    })}
                    aria-invalid={errors.expDate ? 'true' : 'false'}
                    className={errors.expDate ? 'border-red-500' : ''}
                  />
                  {errors.expDate && (
                    <p className="text-red-500 text-sm">{errors.expDate.message as string}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="password"
                    placeholder="123"
                    autoComplete="cc-csc"
                    maxLength={4}
                    {...register('cvv', { 
                      required: 'CVV is required',
                      pattern: {
                        value: /^[0-9]{3,4}$/,
                        message: 'CVV must be 3 or 4 digits'
                      }
                    })}
                    aria-invalid={errors.cvv ? 'true' : 'false'}
                    className={errors.cvv ? 'border-red-500' : ''}
                  />
                  {errors.cvv && (
                    <p className="text-red-500 text-sm">{errors.cvv.message as string}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-gray-600">Secure payment</span>
                </div>
                <div className="flex gap-2">
                  <img src="/assets/visa.svg" alt="Visa" className="h-6" />
                  <img src="/assets/mastercard.svg" alt="Mastercard" className="h-6" />
                  <img src="/assets/amex.svg" alt="American Express" className="h-6" />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={onBack}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-softspot-500 hover:bg-softspot-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Pay Now'}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="paypal">
            <div className="py-8 flex flex-col items-center justify-center">
              <svg className="h-12 mb-4" viewBox="0 0 24 24">
                <path fill="#003087" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.384a.641.641 0 0 1 .632-.547h6.914c2.256 0 3.495.702 3.924 1.439.473.796.369 1.817.244 2.483l-.002.012c-.709 3.9-3.058 5.263-6.589 5.263h-.67a.641.641 0 0 0-.632.548l-.736 4.22-1.439 8.263a.127.127 0 0 1-.127.11h-3.37v.003ZM4.502 6.708l-1.493 9.54h2.178l1.492-9.534.005-.026a.127.127 0 0 1 .126-.108h1.217l-.001-.001h.873c2.086 0 3.431-.674 4.079-2.86.308-1.088.244-1.478.193-1.613-.15-.243-.49-.576-1.95-.576H6.529a.641.641 0 0 0-.632.547l-1.362 4.582-.033.049Z" />
                <path fill="#003087" d="M17.071 9.447c-.028.1-.056.202-.088.31v.001c-.971 4.987-4.353 6.109-8.499 6.109H7.349c-.203 0-.38.142-.427.341L5.458 24h3.368c.203 0 .38-.142.427-.341l.574-3.65.036-.066a.428.428 0 0 1 .426-.342h.893c3.645 0 6.705-.941 7.566-5.259.359-1.795.218-3.116-.677-3.895"/>
              </svg>
              <p className="text-gray-600 mb-6">Click the button below to pay with PayPal</p>
              <Button 
                className="bg-[#0070BA] hover:bg-[#005ea6] min-w-[200px]"
                onClick={() => onSubmit({ method: 'paypal' })}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Pay with PayPal'}
              </Button>
              <div className="mt-4 flex items-center justify-center">
                <Button 
                  variant="ghost" 
                  className="text-sm"
                  onClick={onBack}
                  disabled={isSubmitting}
                >
                  Back to shipping
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="apple">
            <div className="py-8 flex flex-col items-center justify-center">
              <svg className="h-12 mb-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M14.94,5.19A4.38,4.38,0,0,0,16,2,4.44,4.44,0,0,0,13,3.52,4.17,4.17,0,0,0,12,6.61,3.69,3.69,0,0,0,14.94,5.19Zm2.52,7.44a4.51,4.51,0,0,1,2.16-3.81,4.66,4.66,0,0,0-3.66-2c-1.56-.16-3,.91-3.83.91s-2-.89-3.3-.87A4.92,4.92,0,0,0,4.69,9.39C2.93,12.45,4.24,17,6,19.47,6.8,20.68,7.8,22.05,9.12,22s1.75-.82,3.28-.82,2,.82,3.3.79,2.22-1.23,3.06-2.45a11,11,0,0,0,1.38-2.85A4.41,4.41,0,0,1,17.46,12.63Z" />
              </svg>
              <p className="text-gray-600 mb-6">Click the button below to pay with Apple Pay</p>
              <Button 
                className="bg-black hover:bg-gray-800 min-w-[200px]"
                onClick={() => onSubmit({ method: 'apple-pay' })}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Pay with Apple Pay'}
              </Button>
              <div className="mt-4 flex items-center justify-center">
                <Button 
                  variant="ghost" 
                  className="text-sm"
                  onClick={onBack}
                  disabled={isSubmitting}
                >
                  Back to shipping
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
