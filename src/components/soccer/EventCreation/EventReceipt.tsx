
import React from "react";
import { useSoccer } from "@/context/SoccerContext";

interface EventReceiptProps {
  loggedVideoTime: string;
}

export const EventReceipt: React.FC<EventReceiptProps> = ({ loggedVideoTime }) => {
  const { 
    selectedPlayer, 
    selectedTeam, 
    selectedEventCategory,
    selectedEventType,
    selectedEventDetails
  } = useSoccer();

  // If no selections have been made, show the default message
  if (!selectedPlayer && !selectedEventCategory && !selectedEventType && !loggedVideoTime) {
    return (
      <div className="border min-h-7 gap-2 px-3 py-1 rounded-2xl border-[rgba(137,150,159,1)] border-solid text-[rgba(137,150,159,1)]">
        Select An Event
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {selectedPlayer && (
        <div className="bg-[rgba(137,150,159,1)] text-white px-3 py-1 rounded-2xl">
          {selectedTeam} #{selectedPlayer.number} {selectedPlayer.name}
        </div>
      )}
      
      {loggedVideoTime && (
        <div className="bg-[rgba(137,150,159,1)] text-white px-3 py-1 rounded-2xl">
          {loggedVideoTime}
        </div>
      )}
      
      {selectedEventCategory && (
        <div className="bg-[rgba(137,150,159,1)] text-white px-3 py-1 rounded-2xl">
          {selectedEventCategory}
        </div>
      )}
      
      {selectedEventType && (
        <div className="bg-[rgba(137,150,159,1)] text-white px-3 py-1 rounded-2xl">
          {selectedEventType}
        </div>
      )}
      
      {/* Show Pressure pill in inactive state if not selected */}
      {!selectedEventDetails?.pressure && selectedEventType && selectedEventType.includes("Pass") && (
        <div className="border px-3 py-1 rounded-2xl border-[rgba(137,150,159,1)] text-[rgba(137,150,159,1)]">
          Pressure
        </div>
      )}
      
      {/* Show Body Part pill in inactive state if not selected */}
      {!selectedEventDetails?.bodyPart && selectedEventType && selectedEventType.includes("Pass") && (
        <div className="border px-3 py-1 rounded-2xl border-[rgba(137,150,159,1)] text-[rgba(137,150,159,1)]">
          Body Part
        </div>
      )}
      
      {/* Show flag values as pills */}
      {selectedEventDetails?.flags && Object.entries(selectedEventDetails.flags).map(([flagName, value]) => (
        <div key={flagName} className="bg-[rgba(137,150,159,1)] text-white px-3 py-1 rounded-2xl">
          {flagName}: {value}
        </div>
      ))}
    </div>
  );
};

export default EventReceipt;
