
import React from "react";
import EventButtonRow from "./EventButtonRow";
import { AnnotationFlag, FlagValue } from "@/types/annotation";

interface FlagStepProps {
  flag: AnnotationFlag;
  onFlagValueSelect: (value: string) => void;
}

export const FlagStep: React.FC<FlagStepProps> = ({ flag, onFlagValueSelect }) => {
  // Safety check for missing flag
  if (!flag || !flag.values) {
    console.error("Missing or invalid flag data in FlagStep", flag);
    return <div className="text-red-500">Error: Flag data is missing or invalid</div>;
  }

  // Convert flag values to the format expected by EventButtonRow
  const flagItems = Array.isArray(flag.values) ? flag.values.map((value, index) => {
    // Handle both string values (legacy) and FlagValue objects
    if (typeof value === 'string') {
      return {
        id: `${flag.id}-${index}`,
        name: value,
        hotkey: String.fromCharCode(81 + index), // Start from Q (ASCII 81) as fallback
        description: `${flag.name}: ${value}`
      };
    } else if (value && typeof value === 'object' && 'value' in value) {
      return {
        id: `${flag.id}-${index}`,
        name: value.value,
        hotkey: value.hotkey || String.fromCharCode(81 + index),
        description: `${flag.name}: ${value.value}`
      };
    } else {
      // Handle unexpected value format
      console.warn("Unexpected flag value format", value);
      return {
        id: `${flag.id}-${index}`,
        name: 'Unknown',
        hotkey: String.fromCharCode(81 + index),
        description: `${flag.name}: Unknown`
      };
    }
  }) : [];

  return (
    <div>
      <div className="text-black mb-3">
        <span className="font-medium">{flag.name}</span>
        {flag.description && <p className="text-sm text-gray-500">{flag.description}</p>}
      </div>
      {flagItems.length > 0 ? (
        <>
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
        </>
      ) : (
        <div className="text-gray-500">No values available for this flag</div>
      )}
    </div>
  );
};

export default FlagStep;
