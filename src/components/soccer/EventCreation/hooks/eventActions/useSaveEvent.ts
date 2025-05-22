
import { v4 as uuidv4 } from "uuid";
import { TeamType, GameEvent, Player } from "@/context/SoccerContext";

export function useSaveEvent() {
  const createEventPayload = (
    gameTime: string,
    loggedVideoTime: string,
    videoTime: string,
    selectedPlayer: Player,
    selectedTeam: TeamType,
    selectedLocation: { x: number; y: number } | null,
    selectedEventCategory: string | null,
    selectedEventType: string,
    selectedEventDetails: Record<string, string | null> | null
  ): GameEvent => {
    // Create a clean display name without UUID information
    const displayName = selectedPlayer ? 
      `${selectedPlayer.number} ${selectedPlayer.name} (${selectedTeam})` : 
      `${selectedTeam} Event`;
    
    // Ensure event details doesn't contain any UUID patterns
    const cleanedEventType = selectedEventType ? 
      selectedEventType.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '') : 
      selectedEventType;
      
    return {
      id: uuidv4(),
      gameTime,
      videoTime: loggedVideoTime || videoTime,
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

export default useSaveEvent;
