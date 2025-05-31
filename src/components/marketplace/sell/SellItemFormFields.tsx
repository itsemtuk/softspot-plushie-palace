
import { useState } from "react";
import { BasicInfoFields } from "./form-fields/BasicInfoFields";
import { DescriptionFieldSimple } from "./form-fields/DescriptionFieldSimple";
import { ConditionBrandFields } from "./form-fields/ConditionBrandFields";
import { OtherBrandInput } from "./form-fields/OtherBrandInput";
import { MaterialFillingFields } from "./form-fields/MaterialFillingFields";
import { SpeciesDeliveryFields } from "./form-fields/SpeciesDeliveryFields";
import { ShippingCostField } from "./form-fields/ShippingCostField";
import { Spinner } from "@/components/ui/spinner";

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
  
  // Enhanced safety checks - ensure all required props are functions
  if (!register || typeof register !== 'function' || 
      !onSelectChange || typeof onSelectChange !== 'function') {
    console.log("SellItemFormFields: Form methods not ready", { 
      register: typeof register, 
      onSelectChange: typeof onSelectChange 
    });
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner size="md" />
        <span className="ml-3 text-sm text-gray-500">Loading form fields...</span>
      </div>
    );
  }
  
  const handleBrandChange = (value: string) => {
    if (!value || !onSelectChange) return;
    
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
    if (!e?.target || !onSelectChange) return;
    
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
  
  // Additional safety wrapper for child components
  const safeOnSelectChange = (field: string, value: string) => {
    try {
      if (onSelectChange && typeof onSelectChange === 'function') {
        onSelectChange(field, value);
      }
    } catch (error) {
      console.error("Error in safeOnSelectChange:", error);
    }
  };
  
  return (
    <div className="space-y-4">
      <BasicInfoFields register={register} errors={errors} />
      
      <DescriptionFieldSimple register={register} errors={errors} />
      
      <ConditionBrandFields 
        onSelectChange={safeOnSelectChange} 
        handleBrandChange={handleBrandChange} 
      />
      
      {/* Show input field when "Other" brand is selected */}
      {selectedBrand === "other" && (
        <OtherBrandInput 
          otherBrandValue={otherBrandValue} 
          onOtherBrandChange={handleOtherBrandChange} 
        />
      )}
      
      <MaterialFillingFields onSelectChange={safeOnSelectChange} />
      
      <SpeciesDeliveryFields onSelectChange={safeOnSelectChange} />
      
      <ShippingCostField register={register} />
    </div>
  );
};
