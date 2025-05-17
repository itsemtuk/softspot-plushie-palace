
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionFieldProps {
  register: any;
  errors: any;
}

export const DescriptionField = ({ register, errors }: DescriptionFieldProps) => {
  return (
    <FormItem>
      <FormLabel htmlFor="description">Description</FormLabel>
      <FormControl>
        <Textarea 
          id="description"
          placeholder="Describe your plushie, include details about its condition, size, etc."
          {...register("description", { required: "Description is required" })}
          className={`min-h-[120px] resize-y ${errors.description ? "border-red-500" : ""}`}
        />
      </FormControl>
      {errors.description && <FormMessage>{errors.description.message}</FormMessage>}
    </FormItem>
  );
};
