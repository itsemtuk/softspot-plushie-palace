
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import PlushieTypeSelector from "./onboarding/PlushieTypeSelector";
import PlushieBrandSelector from "./onboarding/PlushieBrandSelector";
import { plushieTypes, plushieBrands } from "./onboarding/onboardingData";
import { FormSchema, FormSchemaType } from "./onboarding/OnboardingFormSchema";

const OnboardingForm = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      plushieTypes: [],
      plushieBrands: [],
    },
  });

  async function onSubmit(data: FormSchemaType) {
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
          <PlushieTypeSelector plushieTypes={plushieTypes} form={form} />
          <PlushieBrandSelector plushieBrands={plushieBrands} form={form} />

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
