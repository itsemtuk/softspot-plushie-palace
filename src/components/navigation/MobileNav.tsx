
import { Link } from "react-router-dom";
import { Home, Search, PlusSquare, ShoppingBag, User, Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignedIn } from "@clerk/clerk-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function MobileNav() {
  return (
    <>
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-softspot-100">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-softspot-500">SoftSpot</span>
            <div className="h-6 w-6 rounded-full bg-softspot-200 flex items-center justify-center ml-2">
              <span className="text-sm">🧸</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
            <SignedIn>
              <Link to="/messages">
                <Button variant="ghost" size="icon" className="relative">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </SignedIn>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-softspot-100">
        <div className="flex items-center justify-around h-16">
          <Link to="/feed">
            <Button variant="ghost" size="icon">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/discover">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" className="rounded-full bg-softspot-500 hover:bg-softspot-600">
                <PlusSquare className="h-5 w-5 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[40vh]">
              <SheetHeader>
                <SheetTitle>Create New</SheetTitle>
                <SheetDescription>Choose what you'd like to do</SheetDescription>
              </SheetHeader>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
                  <PlusSquare className="h-6 w-6" />
                  <span>Post</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
                  <ShoppingBag className="h-6 w-6" />
                  <span>Sell</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
                  <MessageSquare className="h-6 w-6" />
                  <span>Trade</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/marketplace">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Spacers for fixed navbars */}
      <div className="h-16" /> {/* Top spacer */}
      <div className="h-16" /> {/* Bottom spacer */}
    </>
  );
}
