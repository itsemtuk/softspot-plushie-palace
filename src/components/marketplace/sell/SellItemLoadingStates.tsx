
import { Spinner } from "@/components/ui/spinner";

interface SellItemLoadingProps {
  message?: string;
}

export const SellItemAuthLoading = ({ message = "Checking authentication..." }: SellItemLoadingProps) => (
  <div className="flex justify-center items-center h-[60vh]">
    <Spinner size="lg" />
    <p className="ml-3 text-gray-600">{message}</p>
  </div>
);

export const SellItemFormLoading = ({ message = "Initializing form..." }: SellItemLoadingProps) => (
  <div className="flex justify-center items-center h-[60vh] flex-col">
    <Spinner size="lg" className="mb-4" />
    <p className="text-gray-500 text-center">
      {message}
      <br />
      <span className="text-sm text-gray-400">
        If this persists, please refresh the page
      </span>
    </p>
  </div>
);
