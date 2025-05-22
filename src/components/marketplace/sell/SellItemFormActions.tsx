
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface SellItemFormActionsProps {
  isSubmitting: boolean;
  supabaseUserId?: string | null;
}

export const SellItemFormActions = ({ 
  isSubmitting,
  supabaseUserId 
}: SellItemFormActionsProps) => {
  const isReady = !isSubmitting && !!supabaseUserId;
  
  return (
    <div className="flex justify-end space-x-4 pt-2">
      <Button
        type="button"
        variant="outline"
        disabled={isSubmitting}
      >
        Cancel
      </Button>

      <Button 
        type="submit"
        disabled={isSubmitting || !isReady}
        className="bg-softspot-600 hover:bg-softspot-700 text-white"
      >
        {isSubmitting ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Saving...
          </>
        ) : !supabaseUserId ? (
          <>Preparing...</>
        ) : (
          <>List for Sale</>
        )}
      </Button>
    </div>
  );
};
