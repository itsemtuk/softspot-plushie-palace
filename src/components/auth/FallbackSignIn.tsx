
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

export function FallbackSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
    
    // Mock sign-in - in a real app this would verify with a backend
    setTimeout(() => {
      // Store demo user details
      localStorage.setItem('currentUserId', 'demo-user-id');
      localStorage.setItem('currentUsername', email.split('@')[0]);
      localStorage.setItem('userStatus', 'online');
      
      toast({
        title: "Signed in successfully",
        description: "Welcome to SoftSpot!"
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
      
      <CardContent>
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
