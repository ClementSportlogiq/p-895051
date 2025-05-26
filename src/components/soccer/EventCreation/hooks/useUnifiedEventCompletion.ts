
import { useSoccer, TeamType } from "@/context/SoccerContext";
import { useEventValidation } from "./eventActions/useEventValidation";
import { useSaveEvent } from "./eventActions/useSaveEvent";

interface UseUnifiedEventCompletionProps {
  gameTime?: string;
  videoTime?: string;
  loggedVideoTime?: string;
  setLoggedVideoTime?: (time: string) => void;
  // Optional context overrides for wizard usage
  contextOverrides?: {
    selectedPlayer?: any;
    selectedTeam?: TeamType;
    selectedLocation?: any;
    selectedEventCategory?: string;
    selectedEventType?: string;
    selectedEventDetails?: any;
  };
}

export function useUnifiedEventCompletion({
  gameTime = "",
  videoTime = "",
  loggedVideoTime = "",
  setLoggedVideoTime,
  contextOverrides
}: UseUnifiedEventCompletionProps = {}) {
  const soccerContext = useSoccer();
  const { validateEvent, toast } = useEventValidation();
  const { createEventPayload } = useSaveEvent();

  // Use context overrides if provided, otherwise use soccer context
  const getEffectiveContext = () => {
    if (contextOverrides) {
      return {
        selectedPlayer: contextOverrides.selectedPlayer ?? soccerContext.selectedPlayer,
        selectedTeam: contextOverrides.selectedTeam ?? soccerContext.selectedTeam,
        selectedLocation: contextOverrides.selectedLocation ?? soccerContext.selectedLocation,
        selectedEventCategory: contextOverrides.selectedEventCategory ?? soccerContext.selectedEventCategory,
        selectedEventType: contextOverrides.selectedEventType ?? soccerContext.selectedEventType,
        selectedEventDetails: contextOverrides.selectedEventDetails ?? soccerContext.selectedEventDetails
      };
    }
    return {
      selectedPlayer: soccerContext.selectedPlayer,
      selectedTeam: soccerContext.selectedTeam,
      selectedLocation: soccerContext.selectedLocation,
      selectedEventCategory: soccerContext.selectedEventCategory,
      selectedEventType: soccerContext.selectedEventType,
      selectedEventDetails: soccerContext.selectedEventDetails
    };
  };

  const completeEvent = (resetCallback?: () => void) => {
    const context = getEffectiveContext();
    
    console.log("Completing event with unified system...");
    
    // Validate event data
    if (!validateEvent(context.selectedPlayer, context.selectedLocation)) {
      console.log("Event validation failed");
      return false;
    }

    // Determine video time to use
    const videoTimeToUse = loggedVideoTime || videoTime;

    // Create event payload
    const eventPayload = createEventPayload(
      gameTime,
      videoTimeToUse,
      videoTime,
      context.selectedPlayer,
      context.selectedTeam as TeamType,
      context.selectedLocation,
      context.selectedEventCategory,
      context.selectedEventType,
      context.selectedEventDetails
    );
    
    try {
      // Add the event
      soccerContext.addEvent(eventPayload);
      console.log("Event added:", eventPayload);

      // Reset logged video time if setter is provided
      if (setLoggedVideoTime) {
        setLoggedVideoTime("");
      }
      
      // Call custom reset callback if provided
      if (resetCallback) {
        resetCallback();
      } else {
        // Default reset behavior
        soccerContext.resetEventSelection();
      }

      // Show success toast
      toast({
        title: "Event Saved",
        description: `${context.selectedEventType || 'Event'} has been saved`
      });
      
      console.log("Event completed successfully(TEST)");
      return true;
    } catch (error) {
      console.error("Error completing event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save event"
      });
      return false;
    }
  };

  const cancelEvent = (resetCallback?: () => void) => {
    // Call custom reset callback if provided
    if (resetCallback) {
      resetCallback();
    } else {
      // Default reset behavior
      soccerContext.resetEventSelection();
    }
    
    // Clear any logged video time if setter is provided
    if (setLoggedVideoTime) {
      setLoggedVideoTime("");
    }
    
    toast({
      title: "Event cancelled",
      description: "The event creation has been cancelled"
    });
    
    console.log("Event creation cancelled");
  };

  return {
    completeEvent,
    cancelEvent,
    validateEvent,
    createEventPayload
  };
}

export default useUnifiedEventCompletion;
