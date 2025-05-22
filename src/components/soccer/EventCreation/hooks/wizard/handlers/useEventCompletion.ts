
import { useToast } from "@/hooks/use-toast";
import { TeamType, GameEvent, Player } from "@/context/SoccerContext";
import { v4 as uuidv4 } from "uuid";

interface UseEventCompletionProps {
  selection: any;
  sockerContext: any;
  flagLogic: any;
  gameTime?: string;
  videoTime?: string;
  loggedVideoTime?: string;
  setLoggedVideoTime?: (time: string) => void;
}

export function useEventCompletion({ 
  selection, 
  sockerContext, 
  flagLogic,
  gameTime = "",
  videoTime = "",
  loggedVideoTime = "",
  setLoggedVideoTime
}: UseEventCompletionProps) {
  const { toast } = useToast();
  
  // Validate all required event components
  const validateEvent = () => {
    const { selectedPlayer, selectedLocation, selectedEventType } = sockerContext;
    
    if (!selectedPlayer) {
      toast({
        variant: "destructive",
        title: "Missing Player",
        description: "Please select a player before saving the event"
      });
      return false;
    }

    if (!selectedLocation) {
      toast({
        variant: "destructive",
        title: "Missing Location",
        description: "Please select a field location before saving the event"
      });
      return false;
    }

    // Fixed: Check for selectedEventType instead of selectedEvent
    if (!selectedEventType) {
      toast({
        variant: "destructive",
        title: "Missing Event Type",
        description: "Please select an event type before saving"
      });
      return false;
    }
    
    return true;
  };
  
  // Create event payload with consistent format
  const createEventPayload = (): GameEvent | null => {
    const { 
      selectedPlayer, 
      selectedTeam, 
      selectedLocation, 
      selectedEventCategory,
      selectedEventType,
      selectedEventDetails
    } = sockerContext;
    
    if (!selectedPlayer || !selectedTeam || !selectedEventType) {
      console.error("Missing required fields for event payload");
      return null;
    }
    
    // Create a clean display name without UUID information
    const displayName = selectedPlayer ? 
      `${selectedPlayer.number} ${selectedPlayer.name} (${selectedTeam})` : 
      `${selectedTeam} Event`;
    
    // Ensure event details doesn't contain any UUID patterns
    const cleanedEventType = selectedEventType ? 
      selectedEventType.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '') : 
      selectedEventType;
      
    // Use logged video time if available, otherwise use current video time
    const videoTimeToUse = loggedVideoTime || videoTime;
    console.log("Using video time for event:", videoTimeToUse, "Logged time was:", loggedVideoTime);
      
    return {
      id: uuidv4(),
      gameTime,
      videoTime: videoTimeToUse,
      player: selectedPlayer,
      team: selectedTeam,
      location: selectedLocation,
      eventName: displayName,
      eventDetails: cleanedEventType,
      category: selectedEventCategory,
      additionalDetails: selectedEventDetails || undefined
    };
  };

  // Complete the event creation with all validation and proper event creation
  const completeEventCreation = () => {
    console.log("Completing event creation with flags:", flagLogic.flagValues);
    
    // Validate required fields first
    if (!validateEvent()) {
      console.log("Event validation failed during flag completion");
      return;
    }
    
    // Create the complete event payload
    const eventPayload = createEventPayload();
    if (!eventPayload) {
      console.error("Failed to create event payload");
      return;
    }
    
    // Add event to context
    try {
      sockerContext.addEvent(eventPayload);
      console.log("Event added:", eventPayload);
      
      // Reset the logged video time if applicable
      if (setLoggedVideoTime) {
        setLoggedVideoTime("");
      }
      
      // Reset wizard state first to ensure UI resets immediately
      resetWizard();
      
      // Then reset the soccer context
      setTimeout(() => {
        sockerContext.resetEventSelection();
        console.log("Soccer context reset completed after wizard reset");
      }, 0);
      
      // Show success toast
      toast({
        title: "Event Saved",
        description: `${eventPayload.eventName} event has been saved`
      });
      
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        variant: "destructive",
        title: "Error Saving Event",
        description: "There was a problem saving your event"
      });
    }
  };

  // Reset all wizard state - thorough reset of all state variables
  const resetWizard = () => {
    console.log("resetWizard called - forcing complete wizard state reset");
    
    try {
      // Reset selection state - order matters for UI update
      // First reset the currentStep to ensure view changes immediately
      if (selection) {
        console.log("Before reset - currentStep:", selection.currentStep, "selectedCategory:", selection.selectedCategory);
        
        // Reset step first to trigger UI update
        selection.setCurrentStep("default");
        
        // Then reset all other selection states
        selection.setSelectedCategory(null);
        selection.setSelectedEvent(null);
        selection.setSelectedEventName(null);
        selection.setSelectedPressure(null);
        selection.setSelectedBodyPart(null);
        selection.setFlagConditions([]);
        
        console.log("After reset - currentStep:", "default", "selectedCategory:", null);
      }
      
      // Reset flag state
      if (flagLogic) {
        flagLogic.setCurrentLabelId("");
        flagLogic.setFlagsForLabel([]);
        flagLogic.setCurrentFlagIndex(0);
        flagLogic.setFlagValues({});
        flagLogic.setAvailableFlags([]);
      }
      
      // Force a UI update with a small delay if needed
      setTimeout(() => {
        console.log("Verifying reset state - currentStep should be 'default'");
        if (selection) {
          console.log("Verification - currentStep:", selection.currentStep, "selectedCategory:", selection.selectedCategory);
        }
      }, 0);
      
    } catch (error) {
      console.error("Error in resetWizard:", error);
    }
  };

  // Legacy method - now just calls resetWizard for backwards compatibility
  const resetState = () => {
    console.log("resetState called - redirecting to centralized resetWizard");
    resetWizard();
  };

  return {
    completeEventCreation,
    resetState,
    resetWizard
  };
}
