import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-xl font-bold text-softspot-500 mr-2">SoftSpot</span>
              <div className="h-8 w-8 rounded-full bg-softspot-200 flex items-center justify-center">
                <span className="text-lg">🧸</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm">Your community for plushies and soft toys</p>
            <p className="text-gray-500 text-sm">© 2025 SoftSpot. All rights reserved.</p>
            <div className="flex space-x-4 pt-2">
              <a href="https://instagram.com" className="text-gray-400 hover:text-gray-600" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" className="text-gray-400 hover:text-gray-600" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-gray-600" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Site Links */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-800">Site</h3>
            <ul className="space-y-3 text-gray-600">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/feed" className="hover:underline">Feed</Link></li>
              <li><Link to="/discover" className="hover:underline">Discover</Link></li>
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/profile" className="hover:underline">Profile</Link></li>
            </ul>
          </div>
          
          {/* Marketplace Links */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-800">Marketplace</h3>
            <ul className="space-y-3 text-gray-600">
              <li><Link to="/marketplace" className="hover:underline">All Items</Link></li>
              <li><Link to="/marketplace?featured=new" className="hover:underline">New Arrivals</Link></li>
              <li><Link to="/marketplace?sale=true" className="hover:underline">On Sale</Link></li>
              <li><Link to="/brands" className="hover:underline">Brands</Link></li>
              <li><Link to="/wishlist" className="hover:underline">Wishlist</Link></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-800">Subscribe</h3>
            <p className="text-gray-600 text-sm mb-4">Stay updated with the latest plushie news and marketplace updates</p>
            <div className="flex space-x-2">
              <Input type="email" placeholder="Enter your email" />
              <Button>
                <Mail className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-semibold mb-2 text-gray-800 text-sm">Policies</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link to="/policies/terms" className="hover:underline">Terms of Service</Link></li>
                <li><Link to="/policies/privacy" className="hover:underline">Privacy Policy</Link></li>
                <li><Link to="/policies/cookies" className="hover:underline">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
