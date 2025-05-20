
import React from 'react';
import { cn } from "@/lib/utils";

interface CheckoutProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function CheckoutProgress({ currentStep, totalSteps }: CheckoutProgressProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map(step => (
          <div key={step} className="flex flex-col items-center">
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                step === currentStep 
                  ? "bg-softspot-500 text-white" 
                  : step < currentStep 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-200 text-gray-500"
              )}
            >
              {step < currentStep ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                step
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {step === 1 ? 'Details' : step === 2 ? 'Payment' : 'Confirm'}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 h-1 flex">
        {steps.slice(0, -1).map((step, index) => (
          <div 
            key={step} 
            className={cn(
              "flex-1 h-full",
              step < currentStep ? "bg-green-500" : "bg-gray-200"
            )}
          />
        ))}
      </div>
    </div>
  );
}
