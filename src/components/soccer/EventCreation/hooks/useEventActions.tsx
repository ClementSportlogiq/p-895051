
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
  const { resetWizard, resetState } = useWizardState();
  
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

  // Function to perform a thorough reset of all state
  const performThoroughReset = () => {
    console.log("Performing thorough reset of all state");
    
    try {
      // First reset the detailed wizard state (selections, flags, etc.)
      resetState();
      
      // Reset the soccer context state
      resetEventSelection();
      
      // Reset the wizard to default view (calls resetState internally too but better to be explicit)
      resetWizard();
      
      // Reset logged video time
      setLoggedVideoTime("");
      
      console.log("All state successfully reset");
    } catch (error) {
      console.error("Error during state reset:", error);
    }
  };

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

    // Perform thorough reset of all state
    performThoroughReset();

    toast({
      title: "Event Saved",
      description: `${eventPayload.eventName} event has been saved`
    });
    
    console.log("Event saved successfully, state fully reset");
  };

  const handleCancelEvent = () => {
    // Perform thorough reset of all state
    performThoroughReset();
    
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
