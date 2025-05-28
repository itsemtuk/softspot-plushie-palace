
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface DescriptionFieldSimpleProps {
  register: any;
  errors: any;
}

export const DescriptionFieldSimple = ({ register, errors }: DescriptionFieldSimpleProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea 
        id="description"
        placeholder="Describe your plushie..."
        rows={4}
        {...register("description", { 
          required: "Description is required",
          maxLength: { value: 1000, message: "Description cannot exceed 1000 characters" }
        })}
        className={errors.description ? "border-red-500" : ""}
      />
      {errors.description && <p className="text-sm font-medium text-destructive">{errors.description.message}</p>}
    </div>
  );
};
