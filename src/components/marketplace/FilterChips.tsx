
import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

interface FilterChip {
  id: string;
  label: string;
  active: boolean;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onChipClick: (id: string) => void;
}

export function FilterChips({ chips, onChipClick }: FilterChipsProps) {
  if (chips.length === 0) return null;
  
  return (
    <ScrollArea orientation="horizontal" className="w-full">
      <div className="flex space-x-2 pb-2">
        {chips.map(chip => (
          <Button
            key={chip.id}
            variant="outline"
            size="sm"
            className={`rounded-full flex items-center ${
              chip.active ? 'bg-softspot-100 text-softspot-700 border-softspot-200' : 'bg-gray-100'
            } whitespace-nowrap`}
            onClick={() => onChipClick(chip.id)}
          >
            {chip.label}
            {chip.active && <X className="ml-1 h-3 w-3" />}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}
