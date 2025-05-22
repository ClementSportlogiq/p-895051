
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

  // Clean any UUID patterns from event type before display
  const cleanEventType = selectedEventType ? 
    selectedEventType.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '') : 
    null;

  // If no selections have been made, show the default message
  if (!selectedPlayer && !selectedEventCategory && !cleanEventType && !loggedVideoTime) {
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
      
      {cleanEventType && (
        <div className="bg-[rgba(137,150,159,1)] text-white px-3 py-1 rounded-2xl">
          {cleanEventType}
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
      
      {/* Show flag values as pills - ensure no UUIDs are displayed */}
      {selectedEventDetails?.flags && Object.entries(selectedEventDetails.flags).map(([flagName, value]) => {
        // Clean any UUID patterns from flag value
        const cleanValue = value ? 
          String(value).replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '') : 
          value;
          
        return (
          <div key={flagName} className="bg-[rgba(137,150,159,1)] text-white px-3 py-1 rounded-2xl">
            {flagName}: {cleanValue}
          </div>
        );
      })}
    </div>
  );
};

export default EventReceipt;
