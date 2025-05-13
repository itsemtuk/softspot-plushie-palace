
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { BrandPageWrapper } from "@/components/brand/BrandPage";
import Footer from "@/components/Footer";

const BrandPage = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen">
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <BrandPageWrapper />
      
      <Footer />
    </div>
  );
};

export default BrandPage;
