
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
          <FormLabel className="text-lg">Username</FormLabel>
          <FormControl>
            <Input 
              placeholder="Your username"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default UsernameInput;
