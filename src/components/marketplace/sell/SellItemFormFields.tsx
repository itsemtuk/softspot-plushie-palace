
import { useState } from "react";
import { BasicInfoFields } from "./form-fields/BasicInfoFields";
import { DescriptionField } from "./form-fields/DescriptionField";
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
  
  // Guard against null props
  if (!register || !onSelectChange) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner size="md" />
        <span className="ml-3 text-sm text-gray-500">Loading form fields...</span>
      </div>
    );
  }
  
  const handleBrandChange = (value: string) => {
    if (!value) return;
    
    setSelectedBrand(value);
    if (value !== "other") {
      onSelectChange("brand", value);
    } else {
      onSelectChange("brand", otherBrandValue || "Other");
    }
  };
  
  const handleOtherBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e?.target) return;
    
    const value = e.target.value || "";
    setOtherBrandValue(value);
    if (selectedBrand === "other") {
      onSelectChange("brand", value || "Other");
    }
  };
  
  return (
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
  );
};
