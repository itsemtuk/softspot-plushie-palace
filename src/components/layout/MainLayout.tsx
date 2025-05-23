
import React from 'react';
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import Footer from "@/components/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  className = "", 
  noPadding = false 
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {isMobile ? <MobileNav /> : <Navbar />}
      <main className={`flex-grow ${!noPadding ? 'container mx-auto px-4 py-8 pt-20' : 'pt-16'} ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
