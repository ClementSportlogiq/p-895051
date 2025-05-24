
import { useEffect } from "react";
import { useSoccer } from "@/context/SoccerContext";

interface UseContextUpdaterProps {
  selectedEvent: string | null;
  selectedEventName: string | null;
  selectedCategory: string | null;
  flagValues: Record<string, string>;
}

export function useContextUpdater({
  selectedEvent,
  selectedEventName,
  selectedCategory,
  flagValues
}: UseContextUpdaterProps) {
  const { 
    setSelectedEventType,
    setSelectedEventCategory,
    setSelectedEventDetails
  } = useSoccer();

  // Update context when selections change
  useEffect(() => {
    if (selectedEventName) {
      setSelectedEventType(selectedEventName);
    }
  }, [selectedEventName, setSelectedEventType]);

  useEffect(() => {
    if (selectedCategory) {
      setSelectedEventCategory(selectedCategory);
    }
  }, [selectedCategory, setSelectedEventCategory]);

  // Update event details with flags object structure
  useEffect(() => {
    // Convert the flagValues object to a properly formatted event details object
    const eventDetails = {
      flags: flagValues
    };
    
    setSelectedEventDetails(eventDetails);
  }, [flagValues, setSelectedEventDetails]);
}
