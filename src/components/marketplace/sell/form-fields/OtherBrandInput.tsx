
import { Input } from "@/components/ui/input";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";

interface OtherBrandInputProps {
  otherBrandValue: string;
  onOtherBrandChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const OtherBrandInput = ({ 
  otherBrandValue, 
  onOtherBrandChange 
}: OtherBrandInputProps) => {
  return (
    <FormItem>
      <FormLabel htmlFor="otherBrand">Specify Brand</FormLabel>
      <FormControl>
        <Input
          id="otherBrand"
          placeholder="Enter brand name"
          value={otherBrandValue}
          onChange={onOtherBrandChange}
        />
      </FormControl>
    </FormItem>
  );
};
