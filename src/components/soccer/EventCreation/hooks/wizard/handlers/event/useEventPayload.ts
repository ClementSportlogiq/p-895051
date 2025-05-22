
import { v4 as uuidv4 } from "uuid";
import { GameEvent } from "@/context/SoccerContext";

interface UseEventPayloadProps {
  sockerContext: any;
  gameTime: string;
  videoTime: string;
  loggedVideoTime: string;
}

export function useEventPayload({
  sockerContext,
  gameTime,
  videoTime,
  loggedVideoTime
}: UseEventPayloadProps) {
  
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
  
  return { createEventPayload };
}
