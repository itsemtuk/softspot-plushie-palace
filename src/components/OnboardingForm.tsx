
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

const plushieTypes = [
  { id: "teddy-bears", label: "Teddy Bears" },
  { id: "cats", label: "Cats" },
  { id: "dogs", label: "Dogs" },
  { id: "unicorns", label: "Unicorns" },
  { id: "dinosaurs", label: "Dinosaurs" },
  { id: "pokemon", label: "Pokémon" },
  { id: "farm-animals", label: "Farm Animals" },
  { id: "wild-animals", label: "Wild Animals" },
  { id: "sea-creatures", label: "Sea Creatures" },
  { id: "fantasy", label: "Fantasy Creatures" },
];

const plushieBrands = [
  { id: "build-a-bear", label: "Build-A-Bear" },
  { id: "jellycat", label: "Jellycat" },
  { id: "pokemon-official", label: "Pokémon Official" },
  { id: "squishmallow", label: "Squishmallow" },
  { id: "ty", label: "Ty" },
  { id: "sanrio", label: "Sanrio" },
  { id: "steiff", label: "Steiff" },
  { id: "gund", label: "Gund" },
  { id: "aurora", label: "Aurora World" },
  { id: "disney", label: "Disney" },
];

const FormSchema = z.object({
  plushieTypes: z.array(z.string()).min(1, {
    message: "Please select at least one type of plushie you like.",
  }),
  plushieBrands: z.array(z.string()),
});

const OnboardingForm = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      plushieTypes: [],
      plushieBrands: [],
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      // Convert IDs to labels for better readability in the profile
      const selectedTypes = plushieTypes
        .filter(type => data.plushieTypes.includes(type.id))
        .map(type => type.label);
      
      const selectedBrands = plushieBrands
        .filter(brand => data.plushieBrands.includes(brand.id))
        .map(brand => brand.label);
      
      // Combine both arrays for plushie interests
      const plushieInterests = [...selectedTypes, ...selectedBrands];
      
      // Fixed: Using unsafeMetadata instead of publicMetadata for now
      await user?.update({
        unsafeMetadata: {
          plushieInterests,
          onboardingCompleted: true
        },
      });

      toast({
        title: "Preferences saved!",
        description: "Your plushie preferences have been saved successfully.",
      });
      
      // Redirect to feed after completing onboarding
      navigate('/feed');
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-softspot-600">
        Welcome to SoftSpot!
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Tell us about your plushie preferences to personalize your experience.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="plushieTypes"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-lg">What types of plushies do you like?</FormLabel>
                  <FormDescription>
                    Select all that apply
                  </FormDescription>
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

          <FormField
            control={form.control}
            name="plushieBrands"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-lg">Any favorite plushie brands?</FormLabel>
                  <FormDescription>
                    Select all that apply (optional)
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {plushieBrands.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="plushieBrands"
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

          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              className="bg-softspot-500 hover:bg-softspot-600 min-w-[150px]"
              disabled={loading}
            >
              {loading ? "Saving..." : "Continue to SoftSpot"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OnboardingForm;
