
import MainLayout from "@/components/layout/MainLayout";
import { SearchSystem } from "@/components/search/SearchSystem";

const SearchPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Search
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find users, posts, and marketplace items
          </p>
        </div>
        
        <SearchSystem />
      </div>
    </MainLayout>
  );
};

export default SearchPage;
