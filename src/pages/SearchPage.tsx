
import MainLayout from "@/components/layout/MainLayout";
import { UnifiedSearchSystem } from "@/components/search/UnifiedSearchSystem";
import { Suspense } from "react";

const SearchPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-softspot-500"></div>
          </div>
        }>
          <UnifiedSearchSystem />
        </Suspense>
      </div>
    </MainLayout>
  );
};

export default SearchPage;
