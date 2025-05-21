
import { v4 as uuidv4 } from "uuid";

export function useSaveEvent() {
  const createEventPayload = (
    gameTime: string,
    loggedVideoTime: string,
    videoTime: string,
    selectedPlayer: any,
    selectedTeam: string,
    selectedLocation: any,
    selectedEventCategory: any,
    selectedEventType: any,
    selectedEventDetails: any
  ) => {
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
