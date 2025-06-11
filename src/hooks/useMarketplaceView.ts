
import { useState } from "react";

export function useMarketplaceView() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  const toggleFilterDrawer = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const closeFilterDrawer = () => {
    setIsFilterOpen(false);
  };

  return {
    viewMode,
    sortBy,
    searchQuery,
    isFilterOpen,
    handleSearchChange,
    handleSortChange,
    handleViewModeChange,
    toggleFilterDrawer,
    closeFilterDrawer
  };
}
