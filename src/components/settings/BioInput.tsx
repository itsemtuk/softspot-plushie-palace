
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormSchemaType } from "./OnboardingFormSchema";

interface BioInputProps {
  form: UseFormReturn<FormSchemaType>;
}

const BioInput = ({ form }: BioInputProps) => {
  return (
    <FormField
      control={form.control}
      name="bio"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg">Tell us about yourself</FormLabel>
          <p className="text-sm text-muted-foreground mb-4">
            Share a bit about your plushie journey (optional)
          </p>
          <FormControl>
            <Textarea 
              placeholder="I've been collecting plushies since I was a kid..."
              className="resize-none"
              maxLength={160}
              {...field}
            />
          </FormControl>
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {field.value ? field.value.length : 0}/160
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BioInput;
