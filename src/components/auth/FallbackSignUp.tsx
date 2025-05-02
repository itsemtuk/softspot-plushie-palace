
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

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

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold text-center text-softspot-600 mb-8">Join SoftSpot</h1>
      
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
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>By signing up, you agree to our Terms of Service and Privacy Policy.</p>
        <p className="mt-2">You must be at least 16 years old to create an account.</p>
      </div>
    </div>
  );
}
