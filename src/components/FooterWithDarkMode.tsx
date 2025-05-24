
import React from 'react';
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { useIsMobile } from "@/hooks/use-mobile";

const FooterWithDarkMode = () => {
  const isMobile = useIsMobile();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              © 2024 SoftSpot. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {!isMobile && (
              <>
                <a href="/about" className="text-gray-600 hover:text-softspot-500 text-sm">
                  About
                </a>
                <a href="/privacy" className="text-gray-600 hover:text-softspot-500 text-sm">
                  Privacy
                </a>
                <a href="/terms" className="text-gray-600 hover:text-softspot-500 text-sm">
                  Terms
                </a>
              </>
            )}
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterWithDarkMode;
