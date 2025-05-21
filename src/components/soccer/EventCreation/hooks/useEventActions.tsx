
import { useSoccer, TeamType } from "@/context/SoccerContext";
import { 
  useEventValidation, 
  useKeyboardShortcuts,
  useSaveEvent,
  useVideoTimeCapture
} from "./eventActions";

interface UseEventActionsProps {
  gameTime: string;
  videoTime: string;
  loggedVideoTime: string;
  setLoggedVideoTime: (time: string) => void;
}

export function useEventActions({ 
  gameTime, 
  videoTime, 
  loggedVideoTime, 
  setLoggedVideoTime 
}: UseEventActionsProps) {
  const { 
    selectedPlayer, 
    selectedTeam, 
    selectedLocation, 
    selectedEventCategory,
    selectedEventType,
    selectedEventDetails,
    addEvent,
    resetEventSelection
  } = useSoccer();
  
  // Use validation hook
  const { validateEvent, toast } = useEventValidation();
  
  // Use event creation hook
  const { createEventPayload } = useSaveEvent();
  
  // Capture video time when event category is selected
  useVideoTimeCapture({
    selectedEventCategory,
    videoTime,
    loggedVideoTime,
    setLoggedVideoTime
  });

  const handleSaveEvent = () => {
    // Validate event data
    if (!validateEvent(selectedPlayer, selectedLocation, selectedEventType)) {
      return;
    }

    // Create event payload
    const eventPayload = createEventPayload(
      gameTime,
      loggedVideoTime,
      videoTime,
      selectedPlayer,
      selectedTeam as TeamType, // Ensure it's cast to TeamType
      selectedLocation,
      selectedEventCategory,
      selectedEventType,
      selectedEventDetails
    );
    
    // Add the event
    addEvent(eventPayload);

    // Reset the logged video time after adding event
    setLoggedVideoTime("");

    toast({
      title: "Event Saved",
      description: `${eventPayload.eventName} event has been saved`
    });
  };

  const handleCancelEvent = () => {
    resetEventSelection();
    setLoggedVideoTime("");
    toast({
      title: "Event cancelled",
      description: "The event creation has been cancelled"
    });
  };

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onSave: handleSaveEvent,
    onCancel: handleCancelEvent
  });

  return {
    handleSaveEvent,
    handleCancelEvent
  };
}

export default useEventActions;
