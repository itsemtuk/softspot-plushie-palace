
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Camera, DollarSign, Search, MessageCircle } from "lucide-react";
import { QuickListForm } from "@/components/marketplace/QuickListForm";
import { cn } from "@/lib/utils";
import { useCreatePost } from "@/hooks/use-create-post";

export function QuickActionsFAB() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQuickList, setShowQuickList] = useState(false);
  const navigate = useNavigate();
  const { setIsPostCreationOpen } = useCreatePost();

  const actions = [
    {
      icon: Camera,
      label: "Post",
      action: () => {
        setIsPostCreationOpen(true);
        navigate("/feed");
      },
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: DollarSign,
      label: "Sell",
      action: () => navigate("/sell"),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: Search,
      label: "Search",
      action: () => navigate("/search"),
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      icon: MessageCircle,
      label: "Chat",
      action: () => navigate("/messages"),
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <>
      <div className="fixed bottom-20 right-4 z-40 md:hidden">
        {/* Action Buttons */}
        <div className={cn(
          "flex flex-col gap-3 mb-3 transition-all duration-300",
          isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}>
          {actions.map((action, index) => (
            <Button
              key={action.label}
              size="sm"
              className={cn(
                "rounded-full w-12 h-12 shadow-lg transition-all duration-200",
                action.color,
                "transform hover:scale-110"
              )}
              style={{
                transitionDelay: isExpanded ? `${index * 50}ms` : `${(actions.length - index) * 50}ms`
              }}
              onClick={() => {
                action.action();
                setIsExpanded(false);
              }}
            >
              <action.icon className="h-5 w-5 text-white" />
            </Button>
          ))}
        </div>

        {/* Main FAB */}
        <Button
          size="lg"
          className={cn(
            "rounded-full w-14 h-14 shadow-lg bg-softspot-500 hover:bg-softspot-600 transition-all duration-300",
            isExpanded && "rotate-45"
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </div>

      <QuickListForm 
        isOpen={showQuickList} 
        onClose={() => setShowQuickList(false)} 
      />
    </>
  );
}
