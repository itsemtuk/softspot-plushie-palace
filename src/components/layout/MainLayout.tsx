
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { MobileNav } from '@/components/navigation/MobileNav';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, noPadding = false }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Always show appropriate navigation */}
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <main className={`${noPadding ? '' : 'container mx-auto px-4 py-8'} ${!isMobile ? 'pt-20' : 'pt-16'}`}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
