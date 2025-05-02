
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Facebook, Apple } from 'lucide-react';

export function FallbackSignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple validation
    if (!email || !password || !name) {
      toast({
        title: "Error",
        description: "Please fill out all fields",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Mock sign-up - in a real app this would register with a backend
    setTimeout(() => {
      // Store demo user details
      localStorage.setItem('currentUserId', 'demo-user-id');
      localStorage.setItem('currentUsername', name);
      localStorage.setItem('userStatus', 'online');
      
      toast({
        title: "Account created successfully",
        description: "Welcome to SoftSpot!"
      });
      
      navigate('/onboarding');
      setIsLoading(false);
    }, 1000);
  };

  const handleSocialSignUp = (provider: string) => {
    setIsLoading(true);
    
    // Mock social sign-up
    setTimeout(() => {
      // Store demo user details
      localStorage.setItem('currentUserId', `${provider}-user-id`);
      localStorage.setItem('currentUsername', `${provider}User`);
      localStorage.setItem('userStatus', 'online');
      
      toast({
        title: "Account created successfully",
        description: `Welcome to SoftSpot! You signed up with ${provider}.`
      });
      
      navigate('/onboarding');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-softspot-600 mb-4">Join SoftSpot</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <Input 
              id="name" 
              type="text" 
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
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
            {isLoading ? "Creating account..." : "Create account"}
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
            onClick={() => handleSocialSignUp('Google')}
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
            onClick={() => handleSocialSignUp('Apple')}
            disabled={isLoading}
          >
            <Apple className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => handleSocialSignUp('Facebook')}
            disabled={isLoading}
          >
            <Facebook className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col items-center border-t pt-6">
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/sign-in" className="text-softspot-600 hover:text-softspot-700 font-medium">
            Sign in
          </Link>
        </p>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>By signing up, you agree to our Terms of Service and Privacy Policy.</p>
          <p className="mt-2">You must be at least 16 years old to create an account.</p>
        </div>
      </CardFooter>
    </Card>
  );
}
