
import { Navbar } from "@/components/Navbar";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  noPadding?: boolean;
  className?: string;
}

const MainLayout = ({ children, noPadding = false, className = "" }: MainLayoutProps) => {
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${className}`}>
      <Navbar />
      <main className={`bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 ${noPadding ? '' : 'px-4 py-6'}`}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
