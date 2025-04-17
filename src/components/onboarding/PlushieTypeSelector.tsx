
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

type PlushieType = {
  id: string;
  label: string;
};

interface PlushieTypeSelectorProps {
  plushieTypes: PlushieType[];
  form: UseFormReturn<FormSchemaType>;
}

const PlushieTypeSelector = ({ plushieTypes, form }: PlushieTypeSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="plushieTypes"
      render={({ field }) => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-lg">What types of plushies do you like?</FormLabel>
            <p className="text-sm text-muted-foreground">
              Select all that apply
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {plushieTypes.map((item) => (
              <FormField
                key={item.id}
                control={form.control}
                name="plushieTypes"
                render={({ field }) => {
                  const isSelected = field.value?.includes(item.id);
                  return (
                    <FormItem
                      key={item.id}
                      className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 cursor-pointer transition-colors ${
                        isSelected ? "border-softspot-300 bg-softspot-50" : ""
                      }`}
                      onClick={() => {
                        const newValue = isSelected
                          ? field.value.filter((value) => value !== item.id)
                          : [...field.value, item.id];
                        field.onChange(newValue);
                      }}
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
                      <FormLabel className="font-normal cursor-pointer">
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

export default PlushieTypeSelector;
