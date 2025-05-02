
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Apple, Facebook, Google } from 'lucide-react';

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
            <Google className="h-5 w-5" />
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
