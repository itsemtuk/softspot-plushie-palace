
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';

export const ClerkSignInComponent = () => {
  return (
    <div className="w-full">
      <ClerkSignIn 
        routing="virtual"
        signUpUrl="/sign-up"
        forceRedirectUrl="/feed"
        appearance={{
          elements: {
            rootBox: "mx-auto w-full",
            card: "shadow-none p-0 bg-transparent",
            footer: "text-softspot-500",
            formButtonPrimary: "bg-softspot-500 hover:bg-softspot-600",
            formFieldInput: "border-softspot-200 focus:border-softspot-400 focus:ring-softspot-300",
            footerActionLink: "text-softspot-500 hover:text-softspot-600",
            socialButtonsBlockButton: "border border-gray-300 text-gray-700 hover:bg-gray-50",
            socialButtonsIconButton: "border border-gray-300 hover:bg-gray-50 w-14 h-14 flex items-center justify-center m-2", 
            socialButtonsProviderIcon: "w-8 h-8",
            socialButtonsBlockButtonText: "text-base font-medium",
            formField: "mb-6",
            headerTitle: "text-2xl font-bold text-softspot-600",
            headerSubtitle: "text-gray-500"
          },
          variables: {
            colorPrimary: "#7e69ab",
            colorText: "#333333",
          },
          layout: {
            socialButtonsVariant: "iconButton",
            socialButtonsPlacement: "bottom"
          }
        }}
      />
    </div>
  );
};
