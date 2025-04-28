
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, Mail, Link, Contact } from "lucide-react";

export default function About() {
  const features = [
    {
      title: "Community Driven",
      description: "Connect with fellow plushie enthusiasts, share your collection, and discover new favorites.",
      icon: <Contact className="w-4 h-4" />,
    },
    {
      title: "Secure Marketplace",
      description: "Buy, sell, or trade plushies in our safe and trusted marketplace environment.",
      icon: <Link className="w-4 h-4" />,
    },
    {
      title: "Regular Updates",
      description: "Stay informed about new features, community events, and special marketplace offers.",
      icon: <Info className="w-4 h-4" />,
    },
    {
      title: "Support & Help",
      description: "Get assistance from our dedicated support team and helpful community members.",
      icon: <Mail className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <section className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-softspot-500">About SoftSpot</h1>
            <p className="text-lg text-muted-foreground">
              Your community for plushies and soft toys
            </p>
          </section>

          {/* Mission Statement */}
          <Card className="border-softspot-200">
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                SoftSpot is dedicated to creating a warm, inclusive space where plushie enthusiasts can 
                connect, share their collections, and find their next cherished companion. We believe 
                every plushie has a story to tell and every collector deserves a platform to share their passion.
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-softspot-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {feature.icon}
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Support Section */}
          <Card className="border-softspot-200 bg-softspot-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Badge variant="secondary" className="mb-4">Support Our Project</Badge>
                <h3 className="text-2xl font-semibold text-softspot-500">Help Us Grow</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  If you enjoy using SoftSpot and want to support our mission of building the best 
                  plushie community platform, consider buying us a coffee!
                </p>
                <Button 
                  className="bg-[#FF5E5B] hover:bg-[#FF5E5B]/90"
                  onClick={() => window.open('https://ko-fi.com/softspot', '_blank')}
                >
                  Buy us a Ko-fi ☕
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
