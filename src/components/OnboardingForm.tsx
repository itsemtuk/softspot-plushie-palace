
import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { plushieTypes, plushieBrands } from "./onboarding/onboardingData";
import PlushieTypeSelector from "./onboarding/PlushieTypeSelector";
import PlushieBrandSelector from "./onboarding/PlushieBrandSelector";
import ProfilePictureUpload from "./onboarding/ProfilePictureUpload";
import BioInput from "./onboarding/BioInput";
import PreferencesWarning from "./onboarding/PreferencesWarning";
import { useOnboardingForm } from "@/hooks/useOnboardingForm";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const OnboardingForm = () => {
  const {
    form,
    loading,
    activeTab,
    showWarning,
    setActiveTab,
    handleNext,
    handleBack,
    handleContinueAnyway,
    onSubmit,
  } = useOnboardingForm();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-softspot-600">
        Welcome to SoftSpot!
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Tell us about yourself to personalize your experience.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="preferences">Plushie Preferences</TabsTrigger>
              <TabsTrigger value="profile">Profile Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preferences" className="space-y-6">
              {showWarning && (
                <PreferencesWarning
                  onContinueAnyway={handleContinueAnyway}
                  onDismiss={() => setActiveTab("preferences")}
                />
              )}
              <PlushieTypeSelector plushieTypes={plushieTypes} form={form} />
              <PlushieBrandSelector plushieBrands={plushieBrands} form={form} />
              
              <div className="flex justify-end pt-4">
                <Button 
                  type="button" 
                  className="bg-softspot-500 hover:bg-softspot-600"
                  onClick={handleNext}
                >
                  Continue
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="profile" className="space-y-6">
              <ProfilePictureUpload form={form} />
              <BioInput form={form} />
              
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1} 
                        max={120} 
                        placeholder="Enter your age"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      You must be at least 16 years old to use SoftSpot.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  SoftSpot is designed for users 16 and older. If you are under 16, please ask a parent or guardian for permission.
                </AlertDescription>
              </Alert>
              
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I accept the terms of service and privacy policy
                      </FormLabel>
                      <FormDescription>
                        By using SoftSpot, you agree to our content moderation policies and age restrictions.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="bg-softspot-500 hover:bg-softspot-600"
                  disabled={loading || !form.getValues('termsAccepted') || !form.getValues('age') || form.getValues('age') < 16}
                >
                  {loading ? "Saving..." : "Complete Setup"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};

export default OnboardingForm;
