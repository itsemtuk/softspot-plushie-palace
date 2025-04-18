
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { FormSchemaType } from "./OnboardingFormSchema";

type PlushieBrand = {
  id: string;
  label: string;
};

interface PlushieBrandSelectorProps {
  plushieBrands: PlushieBrand[];
  form: UseFormReturn<FormSchemaType>;
}

const PlushieBrandSelector = ({ plushieBrands, form }: PlushieBrandSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="plushieBrands"
      render={({ field }) => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-lg">Any favorite plushie brands?</FormLabel>
            <p className="text-sm text-muted-foreground">
              Select all that apply (optional)
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {plushieBrands.map((item) => (
              <FormField
                key={item.id}
                control={form.control}
                name="plushieBrands"
                render={({ field: subField }) => {
                  const isSelected = field.value?.includes(item.id);
                  return (
                    <FormItem
                      key={item.id}
                      className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 cursor-pointer transition-colors ${
                        isSelected ? "border-softspot-300 bg-softspot-50" : ""
                      }`}
                    >
                      <FormControl>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            const newValue = checked
                              ? [...field.value, item.id]
                              : field.value.filter((value) => value !== item.id);
                            field.onChange(newValue);
                          }}
                        />
                      </FormControl>
                      <FormLabel 
                        className="font-normal cursor-pointer w-full"
                        onClick={() => {
                          const newValue = isSelected
                            ? field.value.filter((value) => value !== item.id)
                            : [...field.value, item.id];
                          field.onChange(newValue);
                        }}
                      >
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PlushieBrandSelector;
