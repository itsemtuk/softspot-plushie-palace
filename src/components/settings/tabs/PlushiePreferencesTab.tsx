
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

// Plushie brand and type data
const plushieBrands = [
  { id: "jellycat", label: "Jellycat" },
  { id: "squishmallows", label: "Squishmallows" },
  { id: "buildabear", label: "Build-A-Bear" },
  { id: "sanrio", label: "Sanrio" },
  { id: "pokemon", label: "Pokemon" },
  { id: "disney", label: "Disney" },
  { id: "other", label: "Other" }
];

const plushieTypes = [
  { id: "bear", label: "Bears" },
  { id: "cat", label: "Cats" },
  { id: "dog", label: "Dogs" },
  { id: "bunny", label: "Bunnies" },
  { id: "dinosaur", label: "Dinosaurs" },
  { id: "fox", label: "Foxes" },
  { id: "unicorn", label: "Unicorns" },
  { id: "dragon", label: "Dragons" },
  { id: "elephant", label: "Elephants" },
  { id: "fish", label: "Fish/Sea Creatures" },
];

interface PlushiePreferencesTabProps {
  form: UseFormReturn<any>;
}

export const PlushiePreferencesTab = ({ form }: PlushiePreferencesTabProps) => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [favoriteType, setFavoriteType] = useState<string>("");
  
  // Toggle brand selection
  const toggleBrand = (brandId: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(id => id !== brandId) 
        : [...prev, brandId]
    );
  };
  
  return (
    <>
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Favorite Plushie Brands</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {plushieBrands.map((brand) => (
              <div key={brand.id} className="flex items-center space-x-3">
                <Checkbox 
                  id={`brand-${brand.id}`} 
                  checked={selectedBrands.includes(brand.id)} 
                  onCheckedChange={() => toggleBrand(brand.id)}
                />
                <label
                  htmlFor={`brand-${brand.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {brand.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Favorite Plushie Type</h3>
        
        <div className="space-y-4">
          <Select value={favoriteType} onValueChange={setFavoriteType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your favorite type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Plushie Types</SelectLabel>
                {plushieTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Collection Preferences</h3>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="showCollection"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel className="font-medium text-gray-700">Show my collection publicly</FormLabel>
                  <FormDescription className="text-sm text-gray-500">
                    Allow others to see your plushie collection
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="showWishlist"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel className="font-medium text-gray-700">Show wishlist publicly</FormLabel>
                  <FormDescription className="text-sm text-gray-500">
                    Allow others to see your plushie wishlist
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="pb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Shopping Preferences</h3>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="receiveWishlistAlerts"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel className="font-medium text-gray-700">Wishlist price alerts</FormLabel>
                  <FormDescription className="text-sm text-gray-500">
                    Get notified when items on your wishlist go on sale
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="newReleaseAlerts"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel className="font-medium text-gray-700">New release alerts</FormLabel>
                  <FormDescription className="text-sm text-gray-500">
                    Get notified about new plushie releases from your favorite brands
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
};
