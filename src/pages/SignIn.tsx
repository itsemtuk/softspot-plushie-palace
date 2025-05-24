
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { isAuthenticated } from '@/utils/auth/authState';
import { SignInCard } from '@/components/auth/SignInCard';
import { SignInPromotional } from '@/components/auth/SignInPromotional';

const SignIn = () => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isUsingClerk, setIsUsingClerk] = useState(localStorage.getItem('usingClerk') === 'true');
  
  // Check if already authenticated and redirect if needed
  useEffect(() => {
    const checkAuthAndRedirect = () => {
      if (isAuthenticated()) {
        console.log("User is already authenticated, redirecting to feed");
        navigate('/feed', { replace: true });
        return true;
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
      checkAuthAndRedirect();
    };
    
    window.addEventListener('clerk-auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    
    return () => {
      window.removeEventListener('clerk-auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [navigate, isUsingClerk]);

  // Toggle between auth providers
  const toggleAuthProvider = (newValue: boolean) => {
    localStorage.setItem('usingClerk', newValue.toString());
    setIsUsingClerk(newValue);
  };
  
  // Show loading state while checking auth systems
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
