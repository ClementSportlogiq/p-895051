
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
  // Optional wizard state for direct wizard resets
  wizardState?: {
    resetWizard?: () => void;
  };
}

export function useUnifiedEventCompletion({
  gameTime = "",
  videoTime = "",
  loggedVideoTime = "",
  setLoggedVideoTime,
  contextOverrides,
  wizardState
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

  // Enhanced unified reset function with comprehensive state clearing
  const performReset = () => {
    try {
      console.log("Starting unified reset process...");
      
      // Use wizard's own reset function if available (preferred method)
      if (wizardState?.resetWizard) {
        console.log("Using wizard's resetWizard function");
        wizardState.resetWizard();
      }
      
      // Always reset soccer context to ensure consistency
      console.log("Resetting soccer context");
      soccerContext.resetEventSelection();
      
      // Reset logged video time if setter is provided
      if (setLoggedVideoTime) {
        console.log("Resetting logged video time");
        setLoggedVideoTime("");
      }
      
      console.log("Unified reset process completed successfully");
    } catch (error) {
      console.error("Error in unified reset:", error);
    }
  };

  const completeEvent = (customResetCallback?: () => void) => {
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

      // Use custom reset callback if provided, otherwise use unified reset
      if (customResetCallback) {
        console.log("Using custom reset callback");
        customResetCallback();
      } else {
        console.log("Using unified reset");
        performReset();
      }

      // Show success toast
      toast({
        title: "Event Saved",
        description: `${context.selectedEventType || 'Event'} has been saved`
      });
      
      console.log("Event completed successfully via unified system");
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

  const cancelEvent = (customResetCallback?: () => void) => {
    console.log("Cancelling event via unified system...");
    
    // Use custom reset callback if provided, otherwise use unified reset
    if (customResetCallback) {
      console.log("Using custom reset callback for cancel");
      customResetCallback();
    } else {
      console.log("Using unified reset for cancel");
      performReset();
    }
    
    toast({
      title: "Event cancelled",
      description: "The event creation has been cancelled"
    });
    
    console.log("Event creation cancelled via unified system");
  };

  return {
    completeEvent,
    cancelEvent,
    performReset,
    validateEvent,
    createEventPayload
  };
}

export default useUnifiedEventCompletion;
