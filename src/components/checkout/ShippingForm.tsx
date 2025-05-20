
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countryCodes } from "./countryCodes";

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void;
  isSubmitting: boolean;
}

export interface ShippingFormData {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  email: string;
  phone?: string;
}

export function ShippingForm({ onSubmit, isSubmitting }: ShippingFormProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ShippingFormData>({
    defaultValues: {
      country: 'US',
      fullName: '',
      addressLine1: '',
      city: '',
      state: '',
      postalCode: '',
      email: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          placeholder="Enter your full name"
          autoComplete="name"
          {...register('fullName', {
            required: 'Full name is required'
          })}
          aria-invalid={errors.fullName ? 'true' : 'false'}
          className={errors.fullName ? 'border-red-500' : ''}
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm">{errors.fullName.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          autoComplete="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          aria-invalid={errors.email ? 'true' : 'false'}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="(123) 456-7890"
          autoComplete="tel"
          {...register('phone')}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select defaultValue="US" onValueChange={(value) => {}}>
          <SelectTrigger id="country" className="w-full">
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {countryCodes.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="addressLine1">Address Line 1</Label>
        <Input
          id="addressLine1"
          placeholder="Street address, P.O. box"
          autoComplete="address-line1"
          {...register('addressLine1', {
            required: 'Address is required'
          })}
          aria-invalid={errors.addressLine1 ? 'true' : 'false'}
          className={errors.addressLine1 ? 'border-red-500' : ''}
        />
        {errors.addressLine1 && (
          <p className="text-red-500 text-sm">{errors.addressLine1.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
        <Input
          id="addressLine2"
          placeholder="Apartment, suite, unit, building, floor, etc."
          autoComplete="address-line2"
          {...register('addressLine2')}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="City"
            autoComplete="address-level2"
            {...register('city', {
              required: 'City is required'
            })}
            aria-invalid={errors.city ? 'true' : 'false'}
            className={errors.city ? 'border-red-500' : ''}
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state">State/Province</Label>
          <Input
            id="state"
            placeholder="State/Province"
            autoComplete="address-level1"
            {...register('state', {
              required: 'State is required'
            })}
            aria-invalid={errors.state ? 'true' : 'false'}
            className={errors.state ? 'border-red-500' : ''}
          />
          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state.message}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="postalCode">ZIP / Postal Code</Label>
        <Input
          id="postalCode"
          placeholder="Postal code"
          autoComplete="postal-code"
          {...register('postalCode', {
            required: 'Postal code is required'
          })}
          aria-invalid={errors.postalCode ? 'true' : 'false'}
          className={errors.postalCode ? 'border-red-500' : ''}
        />
        {errors.postalCode && (
          <p className="text-red-500 text-sm">{errors.postalCode.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 text-base bg-softspot-500 hover:bg-softspot-600 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processing...' : 'Continue to Payment'}
      </Button>
    </form>
  );
}
