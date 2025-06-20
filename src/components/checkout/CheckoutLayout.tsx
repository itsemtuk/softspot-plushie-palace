
import React from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { CheckoutProgress } from "./CheckoutProgress";

interface CheckoutLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
}

export function CheckoutLayout({ children, currentStep, totalSteps }: CheckoutLayoutProps) {
  return (
    <MainLayout noPadding={false}>
      <div className="max-w-md mx-auto py-6 px-4">
        <CheckoutProgress currentStep={currentStep} totalSteps={totalSteps} />
        <div className="mt-6">
          {children}
        </div>
      </div>
    </MainLayout>
  );
}
