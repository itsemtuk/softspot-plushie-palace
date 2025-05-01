
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SellItemFormActionsProps {
  isSubmitting: boolean;
}

export const SellItemFormActions = ({ isSubmitting }: SellItemFormActionsProps) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/marketplace');
  };

  return (
    <div className="flex justify-end space-x-4 pt-4">
      <Button type="button" variant="outline" onClick={handleCancel}>
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-softspot-500 hover:bg-softspot-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Listing..." : "List Item for Sale"}
      </Button>
    </div>
  );
};
