
import { Navbar } from "@/components/Navbar";
import { DirectMessaging } from "@/components/messaging/DirectMessaging";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "@/components/navigation/MobileNav";

const MessagingPage = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? <MobileNav /> : <Navbar />}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 pt-4">Messages</h1>
        <DirectMessaging />
      </main>
    </div>
  );
};

export default MessagingPage;
