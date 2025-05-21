
import React from "react";
import EventButtonRow from "./EventButtonRow";
import { AnnotationFlag, FlagValue } from "@/types/annotation";

interface FlagStepProps {
  flag: AnnotationFlag;
  onFlagValueSelect: (value: string) => void;
}

export const FlagStep: React.FC<FlagStepProps> = ({ flag, onFlagValueSelect }) => {
  // Convert flag values to the format expected by EventButtonRow
  const flagItems = flag.values.map((value, index) => {
    // Handle both string values (legacy) and FlagValue objects
    if (typeof value === 'string') {
      return {
        id: `${flag.id}-${index}`,
        name: value,
        hotkey: String.fromCharCode(81 + index), // Start from Q (ASCII 81) as fallback
        description: `${flag.name}: ${value}`
      };
    } else {
      return {
        id: `${flag.id}-${index}`,
        name: value.value,
        hotkey: value.hotkey,
        description: `${flag.name}: ${value.value}`
      };
    }
  });

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
