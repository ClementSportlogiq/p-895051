
import React from "react";
import EventButtonRow from "./EventButtonRow";
import { AnnotationFlag, FlagValue } from "@/types/annotation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface FlagStepProps {
  flag: AnnotationFlag;
  onFlagValueSelect: (value: string) => void;
}

export const FlagStep: React.FC<FlagStepProps> = ({ flag, onFlagValueSelect }) => {
  // Validate flag input
  if (!flag || !flag.values || !Array.isArray(flag.values)) {
    console.error("Invalid flag data received:", flag);
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Invalid flag data. Please go back and try again.
        </AlertDescription>
      </Alert>
    );
  }

  try {
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
      } else if (typeof value === 'object' && value !== null && 'value' in value && 'hotkey' in value) {
        return {
          id: `${flag.id}-${index}`,
          name: value.value,
          hotkey: value.hotkey,
          description: `${flag.name}: ${value.value}`
        };
      } else {
        // Unexpected format - create a placeholder
        console.warn("Unexpected flag value format:", value);
        return {
          id: `${flag.id}-${index}`,
          name: String(value), 
          hotkey: String.fromCharCode(81 + index),
          description: `${flag.name}: Unknown Value`
        };
      }
    });

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
          <div className="text-black">No values available for this flag.</div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error rendering flag step:", error);
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          An error occurred while rendering the flag step. Please go back and try again.
        </AlertDescription>
      </Alert>
    );
  }
};

export default FlagStep;
