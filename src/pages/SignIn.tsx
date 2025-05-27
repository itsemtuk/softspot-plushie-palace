
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { useIsMobile } from '@/hooks/use-mobile';
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
    if (!isLoaded) return;

    if (isSignedIn) {
      console.log("User is already authenticated, redirecting to feed");
      navigate('/feed', { replace: true });
      return;
    }

    // Show the sign-in form if not authenticated
    setIsLoading(false);
  }, [isLoaded, isSignedIn, navigate]);

  // Toggle between auth providers
  const toggleAuthProvider = (newValue: boolean) => {
    try {
      localStorage.setItem('usingClerk', newValue.toString());
      setIsUsingClerk(newValue);
      setHasClerkError(false);
    } catch (error) {
      console.error("Error switching auth provider:", error);
    }
  };
  
  // Show loading state while checking auth
  if (!isLoaded || isLoading) {
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
