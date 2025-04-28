
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MarketplaceFilters } from "@/types/marketplace";

interface BrandFilterPanelProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  availableOnly: boolean;
  setAvailableOnly: (value: boolean) => void;
  onFilterChange: (filterType: keyof MarketplaceFilters, value: string[]) => void;
}

export const BrandFilterPanel = ({
  searchQuery,
  setSearchQuery,
  priceRange,
  setPriceRange,
  availableOnly,
  setAvailableOnly,
  onFilterChange,
}: BrandFilterPanelProps) => {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              id="search"
              placeholder="Search plushies..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Separator />

        <div>
          <Label>Price Range</Label>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <Slider
            defaultValue={priceRange}
            max={150}
            step={5}
            onValueChange={(value) => setPriceRange(value)}
          />
        </div>

        <Separator />

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="available">Available Only</Label>
            <Switch
              id="available"
              checked={availableOnly}
              onCheckedChange={(checked) => setAvailableOnly(checked)}
            />
          </div>
        </div>

        <Separator />

        <div>
          <Label>Material</Label>
          <Select onValueChange={(value) => onFilterChange('material', [value])}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cotton">Cotton</SelectItem>
              <SelectItem value="Polyester">Polyester</SelectItem>
              <SelectItem value="Plush">Plush</SelectItem>
              <SelectItem value="Fur">Fur</SelectItem>
              <SelectItem value="Velvet">Velvet</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div>
          <Label>Filling</Label>
          <Select onValueChange={(value) => onFilterChange('filling', [value])}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select filling" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cotton">Cotton</SelectItem>
              <SelectItem value="Polyester">Polyester</SelectItem>
              <SelectItem value="Beads">Beads</SelectItem>
              <SelectItem value="Memory Foam">Memory Foam</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div>
          <Label>Species</Label>
          <Select onValueChange={(value) => onFilterChange('species', [value])}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select species" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bear">Bear</SelectItem>
              <SelectItem value="Cat">Cat</SelectItem>
              <SelectItem value="Dog">Dog</SelectItem>
              <SelectItem value="Rabbit">Rabbit</SelectItem>
              <SelectItem value="Mythical">Mythical</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
