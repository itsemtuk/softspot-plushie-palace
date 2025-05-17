
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { materialOptions, fillingOptions } from "@/components/onboarding/onboardingData";

interface MaterialFillingFieldsProps {
  onSelectChange: (field: string, value: string) => void;
}

export const MaterialFillingFields = ({ onSelectChange }: MaterialFillingFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormItem>
        <FormLabel>Material</FormLabel>
        <Select 
          onValueChange={(value) => onSelectChange("material", value)}
          defaultValue="plush"
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {materialOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormItem>
      
      <FormItem>
        <FormLabel>Filling</FormLabel>
        <Select 
          onValueChange={(value) => onSelectChange("filling", value)}
          defaultValue="polyester"
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select filling" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {fillingOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormItem>
    </div>
  );
};
