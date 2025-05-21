
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
    const displayName = `${selectedPlayer.number} ${selectedPlayer.name} (${selectedTeam})`;
    
    return {
      id: uuidv4(),
      gameTime,
      videoTime: loggedVideoTime || videoTime,
      player: selectedPlayer,
      team: selectedTeam,
      location: selectedLocation,
      eventName: displayName,
      eventDetails: selectedEventType,
      category: selectedEventCategory,
      additionalDetails: selectedEventDetails || undefined
    };
  };
  
  return { createEventPayload };
}

export default useSaveEvent;
