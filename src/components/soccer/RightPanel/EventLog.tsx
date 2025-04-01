import React from "react";
import { useSoccer } from "@/context/SoccerContext";
import { Trash2 } from "lucide-react";

export const EventLog: React.FC = () => {
  const { events, removeEvent } = useSoccer();

  return (
    <div className="border w-full overflow-hidden font-normal flex-1 mt-6 border-black border-solid max-md:max-w-full">
      <div className="border flex w-full items-center gap-2 flex-wrap p-2 border-black border-solid max-md:max-w-full">
        <div className="self-stretch whitespace-nowrap grow shrink w-[78px] my-auto">
          <div className="text-[rgba(34,34,34,1)] text-xs">Teams</div>
          <div className="rounded bg-[rgba(137,150,159,1)] flex min-h-8 w-full items-center gap-2 text-base text-white pl-2 pr-1 py-1">
            <div className="self-stretch flex-1 shrink basis-[0%] my-auto">
              Both
            </div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/e77b69f6e966445580894134b3c026b9/e1ffce6076d664a08a2212fe4069cb4f15270929?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
            />
          </div>
        </div>
        <div className="self-stretch bg-[rgba(137,150,159,1)] gap-2 text-base text-white my-auto px-2 py-1.5">
          Highlight My Events
        </div>
        <div className="self-stretch bg-[rgba(137,150,159,1)] gap-2 text-base text-white my-auto px-2 py-1.5">
          Jump to QA Error
        </div>
        <div className="self-stretch bg-[rgba(137,150,159,1)] gap-2 text-base text-white my-auto px-2 py-1.5">
          Hide Shift
        </div>
        <div className="self-stretch bg-[rgba(137,150,159,1)] gap-2 text-base text-white my-auto px-2 py-1.5">
          Batch Delete
        </div>
      </div>
      <div className="flex w-full text-base text-black whitespace-nowrap flex-wrap max-md:max-w-full">
        <div className="self-stretch border min-h-10 gap-4 w-[190px] px-4 py-2.5 border-black border-solid">
          Time
        </div>
        <div className="self-stretch flex-1 shrink basis-[0%] border min-w-60 min-h-10 gap-1 px-4 py-2.5 border-black border-solid max-md:max-w-full">
          Event
        </div>
      </div>
      <div className="w-full text-base text-black flex-1 max-md:max-w-full">
        <EventLogItem isHalfMarker type="start" />
        
        {/* Display user events */}
        {events.map(event => (
          <EventLogItem 
            key={event.id}
            id={event.id}
            gameTime={event.gameTime}
            videoTime={event.videoTime}
            eventName={event.eventName}
            eventDetails={event.eventDetails}
            onDelete={removeEvent}
          />
        ))}
        
        <EventLogItem isHalfMarker type="end" />
      </div>
    </div>
  );
};

interface EventLogItemProps {
  isHalfMarker?: boolean;
  type?: "start" | "end";
  id?: string;
  gameTime?: string;
  videoTime?: string;
  eventName?: string;
  eventDetails?: string;
  onDelete?: (id: string) => void;
}

const EventLogItem: React.FC<EventLogItemProps> = ({ 
  isHalfMarker, 
  type,
  id,
  gameTime = "Game Time",
  videoTime = "Video Time",
  eventName = "Event Name",
  eventDetails = "Event Details",
  onDelete
}) => {
  // Set specific game times for half markers
  let displayGameTime = gameTime;
  if (isHalfMarker && type === "start") {
    displayGameTime = "00:00";
  } else if (isHalfMarker && type === "end") {
    displayGameTime = "45:00";
  }

  const handleDelete = () => {
    if (id && onDelete) {
      onDelete(id);
    }
  };

  return (
    <div
      className={`flex w-full items-stretch flex-wrap ${isHalfMarker ? "border-l-4 border-black" : ""} max-md:max-w-full`}
    >
      <div className="border w-[190px] p-4 border-black border-solid">
        <div>{displayGameTime}</div>
        <div className={type ? "mt-1" : "flex-1 mt-1"}>{videoTime}</div>
      </div>
      <div
        className={`border ${!isHalfMarker ? "flex min-w-60 items-center gap-1 flex-wrap" : ""} h-full flex-1 shrink basis-[0%] p-4 border-black border-solid max-md:max-w-full`}
      >
        {!isHalfMarker ? (
          <>
            <div className="self-stretch flex min-w-60 items-center gap-2 flex-1 shrink basis-[0%] my-auto max-md:max-w-full">
              <div className="self-stretch flex min-w-60 w-full flex-col items-stretch justify-center flex-1 shrink basis-[0%] my-auto max-md:max-w-full">
                <div className="max-md:max-w-full">{eventName}</div>
                <div className="max-md:max-w-full">{eventDetails}</div>
              </div>
            </div>
            <button 
              onClick={handleDelete}
              className="cursor-pointer"
            >
              <Trash2 className="w-6 h-6 text-red-500 hover:text-red-700 transition-colors" />
            </button>
          </>
        ) : (
          type === "start" ? "Half Start" : "Half End"
        )}
      </div>
    </div>
  );
};

export default EventLog;
