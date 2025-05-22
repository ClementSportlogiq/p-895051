
import React, { createContext, useState, useContext, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";

export type TeamType = "MTL" | "ATL";
export type Player = {
  number: number;
  name: string;
  position: string;
  isCaptain?: boolean;
};

interface SoccerContextType {
  selectedTeam: TeamType;
  setSelectedTeam: (team: TeamType) => void;
  selectedPlayer: Player | null;
  setSelectedPlayer: (player: Player | null) => void;
  selectedLocation: { x: number; y: number } | null;
  setSelectedLocation: (location: { x: number; y: number } | null) => void;
  selectedEventCategory: string | null;
  setSelectedEventCategory: (category: string | null) => void;
  selectedEventType: string | null;
  setSelectedEventType: (type: string | null) => void;
  selectedEventDetails: Record<string, string | null> | null;
  setSelectedEventDetails: (details: Record<string, string | null> | null) => void;
  mltRoster: Player[];
  atlRoster: Player[];
  addEvent: (event: GameEvent) => void;
  removeEvent: (id: string) => void;
  events: GameEvent[];
  resetEventSelection: () => void;
}

export interface GameEvent {
  id: string;
  gameTime: string;
  videoTime: string;
  player: Player | null;
  team: TeamType;
  location: { x: number; y: number } | null;
  eventName: string;
  eventDetails: string;
  category?: string | null;
  additionalDetails?: Record<string, string | null>;
}

const SoccerContext = createContext<SoccerContextType | undefined>(undefined);

export const mltRoster: Player[] = [
  { number: 2, name: "Hernandez", position: "CD" },
  { number: 3, name: "Williams", position: "LFB" },
  { number: 5, name: "Gregersen", position: "RFB" },
  { number: 8, name: "Muyumba", position: "RW" },
  { number: 9, name: "Saba", position: "S" },
  { number: 10, name: "Slisz", position: "CD" },
  { number: 11, name: "Lennon", position: "DM", isCaptain: true },
  { number: 13, name: "Marx", position: "RW" },
  { number: 16, name: "Xande Silva", position: "LW" },
  { number: 19, name: "Liu", position: "CD" },
  { number: 20, name: "Sukumaran", position: "CD" },
  { number: 21, name: "Hogg", position: "LFB" },
  { number: 23, name: "Mueller", position: "S" },
  { number: 24, name: "Cobb", position: "CD" },
  { number: 25, name: "Spec", position: "CD" },
  { number: 28, name: "Gervais", position: "RFB" },
  { number: 29, name: "Rios", position: "CMI" },
  { number: 32, name: "Morin", position: "DM" },
];

// Generate ATL roster with different players
export const atlRoster: Player[] = [
  { number: 1, name: "Johnson", position: "GK" },
  { number: 4, name: "Robinson", position: "CB", isCaptain: true },
  { number: 6, name: "Gutierrez", position: "CDM" },
  { number: 7, name: "Martinez", position: "LW" },
  { number: 12, name: "Almada", position: "CAM" },
  { number: 14, name: "Wiley", position: "LB" },
  { number: 15, name: "Lennon", position: "RB" },
  { number: 17, name: "Araujo", position: "RW" },
  { number: 18, name: "Mosquera", position: "ST" },
  { number: 22, name: "Campbell", position: "CB" },
  { number: 26, name: "Wolff", position: "CM" },
  { number: 27, name: "Rios", position: "CDM" },
  { number: 30, name: "Guzan", position: "GK" },
  { number: 31, name: "Fortune", position: "LM" },
  { number: 33, name: "Centeno", position: "RM" },
  { number: 35, name: "Chol", position: "ST" },
  { number: 36, name: "Brennan", position: "CB" },
  { number: 42, name: "McFadden", position: "RW" },
];

export const SoccerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedTeam, setSelectedTeam] = useState<TeamType>("MTL");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ x: number; y: number } | null>(null);
  const [selectedEventCategory, setSelectedEventCategory] = useState<string | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [selectedEventDetails, setSelectedEventDetails] = useState<Record<string, string | null> | null>(null);
  const [events, setEvents] = useState<GameEvent[]>([]);

  const resetEventSelection = () => {
    setSelectedPlayer(null);
    setSelectedLocation(null);
    setSelectedEventCategory(null);
    setSelectedEventType(null);
    setSelectedEventDetails(null);
  };

  const addEvent = (event: GameEvent) => {
    setEvents((prev) => [...prev, event]);
    // Reset state after adding an event
    resetEventSelection();
  };

  const removeEvent = (id: string) => {
    if (!id) {
      console.error("Cannot remove event: Invalid event ID");
      toast({
        title: "Error",
        description: "Failed to remove event: Invalid event ID",
        variant: "destructive"
      });
      return;
    }

    console.log(`Attempting to remove event with ID: ${id}`);
    
    setEvents((prev) => {
      // Find event to confirm it exists before removal
      const eventToRemove = prev.find(event => event.id === id);
      
      if (!eventToRemove) {
        console.warn(`No event found with ID: ${id}`);
        toast({
          title: "Warning",
          description: "Event not found",
          variant: "destructive"
        });
        return prev;
      }
      
      console.log(`Removing event: ${eventToRemove.eventName}`);
      
      // Filter out the event with the given ID
      const updatedEvents = prev.filter(event => event.id !== id);
      
      // Provide visual confirmation of success
      toast({
        title: "Success",
        description: "Event removed successfully"
      });
      
      console.log(`Events after removal: ${updatedEvents.length}`);
      return updatedEvents;
    });
  };

  return (
    <SoccerContext.Provider
      value={{
        selectedTeam,
        setSelectedTeam,
        selectedPlayer,
        setSelectedPlayer,
        selectedLocation,
        setSelectedLocation,
        selectedEventCategory,
        setSelectedEventCategory,
        selectedEventType,
        setSelectedEventType,
        selectedEventDetails,
        setSelectedEventDetails,
        mltRoster,
        atlRoster,
        addEvent,
        removeEvent,
        events,
        resetEventSelection
      }}
    >
      {children}
    </SoccerContext.Provider>
  );
};

export const useSoccer = () => {
  const context = useContext(SoccerContext);
  if (context === undefined) {
    throw new Error("useSoccer must be used within a SoccerProvider");
  }
  return context;
};
