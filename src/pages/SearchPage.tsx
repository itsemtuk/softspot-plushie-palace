
import MainLayout from "@/components/layout/MainLayout";
import { UnifiedSearchSystem } from "@/components/search/UnifiedSearchSystem";

const SearchPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <UnifiedSearchSystem />
      </div>
    </MainLayout>
  );
};

export default SearchPage;
