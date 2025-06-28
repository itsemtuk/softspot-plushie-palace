
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { SignInCard } from '@/components/auth/SignInCard';
import { SignInPromotional } from '@/components/auth/SignInPromotional';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { isAuthenticated } from '@/utils/auth/authState';

const SignIn = () => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [hasClerkError, setHasClerkError] = useState(false);
  const navigate = useNavigate();
  const [isUsingClerk, setIsUsingClerk] = useState(localStorage.getItem('usingClerk') === 'true');
  const [isSignedIn, setIsSignedIn] = useState(false);
  
  // Check if Clerk is available
  const isClerkAvailable = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  useEffect(() => {
    const checkAuthStatus = () => {
      // Check authentication status using centralized auth state
      const authStatus = isAuthenticated();
      setIsSignedIn(authStatus);
      setIsLoading(false);
    };

    // Initial check
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

  const toggleAuthProvider = (newValue: boolean) => {
    try {
      localStorage.setItem('usingClerk', newValue.toString());
      setIsUsingClerk(newValue);
      setHasClerkError(false);
    } catch (error) {
      console.error("Error switching auth provider:", error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto pt-16 pb-24 px-4 flex justify-center items-center flex-col">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-softspot-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className={`max-w-md mx-auto pt-16 pb-24 ${isMobile ? 'px-0' : 'px-4'}`}>
        {hasClerkError && (
          <Alert variant="destructive" className="mb-4 mx-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Authentication service is experiencing issues. You may need to refresh the page or clear your browser cookies.
            </AlertDescription>
          </Alert>
        )}
        
        <SignInCard 
          isUsingClerk={isUsingClerk && isClerkAvailable}
          onToggleAuth={toggleAuthProvider}
          isMobile={isMobile}
        />
        <SignInPromotional />
      </div>
    </div>
  );
};

export default SignIn;
