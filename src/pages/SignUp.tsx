
import { SignUp as ClerkSignUp, useClerk } from '@clerk/clerk-react';
import { Navbar } from '@/components/Navbar';
import { useEffect } from 'react';
import { FallbackSignUp } from '@/components/auth/FallbackSignUp';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { setAuthenticatedUser } from '@/utils/auth/authState';

const SignUp = () => {
  const isClerkConfigured = localStorage.getItem('usingClerk') === 'true';
  const navigate = useNavigate();
  const clerk = isClerkConfigured ? useClerk() : null;
  
  // Force scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Function to handle after sign up
  const handleAfterSignUp = (userData: any) => {
    try {
      console.log('User signed up successfully:', userData?.id);
      
      if (userData && userData.id) {
        setAuthenticatedUser({
          userId: userData.id,
          username: userData.username || userData.firstName || 'User',
          status: 'online',
          provider: 'clerk'
        });
        
        if (userData.imageUrl) {
          localStorage.setItem('userAvatarUrl', userData.imageUrl);
        }
        
        // Navigate to onboarding
        navigate('/onboarding');
        
        toast({
          title: "Account created successfully",
          description: "Welcome to SoftSpot!"
        });
      }
    } catch (error) {
      console.error('Error during sign up:', error);
    }
  };
  
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
                  socialButtonsBlockButton: "border border-gray-300 text-gray-700",
                  socialButtonsIconButton: "border border-gray-300",
                  formButtonPrimary: "bg-softspot-500 hover:bg-softspot-600"
                },
                variables: {
                  colorPrimary: "#7e69ab",
                  colorText: "#333333",
                }
              }}
              signInUrl="/sign-in"
              afterSignInUrl="/feed"
              afterSignUpUrl="/onboarding"
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
