
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { BrandPageWrapper } from "@/components/brand/BrandPage";
import Footer from "@/components/Footer";

const BrandPage = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <main className="bg-gray-50 dark:bg-gray-900">
        <BrandPageWrapper />
      </main>
      
      <Footer />
    </div>
  );
};

export default BrandPage;
