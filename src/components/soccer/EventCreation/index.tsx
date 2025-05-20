
import React from "react";
import KeyActorSelector from "./KeyActorSelector";
import EventTree from "./EventTree";
import LocationPicker from "./LocationPicker";
import EventReceipt from "./EventReceipt";
import ActionButtons from "./ActionButtons";
import useVideoTime from "./hooks/useVideoTime";
import useEventActions from "./hooks/useEventActions";

export const EventCreation: React.FC = () => {
  const { gameTime, videoTime, loggedVideoTime, setLoggedVideoTime } = useVideoTime();
  
  const { handleSaveEvent, handleCancelEvent } = useEventActions({
    gameTime,
    videoTime,
    loggedVideoTime,
    setLoggedVideoTime
  });

  return (
    <div className="bg-white border min-h-[397px] w-full overflow-hidden mt-[19px] border-black border-solid max-md:max-w-full">
      <KeyActorSelector />
      <div className="flex min-h-[237px] w-full items-stretch flex-wrap border-black border-t max-md:max-w-full">
        <EventTree />
        <LocationPicker />
      </div>
      <div className="flex min-h-12 w-full items-center gap-2.5 text-base font-normal pl-4 border-black border-t max-md:max-w-full">
        <EventReceipt loggedVideoTime={loggedVideoTime} />
      </div>
      <ActionButtons onSave={handleSaveEvent} onCancel={handleCancelEvent} />
    </div>
  );
};

export default EventCreation;
