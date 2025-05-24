
import { useState } from "react";
import { BasicInfoFields } from "./form-fields/BasicInfoFields";
import { DescriptionField } from "./form-fields/DescriptionField";
import { ConditionBrandFields } from "./form-fields/ConditionBrandFields";
import { OtherBrandInput } from "./form-fields/OtherBrandInput";
import { MaterialFillingFields } from "./form-fields/MaterialFillingFields";
import { SpeciesDeliveryFields } from "./form-fields/SpeciesDeliveryFields";
import { ShippingCostField } from "./form-fields/ShippingCostField";
import { Spinner } from "@/components/ui/spinner";
import ErrorBoundary from "@/components/ui/error-boundary";

interface SellItemFormFieldsProps {
  register: any;
  errors?: Record<string, any>;
  onSelectChange: (field: string, value: string) => void;
}

export const SellItemFormFields = ({ 
  register, 
  errors = {}, 
  onSelectChange 
}: SellItemFormFieldsProps) => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [otherBrandValue, setOtherBrandValue] = useState("");
  
  console.log("SellItemFormFields: Rendering with props:", { register: !!register, onSelectChange: !!onSelectChange });
  
  // Guard against null props with more explicit error logging
  if (!register) {
    console.error("SellItemFormFields: register is null/undefined");
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner size="md" />
        <span className="ml-3 text-sm text-gray-500">Loading form...</span>
      </div>
    );
  }

  if (!onSelectChange) {
    console.error("SellItemFormFields: onSelectChange is null/undefined");
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner size="md" />
        <span className="ml-3 text-sm text-gray-500">Loading form handlers...</span>
      </div>
    );
  }
  
  const handleBrandChange = (value: string) => {
    console.log("SellItemFormFields: Brand change:", value);
    if (!value) return;
    
    try {
      setSelectedBrand(value);
      if (value !== "other") {
        onSelectChange("brand", value);
      } else {
        onSelectChange("brand", otherBrandValue || "Other");
      }
    } catch (error) {
      console.error("Error in handleBrandChange:", error);
    }
  };
  
  const handleOtherBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("SellItemFormFields: Other brand change:", e?.target?.value);
    if (!e || !e.target) return;
    
    try {
      const value = e.target.value || "";
      setOtherBrandValue(value);
      if (selectedBrand === "other") {
        onSelectChange("brand", value || "Other");
      }
    } catch (error) {
      console.error("Error in handleOtherBrandChange:", error);
    }
  };
  
  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <BasicInfoFields register={register} errors={errors} />
        
        <DescriptionField register={register} errors={errors} />
        
        <ConditionBrandFields 
          onSelectChange={onSelectChange} 
          handleBrandChange={handleBrandChange} 
        />
        
        {/* Show input field when "Other" brand is selected */}
        {selectedBrand === "other" && (
          <OtherBrandInput 
            otherBrandValue={otherBrandValue} 
            onOtherBrandChange={handleOtherBrandChange} 
          />
        )}
        
        <MaterialFillingFields onSelectChange={onSelectChange} />
        
        <SpeciesDeliveryFields onSelectChange={onSelectChange} />
        
        <ShippingCostField register={register} />
      </div>
    </ErrorBoundary>
  );
};
