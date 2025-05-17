
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { conditionOptions, brandOptions } from "@/components/onboarding/onboardingData";

interface ConditionBrandFieldsProps {
  onSelectChange: (field: string, value: string) => void;
  handleBrandChange: (value: string) => void;
}

export const ConditionBrandFields = ({ 
  onSelectChange,
  handleBrandChange
}: ConditionBrandFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormItem>
        <FormLabel>Condition</FormLabel>
        <Select 
          onValueChange={(value) => onSelectChange("condition", value)} 
          defaultValue="like-new"
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {conditionOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormItem>
      
      <FormItem>
        <FormLabel>Brand</FormLabel>
        <Select 
          onValueChange={handleBrandChange}
          defaultValue=""
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {brandOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </FormItem>
    </div>
  );
};
