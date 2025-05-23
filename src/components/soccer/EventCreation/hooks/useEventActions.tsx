
import { useSoccer, TeamType } from "@/context/SoccerContext";
import { 
  useEventValidation, 
  useKeyboardShortcuts,
  useSaveEvent,
  useVideoTimeCapture
} from "./eventActions";
import { useWizardState } from "./useWizardState";

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
  
  // Get access to wizard state for proper reset
  const { resetWizard } = useWizardState();
  
  // Use validation hook
  const { validateEvent, toast } = useEventValidation();
  
  // Use event creation hook
  const { createEventPayload } = useSaveEvent();
  
  // Capture video time when event type is selected (changed from category to type)
  useVideoTimeCapture({
    selectedEventType,
    videoTime,
    loggedVideoTime,
    setLoggedVideoTime
  });

  const handleSaveEvent = () => {
    console.log("Saving event...");
    // Validate event data - removed selectedEventType check
    if (!validateEvent(selectedPlayer, selectedLocation)) {
      console.log("Event validation failed");
      return;
    }

    // Create event payload
    const eventPayload = createEventPayload(
      gameTime,
      loggedVideoTime,
      videoTime,
      selectedPlayer,
      selectedTeam as TeamType,
      selectedLocation,
      selectedEventCategory,
      selectedEventType,
      selectedEventDetails
    );
    
    // Add the event
    addEvent(eventPayload);
    console.log("Event added:", eventPayload);

    // Reset the logged video time after adding event
    setLoggedVideoTime("");
    
    // Reset wizard state completely
    resetWizard();

    toast({
      title: "Event Saved",
      description: `${eventPayload.eventName} event has been saved`
    });
    
    console.log("Event saved successfully, state reset");
  };

  const handleCancelEvent = () => {
    // Reset soccer context state
    resetEventSelection();
    
    // Reset wizard state to ensure UI returns to initial state
    resetWizard(); 
    
    // Clear any logged video time
    setLoggedVideoTime("");
    
    toast({
      title: "Event cancelled",
      description: "The event creation has been cancelled"
    });
    
    console.log("Event creation cancelled, state reset");
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
