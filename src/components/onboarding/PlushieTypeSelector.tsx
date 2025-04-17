
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
import { z } from "zod";

type PlushieType = {
  id: string;
  label: string;
};

const formSchema = z.object({
  plushieTypes: z.array(z.string()).min(1, {
    message: "Please select at least one type of plushie you like.",
  }),
  plushieBrands: z.array(z.string()),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface PlushieTypeSelectorProps {
  plushieTypes: PlushieType[];
  form: UseFormReturn<FormSchemaType>;
}

const PlushieTypeSelector = ({ plushieTypes, form }: PlushieTypeSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="plushieTypes"
      render={() => (
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
                  return (
                    <FormItem
                      key={item.id}
                      className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, item.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== item.id
                                  )
                                )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  )
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
