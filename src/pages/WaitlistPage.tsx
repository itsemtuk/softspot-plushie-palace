import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Heart, Shield, Users, Mail, Check, Star, ArrowRight } from "lucide-react";

const WaitlistPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoaded, signUp } = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    
    try {
      setIsSubmitting(true);
      
      // Add to waitlist (this would connect to your database in production)
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      
      // Pre-register email with Clerk (optional)
      await signUp.create({
        emailAddress: email,
      });
      
      // Successful submission
      setIsSubmitted(true);
      toast({
        title: "Thank you for joining our waitlist!",
        description: "We'll notify you when SoftSpot launches.",
      });
      
    } catch (error) {
      console.error("Waitlist submission error:", error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-softspot-50 via-background to-softspot-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-softspot-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-softspot-300/20 rounded-full blur-3xl animate-bounce-slow"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-softspot-400/20 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-softspot-100 px-4 py-2 rounded-full text-softspot-700 text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Coming Soon
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-br from-softspot-600 to-softspot-800 bg-clip-text text-transparent mb-6 tracking-tight">
            SoftSpot
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed">
            The social marketplace where plushie lovers connect, trade, and discover their next cuddle companion
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-softspot-500" />
              <span>Build your collection</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-softspot-500" />
              <span>Connect with collectors</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-softspot-500" />
              <span>Secure marketplace</span>
            </div>
          </div>
        </div>

        {/* Waitlist Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-card/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-border/50 p-8">
            {!isSubmitted ? (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Join the Waitlist</h2>
                  <p className="text-muted-foreground">Be among the first to experience SoftSpot when we launch</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="your@email.com" 
                        required
                        className="pl-10 h-12 bg-background/50 border-border/50 focus:border-softspot-500 focus:ring-softspot-500/20"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full h-12 bg-softspot-500 hover:bg-softspot-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all group"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Joining waitlist...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Join Waitlist
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    We'll only send you important updates about our launch. No spam, ever.
                  </p>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">You're on the list!</h2>
                <p className="text-muted-foreground mb-6">
                  Thanks for joining! We'll notify you at <span className="font-medium text-foreground">{email}</span> when SoftSpot is ready to launch.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                  className="border-softspot-200 hover:bg-softspot-50"
                >
                  Join with another email
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl w-full">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:border-softspot-200 transition-colors">
            <div className="w-12 h-12 bg-softspot-100 rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-softspot-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Social Community</h3>
            <p className="text-muted-foreground text-sm">Connect with fellow collectors, share your finds, and discover new favorites together.</p>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:border-softspot-200 transition-colors">
            <div className="w-12 h-12 bg-softspot-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-softspot-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Secure Trading</h3>
            <p className="text-muted-foreground text-sm">Buy, sell, and trade with confidence using our secure payment system and buyer protection.</p>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:border-softspot-200 transition-colors">
            <div className="w-12 h-12 bg-softspot-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-softspot-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Global Marketplace</h3>
            <p className="text-muted-foreground text-sm">Access a worldwide community of plushie enthusiasts and rare collectibles.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} SoftSpot. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default WaitlistPage;