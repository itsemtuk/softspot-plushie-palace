
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { speciesOptions, deliveryMethodOptions } from "@/components/onboarding/onboardingData";

interface SpeciesDeliveryFieldsProps {
  onSelectChange: (field: string, value: string) => void;
}

export const SpeciesDeliveryFields = ({ onSelectChange }: SpeciesDeliveryFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormItem>
        <FormLabel>Species/Type</FormLabel>
        <Select 
          onValueChange={(value) => onSelectChange("species", value)}
          defaultValue=""
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {speciesOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormItem>
      
      <FormItem>
        <FormLabel>Delivery Method</FormLabel>
        <Select 
          onValueChange={(value) => onSelectChange("deliveryMethod", value)}
          defaultValue="shipping"
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select delivery method" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {deliveryMethodOptions.map((option) => (
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
