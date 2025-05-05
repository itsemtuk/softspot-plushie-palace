
import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { Navbar } from '@/components/Navbar';
import { useEffect } from 'react';
import { FallbackSignUp } from '@/components/auth/FallbackSignUp';

const SignUp = () => {
  const isClerkConfigured = localStorage.getItem('usingClerk') === 'true';
  
  // Force scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto pt-16 pb-24 px-4">
        {isClerkConfigured ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-center text-softspot-600 mb-8">Join SoftSpot</h1>
            
            <ClerkSignUp
              appearance={{
                elements: {
                  rootBox: "mx-auto w-full",
                  card: "shadow-none p-0",
                  footer: "text-softspot-500",
                  socialButtonsBlockButton: "border border-gray-300 text-gray-700 hover:bg-gray-50",
                  socialButtonsIconButton: "border border-gray-300 hover:bg-gray-50",
                  socialButtonsProviderIcon: "w-5 h-5",
                  formButtonPrimary: "bg-softspot-500 hover:bg-softspot-600",
                  formFieldInput: "border-softspot-200 focus:border-softspot-400 focus:ring-softspot-300"
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
              signInUrl="/sign-in"
            />
            
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>By signing up, you agree to our Terms of Service and Privacy Policy.</p>
              <p className="mt-2">You must be at least 16 years old to create an account.</p>
            </div>
          </div>
        ) : (
          <FallbackSignUp />
        )}
      </div>
    </div>
  );
};

export default SignUp;
