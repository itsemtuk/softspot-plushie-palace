
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInfoFieldsProps {
  register: any;
  errors: any;
}

export const BasicInfoFields = ({ register, errors }: BasicInfoFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title"
          placeholder="Enter a title for your listing"
          {...register("title", { required: "Title is required" })}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && <p className="text-sm font-medium text-destructive">{errors.title.message}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
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
          {errors.price && <p className="text-sm font-medium text-destructive">{errors.price.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input 
            id="color"
            placeholder="Primary color"
            {...register("color")}
          />
        </div>
      </div>
    </>
  );
};
