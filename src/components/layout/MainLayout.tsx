
import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { NetworkStatus } from "@/components/ui/network-status";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <NetworkStatus />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
