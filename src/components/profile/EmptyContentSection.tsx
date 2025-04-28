
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptyContentSectionProps {
  title: string;
  description: string;
  buttonText: string;
  navigateTo: string;
}

export const EmptyContentSection = ({ 
  title, 
  description, 
  buttonText, 
  navigateTo 
}: EmptyContentSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="py-12 text-center">
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <div className="flex justify-center">
          <ImagePlus className="h-12 w-12 text-softspot-300" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-500">{description}</p>
        <Button 
          className="mt-4 bg-softspot-400 hover:bg-softspot-500 text-white"
          onClick={() => navigate(navigateTo)}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
