
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface BasicInfoFieldsProps {
  register: any;
  errors: any;
}

export const BasicInfoFields = ({ register, errors }: BasicInfoFieldsProps) => {
  return (
    <>
      <FormItem>
        <FormLabel htmlFor="title">Title</FormLabel>
        <FormControl>
          <Input 
            id="title"
            placeholder="Enter a title for your listing"
            {...register("title", { required: "Title is required" })}
            className={errors.title ? "border-red-500" : ""}
          />
        </FormControl>
        {errors.title && <FormMessage>{errors.title.message}</FormMessage>}
      </FormItem>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormItem>
          <FormLabel htmlFor="price">Price ($)</FormLabel>
          <FormControl>
            <Input 
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register("price", { 
                required: "Price is required",
                min: { value: 0, message: "Price must be positive" },
                valueAsNumber: true,
                setValueAs: (value: string) => {
                  const num = parseFloat(value);
                  return isNaN(num) ? 0 : num;
                }
              })}
              className={errors.price ? "border-red-500" : ""}
            />
          </FormControl>
          {errors.price && <FormMessage>{errors.price.message}</FormMessage>}
        </FormItem>
        
        <FormItem>
          <FormLabel htmlFor="color">Color</FormLabel>
          <FormControl>
            <Input 
              id="color"
              placeholder="Primary color"
              {...register("color")}
            />
          </FormControl>
        </FormItem>
      </div>
    </>
  );
};
