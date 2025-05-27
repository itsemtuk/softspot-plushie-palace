
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { isAuthenticated } from '@/utils/auth/authState';
import { SignInCard } from '@/components/auth/SignInCard';
import { SignInPromotional } from '@/components/auth/SignInPromotional';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const SignIn = () => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [hasClerkError, setHasClerkError] = useState(false);
  const navigate = useNavigate();
  const [isUsingClerk, setIsUsingClerk] = useState(localStorage.getItem('usingClerk') === 'true');
  const { isLoaded, isSignedIn } = useUser();
  
  // Check if already authenticated and redirect if needed
  useEffect(() => {
    const checkAuthAndRedirect = () => {
      try {
        // Check Clerk auth if configured
        if (isUsingClerk && isLoaded) {
          if (isSignedIn) {
            console.log("Clerk user is already authenticated, redirecting to feed");
            navigate('/feed', { replace: true });
            return true;
          }
        } else if (!isUsingClerk) {
          // Check local auth
          if (isAuthenticated()) {
            console.log("User is already authenticated, redirecting to feed");
            navigate('/feed', { replace: true });
            return true;
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setHasClerkError(true);
      }
      return false;
    };
    
    // Don't show loading if already redirecting
    if (!checkAuthAndRedirect()) {
      // Small delay to ensure authentication providers have time to initialize
      setTimeout(() => {
        setIsLoading(false);
        console.log("SignIn page - showing authentication UI");
      }, 500);
    }
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      try {
        checkAuthAndRedirect();
      } catch (error) {
        console.error("Auth change error:", error);
        setHasClerkError(true);
      }
    };
    
    window.addEventListener('clerk-auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    
    return () => {
      window.removeEventListener('clerk-auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [navigate, isUsingClerk, isLoaded, isSignedIn]);

  // Toggle between auth providers
  const toggleAuthProvider = (newValue: boolean) => {
    try {
      localStorage.setItem('usingClerk', newValue.toString());
      setIsUsingClerk(newValue);
      setHasClerkError(false); // Reset error when switching
    } catch (error) {
      console.error("Error switching auth provider:", error);
    }
  };
  
  // Show loading state while checking auth systems
  if (isLoading || (isUsingClerk && !isLoaded)) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto pt-16 pb-24 px-4 flex justify-center items-center flex-col">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-softspot-600"></div>
          <p className="mt-4 text-gray-600">Checking authentication status...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className={`max-w-md mx-auto pt-16 pb-24 ${isMobile ? 'px-0' : 'px-4'}`}>
        {hasClerkError && (
          <Alert variant="warning" className="mb-4 mx-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Authentication service is experiencing issues. You may need to refresh the page or clear your browser cookies.
            </AlertDescription>
          </Alert>
        )}
        
        <SignInCard 
          isUsingClerk={isUsingClerk}
          onToggleAuth={toggleAuthProvider}
          isMobile={isMobile}
        />
        <SignInPromotional />
      </div>
    </div>
  );
};

export default SignIn;
