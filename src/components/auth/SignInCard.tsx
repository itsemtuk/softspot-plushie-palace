
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ClerkSignInComponent } from './ClerkSignInComponent';

interface SignInCardProps {
  isMobile: boolean;
}

export const SignInCard: FC<SignInCardProps> = ({ 
  isMobile 
}) => {
  const cardStyles = isMobile ? "border-softspot-200 shadow-lg mx-4" : "border-softspot-200 shadow-lg";

  return (
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
        <ClerkSignInComponent />
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
  );
};
