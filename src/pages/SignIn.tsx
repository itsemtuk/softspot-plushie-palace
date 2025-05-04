
import { SignIn as ClerkSignIn, useClerk } from '@clerk/clerk-react';
import { Navbar } from '@/components/Navbar';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { FallbackSignIn } from '@/components/auth/FallbackSignIn';
import { toast } from '@/components/ui/use-toast';
import { setAuthenticatedUser } from '@/utils/auth/authState';

const SignIn = () => {
  const isMobile = useIsMobile();
  const isClerkConfigured = localStorage.getItem('usingClerk') === 'true';
  const navigate = useNavigate();
  const clerk = isClerkConfigured ? useClerk() : null;
  
  // Force scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Function to handle after sign in
  const handleAfterSignIn = (userData: any) => {
    try {
      console.log('User signed in successfully:', userData?.id);
      
      // Store user data in localStorage for components that don't have access to Clerk context
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
        
        // Navigate to feed page
        navigate('/feed');
        
        toast({
          title: "Signed in successfully",
          description: "Welcome to SoftSpot!"
        });
      }
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };
  
  const cardStyles = isMobile ? "border-softspot-200 shadow-lg mx-4" : "border-softspot-200 shadow-lg";
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className={`max-w-md mx-auto pt-16 pb-24 ${isMobile ? 'px-0' : 'px-4'}`}>
        {isClerkConfigured ? (
          <Card className={cardStyles}>
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-center">
                <span className="text-2xl font-bold text-softspot-600">SoftSpot</span>
                <div className="h-8 w-8 rounded-full bg-softspot-200 flex items-center justify-center ml-2">
                  <span className="text-lg">🧸</span>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-softspot-600">Welcome Back</CardTitle>
              <CardDescription className="text-center text-gray-500">
                Sign in to continue your plushie journey
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <ClerkSignIn 
                appearance={{
                  elements: {
                    rootBox: "mx-auto w-full",
                    card: "shadow-none p-0",
                    footer: "text-softspot-500",
                    formButtonPrimary: "bg-softspot-500 hover:bg-softspot-600",
                    formFieldInput: "border-softspot-200 focus:border-softspot-400 focus:ring-softspot-300",
                    footerActionLink: "text-softspot-500 hover:text-softspot-600"
                  },
                  variables: {
                    colorPrimary: "#7e69ab",
                    colorText: "#333333",
                  }
                }}
                signUpUrl="/sign-up"
                afterSignInUrl="/feed"
                afterSignUpUrl="/onboarding"
              />
            </CardContent>
            
            <CardFooter className="flex flex-col items-center gap-4 border-t pt-6">
              <p className="text-sm text-gray-500">Don't have an account?</p>
              <Link 
                to="/sign-up"
                className="inline-flex h-9 items-center justify-center rounded-md bg-softspot-100 px-4 py-2 text-sm font-medium text-softspot-700 transition-colors hover:bg-softspot-200 hover:text-softspot-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-softspot-400"
              >
                Sign up for free
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <FallbackSignIn />
        )}
        
        <div className="mt-8 space-y-4">
          <div className="bg-card p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-foreground mb-2">Join our community</h3>
            <p className="text-sm text-muted-foreground">
              Connect with plushie enthusiasts, trade collectibles, and show off your collection.
            </p>
          </div>
          
          <div className="bg-card p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-foreground mb-2">Find rare plushies</h3>
            <p className="text-sm text-muted-foreground">
              Browse our marketplace for limited edition and hard-to-find plushies from collectors worldwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
