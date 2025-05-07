
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

interface BioInputProps {
  form: UseFormReturn<any>;
}

const BioInput = ({ form }: BioInputProps) => {
  return (
    <FormField
      control={form.control}
      name="bio"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-gray-700">Bio</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Tell the community about your plushie passion..."
              className="resize-none"
              maxLength={160}
              rows={3}
              {...field}
            />
          </FormControl>
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-500">Tell the community about your plushie passion</p>
            <p className="text-xs text-gray-500">
              {field.value ? field.value.length : 0}/160
            </p>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BioInput;
