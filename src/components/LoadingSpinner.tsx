
import { Spinner } from "@/components/ui/spinner";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Spinner size="lg" />
        <p className="text-gray-600">Loading authentication...</p>
      </div>
    </div>
  );
}
