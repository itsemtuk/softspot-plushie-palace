
import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { Navbar } from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!isLoaded) return;

    if (isSignedIn) {
      navigate('/feed', { replace: true });
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [isLoaded, isSignedIn, navigate]);
  
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-md mx-auto pt-16 pb-24 px-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-softspot-600"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto pt-16 pb-24 px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center text-softspot-600 mb-8">Join SoftSpot</h1>
          
          <ClerkSignUp
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "shadow-none p-0",
                footer: "text-softspot-500",
                socialButtonsBlockButton: "border border-gray-300 text-gray-700 hover:bg-gray-50",
                socialButtonsIconButton: "border border-gray-300 hover:bg-gray-50 w-14 h-14 flex items-center justify-center m-2", 
                socialButtonsProviderIcon: "w-8 h-8",
                formButtonPrimary: "bg-softspot-500 hover:bg-softspot-600",
                formFieldInput: "border-softspot-200 focus:border-softspot-400 focus:ring-softspot-300",
                socialButtonsBlockButtonText: "text-base font-medium",
                formField: "mb-6"
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
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>By signing up, you agree to our Terms of Service and Privacy Policy.</p>
            <p className="mt-2">You must be at least 16 years old to create an account.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
