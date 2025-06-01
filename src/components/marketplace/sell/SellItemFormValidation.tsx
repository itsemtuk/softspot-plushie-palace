
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface SellItemFormValidationProps {
  errors: Record<string, any>;
  isSubmitting: boolean;
}

export const SellItemFormValidation: React.FC<SellItemFormValidationProps> = ({
  errors,
  isSubmitting
}) => {
  const hasErrors = Object.keys(errors).length > 0;

  if (!hasErrors && !isSubmitting) return null;

  return (
    <div className="space-y-2">
      {hasErrors && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please fix the following errors:
            <ul className="mt-2 list-disc list-inside text-sm">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>
                  {field}: {error?.message || 'Invalid value'}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {isSubmitting && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Creating your listing...
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
