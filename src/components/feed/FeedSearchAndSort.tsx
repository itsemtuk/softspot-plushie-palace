
import { Search, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FeedSearchAndSortProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sortOrder: string;
  onSortChange: (value: string) => void;
  layout: string;
  onLayoutChange: () => void;
}

export const FeedSearchAndSort = ({
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
  layout,
  onLayoutChange
}: FeedSearchAndSortProps) => {
  return (
    <Card className="mb-4 rounded-2xl shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={onSearchChange}
              className="pl-10 rounded-full"
            />
          </div>
          <div className="space-x-2 flex items-center">
            <Select onValueChange={onSortChange} defaultValue={sortOrder}>
              <SelectTrigger className="w-[180px] rounded-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onLayoutChange}
              className="rounded-full"
            >
              {layout === "grid" ? <List className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
