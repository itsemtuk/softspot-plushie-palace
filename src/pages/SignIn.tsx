
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { Navbar } from '@/components/Navbar';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const SignIn = () => {
  // Force scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-md mx-auto pt-16 pb-24 px-4">
        <Card className="border-softspot-200 shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold text-softspot-600">SoftSpot</span>
              <div className="h-8 w-8 rounded-full bg-softspot-200 flex items-center justify-center ml-2 animate-float">
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
              redirectUrl="/feed"
              signUpUrl="/sign-up"
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
