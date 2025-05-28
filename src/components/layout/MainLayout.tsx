
import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { NetworkStatus } from "@/components/ui/network-status";

interface MainLayoutProps {
  children: ReactNode;
  noPadding?: boolean;
  className?: string;
}

const MainLayout = ({ children, noPadding = false, className = "" }: MainLayoutProps) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <Navbar />
      <NetworkStatus />
      <main className={noPadding ? "" : "container mx-auto px-4 py-6"}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
