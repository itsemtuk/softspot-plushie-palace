
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface SellItemErrorDisplayProps {
  error: string;
  onDismiss?: () => void;
}

export const SellItemErrorDisplay = ({ error, onDismiss }: SellItemErrorDisplayProps) => (
  <Alert variant="destructive" className="mb-4">
    <AlertTriangle className="h-4 w-4" />
    <AlertDescription>
      {error}
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="ml-2 text-sm underline hover:no-underline"
        >
          Dismiss
        </button>
      )}
    </AlertDescription>
  </Alert>
);
