
import { useEffect } from "react";
import { EventDetails } from "@/types/annotation";
import { useSoccer } from "@/context/SoccerContext";

interface ContextUpdaterProps {
  selectedEvent: string | null;
  selectedEventName: string | null;
  selectedPressure: string | null;
  selectedBodyPart: string | null;
  selectedCategory: any;
  flagValues: Record<string, string>;
}

export function useContextUpdater({
  selectedEvent,
  selectedEventName,
  selectedPressure,
  selectedBodyPart,
  selectedCategory,
  flagValues
}: ContextUpdaterProps) {
  const { 
    setSelectedEventCategory, 
    setSelectedEventType,
    setSelectedEventDetails
  } = useSoccer();

  // Update the context when selections change
  useEffect(() => {
    setSelectedEventCategory(selectedCategory);
    
    // Set event details based on selection steps
    let details = "";
    if (selectedEvent && selectedEventName) {
      details = selectedEventName;
      if (selectedPressure) {
        details += ` (${selectedPressure})`;
      }
      if (selectedBodyPart) {
        details += ` - ${selectedBodyPart}`;
      }
      
      // Add flag values to details if available, but clean any UUID patterns
      const flagDetails = Object.entries(flagValues);
      if (flagDetails.length > 0) {
        flagDetails.forEach(([flagName, value]) => {
          // Ensure we're not adding UUID patterns to details
          const cleanValue = value ? 
            String(value).replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '') : 
            value;
          details += ` | ${flagName}: ${cleanValue}`;
        });
      }
    }
    
    // Clean final details string of any UUID patterns
    details = details.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '');
    
    setSelectedEventType(details);
    
    // Set additional details for context
    const additionalDetails: EventDetails = {
      pressure: selectedPressure || "",
      bodyPart: selectedBodyPart || "",
      flags: flagValues
    };
    
    // Fix: Cast the EventDetails to match what setSelectedEventDetails expects
    // This assumes that the SoccerContext is using a Record<string, string> type
    // for event details instead of the EventDetails type
    setSelectedEventDetails({
      pressure: selectedPressure || "",
      bodyPart: selectedBodyPart || "",
      // Instead of passing flags directly, we'll flatten the structure
      ...flagValues
    });
  }, [
    selectedEvent, 
    selectedEventName,
    selectedPressure, 
    selectedBodyPart, 
    selectedCategory, 
    flagValues, 
    setSelectedEventCategory, 
    setSelectedEventType, 
    setSelectedEventDetails
  ]);
}
