import React from "react";
import KeyActorSelector from "./KeyActorSelector";
import EventTree from "./EventTree";
import LocationPicker from "./LocationPicker";

export const EventCreation: React.FC = () => {
  return (
    <div className="bg-white border min-h-[397px] w-full overflow-hidden mt-[19px] border-black border-solid max-md:max-w-full">
      <KeyActorSelector />
      <div className="flex min-h-[237px] w-full items-stretch flex-wrap border-black border-t max-md:max-w-full">
        <EventTree />
        <LocationPicker />
      </div>
      <div className="flex min-h-12 w-full items-center gap-2.5 text-base text-[rgba(137,150,159,1)] font-normal pl-4 border-black border-t max-md:max-w-full">
        <div className="self-stretch border min-h-7 gap-2 my-auto px-3 py-1 rounded-2xl border-[rgba(137,150,159,1)] border-solid">
          Select An Event
        </div>
      </div>
      <div className="bg-white border flex w-full gap-4 text-base font-normal flex-wrap p-4 border-black border-solid max-md:max-w-full">
        <div className="self-stretch bg-[rgba(137,150,159,1)] min-w-60 gap-2 text-white flex-1 shrink basis-[0%] px-2 py-1.5 max-md:max-w-full">
          Save (B or Enter)
        </div>
        <div className="self-stretch bg-white border min-w-60 gap-2 text-[rgba(34,34,34,1)] flex-1 shrink basis-[0%] px-2 py-1.5 border-[rgba(137,150,159,1)] border-solid max-md:max-w-full">
          Cancel (ESC)
        </div>
      </div>
    </div>
  );
};

export default EventCreation;
