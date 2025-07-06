
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { MobileNav } from '@/components/navigation/MobileNav';
import { useIsMobile } from '@/hooks/use-mobile';
import Footer from '@/components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  noPadding?: boolean;
  includeFooter?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  noPadding = false, 
  includeFooter = true 
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Always show appropriate navigation */}
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <main className={`flex-grow ${noPadding ? '' : 'container mx-auto px-4 py-8'} ${noPadding ? '' : (!isMobile ? 'pt-20' : 'pt-16')}`}>
        {children}
      </main>

      {includeFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
