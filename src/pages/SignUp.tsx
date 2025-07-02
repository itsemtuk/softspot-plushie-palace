
import { Navbar } from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClerkSignUpComponent } from '@/components/auth/ClerkSignUpComponent';
import { isAuthenticated } from '@/utils/auth/authState';
import { useIsMobile } from '@/hooks/use-mobile';

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Check if Clerk is available
  const isClerkAvailable = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = isAuthenticated();
      setIsSignedIn(authStatus);
      setIsLoading(false);
    };

    checkAuthStatus();
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('clerk-auth-change', handleAuthChange);
    window.addEventListener('auth-state-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('clerk-auth-change', handleAuthChange);
      window.removeEventListener('auth-state-change', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && isSignedIn) {
      navigate('/feed', { replace: true });
    }
  }, [isLoading, isSignedIn, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto pt-16 pb-24 px-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-softspot-600"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className={`max-w-md mx-auto pt-16 pb-24 ${isMobile ? 'px-0' : 'px-4'}`}>
        {isClerkAvailable ? (
          <div className="bg-white rounded-lg shadow-md p-4">
            <ClerkSignUpComponent />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-center text-softspot-600 mb-8">Join SoftSpot</h1>
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Sign up functionality is not available yet. Please use the fallback authentication.
              </p>
            </div>
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>By signing up, you agree to our Terms of Service and Privacy Policy.</p>
              <p className="mt-2">You must be at least 16 years old to create an account.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
