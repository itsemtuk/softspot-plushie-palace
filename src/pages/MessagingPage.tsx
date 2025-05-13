
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { DirectMessaging } from "@/components/messaging/DirectMessaging";
import { MessagingComposer } from "@/components/messaging/MessagingComposer";
import Footer from "@/components/Footer";

const MessagingPage = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? <MobileNav /> : <Navbar />}

      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
          <MessagingComposer />
        </div>

        <DirectMessaging />
      </div>

      <Footer />
    </div>
  );
};

export default MessagingPage;
