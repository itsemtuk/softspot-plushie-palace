
import { Navbar } from "@/components/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "@/components/navigation/MobileNav";
import { NotificationsTab } from "@/components/profile/NotificationsTab";
import Footer from "@/components/Footer";

const NotificationsPage = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <div className="container mx-auto px-4 py-6 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        <NotificationsTab />
      </div>
      
      <Footer />
    </div>
  );
};

export default NotificationsPage;
