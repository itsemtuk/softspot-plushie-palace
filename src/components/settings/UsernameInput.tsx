
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PencilIcon } from "lucide-react";

interface UsernameInputProps {
  form: UseFormReturn<any>;
}

const UsernameInput = ({ form }: UsernameInputProps) => {
  return (
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-gray-700">Username</FormLabel>
          <div className="relative">
            <FormControl>
              <Input 
                placeholder="Your username"
                className="pr-10"
                {...field}
              />
            </FormControl>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-softspot-500">
              <PencilIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Your unique profile name (3-20 characters)</p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default UsernameInput;
