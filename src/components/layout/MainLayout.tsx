
import { useIsMobile } from "@/hooks/use-mobile";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/navigation/MobileNav";
import Footer from "@/components/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
  noPadding?: boolean;
  className?: string;
}

const MainLayout = ({ children, noPadding = false, className = "" }: MainLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <main className={`bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${className} ${noPadding ? '' : 'p-4'} ${isMobile ? 'pb-20' : ''}`}>
        {children}
      </main>
      
      {!isMobile && <Footer />}
    </div>
  );
};

export default MainLayout;
