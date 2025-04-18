
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface PreferencesWarningProps {
  onContinueAnyway: () => void;
  onDismiss: () => void;
}

const PreferencesWarning = ({ onContinueAnyway, onDismiss }: PreferencesWarningProps) => (
  <Alert variant="warning" className="bg-yellow-50 border-yellow-200 mb-4">
    <AlertCircle className="h-4 w-4 text-yellow-600" />
    <AlertDescription className="text-yellow-700">
      You haven't selected any plushie types. It's recommended to select at least one to personalize your experience.
      <div className="mt-2 flex gap-2">
        <Button 
          variant="outline" 
          onClick={onContinueAnyway}
          className="text-sm"
        >
          Continue anyway
        </Button>
        <Button 
          variant="default"
          onClick={onDismiss}
          className="text-sm bg-yellow-600 hover:bg-yellow-700"
        >
          Choose preferences
        </Button>
      </div>
    </AlertDescription>
  </Alert>
);

export default PreferencesWarning;
