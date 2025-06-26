
import { Navbar } from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  
  // Check if Clerk is available
  const isClerkAvailable = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const checkAuthStatus = async () => {
      if (isClerkAvailable) {
        try {
          // Since we can't use Clerk hooks conditionally, we'll check localStorage
          const authStatus = localStorage.getItem('authStatus');
          setIsSignedIn(authStatus === 'authenticated');
        } catch (error) {
          console.error('Error checking auth status:', error);
          setIsSignedIn(false);
        }
      } else {
        // When Clerk is not available, check localStorage for auth status
        const authStatus = localStorage.getItem('authStatus');
        setIsSignedIn(authStatus === 'authenticated');
      }
      setIsLoaded(true);
    };

    checkAuthStatus();
  }, [isClerkAvailable]);

  useEffect(() => {
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
          
          {isClerkAvailable ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Authentication is being set up. Please check back later.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Sign up functionality is not available yet. Please use the fallback authentication.
              </p>
            </div>
          )}
          
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
