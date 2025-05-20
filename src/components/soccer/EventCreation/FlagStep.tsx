
import React from "react";
import EventButtonRow from "./EventButtonRow";
import { AnnotationFlag } from "@/types/annotation";

interface FlagStepProps {
  flag: AnnotationFlag;
  onFlagValueSelect: (value: string) => void;
}

export const FlagStep: React.FC<FlagStepProps> = ({ flag, onFlagValueSelect }) => {
  const flagItems = flag.values.map((value, index) => ({
    id: `${flag.id}-${index}`,
    name: value,
    hotkey: String.fromCharCode(81 + index), // Start from Q (ASCII 81)
    description: `${flag.name}: ${value}`
  }));

  return (
    <div>
      <div className="text-black mb-3">
        <span className="font-medium">{flag.name}</span>
        {flag.description && <p className="text-sm text-gray-500">{flag.description}</p>}
      </div>
      <EventButtonRow 
        items={flagItems.slice(0, 4)} 
        onSelect={(item) => onFlagValueSelect(item.name)} 
      />
      {flagItems.length > 4 && (
        <EventButtonRow 
          items={flagItems.slice(4, 8)} 
          onSelect={(item) => onFlagValueSelect(item.name)} 
        />
      )}
    </div>
  );
};

export default FlagStep;
