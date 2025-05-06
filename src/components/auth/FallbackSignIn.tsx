
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { Facebook, Apple } from 'lucide-react';
import { setAuthenticatedUser } from '@/utils/auth/authState';

export function FallbackSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isClerkConfigured = localStorage.getItem('usingClerk') === 'true';

  // Clear any stale auth state on mount
  useEffect(() => {
    if (isClerkConfigured) {
      // For Clerk integration, we don't want stale local data
      // interfering with Clerk's state management
      const currentTimestamp = new Date().getTime();
      const lastLoginStr = localStorage.getItem('lastLoginTimestamp');
      
      if (lastLoginStr) {
        const lastLogin = parseInt(lastLoginStr, 10);
        const hoursSinceLogin = (currentTimestamp - lastLogin) / (1000 * 60 * 60);
        
        // If it's been more than 24 hours, clear the stored credentials
        if (hoursSinceLogin > 24) {
          console.log("Clearing stale auth data");
          localStorage.removeItem('currentUserId');
          localStorage.removeItem('currentUsername');
          localStorage.removeItem('userStatus');
        }
      }
    }
  }, [isClerkConfigured]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    if (isClerkConfigured) {
      // If using Clerk, show a toast explaining that this would
      // normally use Clerk's authentication
      toast({
        title: "Clerk Authentication",
        description: "In a production app, this would use Clerk's authentication. Using mock implementation for now."
      });
    }
    
    // Mock sign-in - in a real app this would verify with a backend
    setTimeout(() => {
      // Store demo user details using our centralized auth state
      setAuthenticatedUser({
        userId: 'demo-user-id',
        username: email.split('@')[0],
        status: 'online',
        provider: 'email'
      });
      
      toast({
        title: "Signed in successfully",
        description: "Welcome to SoftSpot!"
      });
      
      navigate('/feed');
      setIsLoading(false);
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    
    // Check if we're using the mock implementation
    if (isClerkConfigured) {
      // If using Clerk, show a toast explaining that this would normally use Clerk's OAuth
      toast({
        title: "OAuth Sign-in",
        description: `In a production app, this would use Clerk's ${provider} OAuth. Using mock implementation for now.`
      });
    }
    
    // Mock social sign-in
    setTimeout(() => {
      // Use our centralized auth state
      setAuthenticatedUser({
        userId: `${provider}-user-id`,
        username: `${provider}User`,
        status: 'online',
        provider: provider.toLowerCase() as any
      });
      
      toast({
        title: "Signed in successfully",
        description: `Welcome to SoftSpot! You signed in with ${provider}.`
      });
      
      navigate('/feed');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="border-softspot-200 shadow-lg">
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
      
      <CardContent className="space-y-4">
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-softspot-500 hover:bg-softspot-600"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin('Google')}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.01 14.99c-1.51 1.01-3.38 1.51-5.01 1.51-4.39 0-8-3.61-8-8 0-1.29.32-2.56.91-3.67 1.01 2.13 3.07 3.67 5.5 3.67 1.79 0 3.43-.77 4.59-2H9v-2h9.97v2.08c0 3.13-1.33 6.07-3.56 8.08z"/>
              <path fill="#34A853" d="m14.06 15.05 5.19-9c-.39-.75-.89-1.4-1.5-1.96l-5.19 9c.44.53.79 1.13 1.05 1.77.03.08.07.16.1.24.31-.09.6-.21.88-.36l-.53.31z"/>
              <path fill="#FBBC05" d="M6.39 8.5c0-.99.31-1.91.83-2.68C6.41 7.03 5.96 8.47 5.96 10c0 1.38.36 2.67 1 3.8.48-1.98 2.07-3.48 4.04-3.93-.9-.26-1.63-.91-1.96-1.77-.43.24-.82.53-1.18.86-.3.27-.56.56-.79.88-.45-.72-.68-1.5-.68-2.34z"/>
              <path fill="#EA4335" d="M12 7.5c1.93 0 3.5-1.57 3.5-3.5S13.93.5 12 .5 8.5 2.07 8.5 4s1.57 3.5 3.5 3.5zm0-5c.83 0 1.5.67 1.5 1.5S12.83 5.5 12 5.5 10.5 4.83 10.5 4 11.17 2.5 12 2.5z"/>
            </svg>
          </Button>
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin('Apple')}
            disabled={isLoading}
          >
            <Apple className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin('Facebook')}
            disabled={isLoading}
          >
            <Facebook className="h-5 w-5" />
          </Button>
        </div>

        <div className="text-center text-xs text-gray-400 mt-2">
          Icons by <a href="https://icons8.com" className="underline hover:text-gray-600" target="_blank" rel="noopener noreferrer">Icons8</a>
        </div>
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
}
