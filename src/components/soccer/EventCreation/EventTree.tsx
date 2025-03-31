import React from "react";

export const EventTree: React.FC = () => {
  return (
    <div className="min-w-60 text-base text-white font-normal flex-1 shrink basis-[0%] p-4 max-md:max-w-full">
      <div className="text-black max-md:max-w-full">
        Quick Events (Press SHIFT for 1-touch events)
      </div>
      <div className="flex w-full items-center gap-2 flex-wrap mt-2 max-md:max-w-full">
        <div className="self-stretch bg-[rgba(8,35,64,1)] gap-2 my-auto px-2 py-1.5">
          Pass (Q)
        </div>
        <div className="self-stretch bg-[rgba(8,35,64,1)] gap-2 my-auto px-2 py-1.5">
          Reception (W)
        </div>
        <div className="self-stretch bg-[rgba(8,35,64,1)] gap-2 my-auto px-2 py-1.5">
          LBR (E)
        </div>
        <div className="self-stretch bg-[rgba(8,35,64,1)] gap-2 my-auto px-2 py-1.5">
          Interception (R)
        </div>
      </div>
      <div className="text-black mt-2">Event Categories</div>
      <div className="flex w-full items-center gap-2 flex-wrap mt-2 max-md:max-w-full">
        <div className="self-stretch bg-[rgba(8,35,64,1)] gap-2 my-auto px-2 py-1.5">
          Offense (A)
        </div>
        <div className="self-stretch bg-[rgba(8,35,64,1)] gap-2 my-auto px-2 py-1.5">
          Defense (S)
        </div>
        <div className="self-stretch bg-[rgba(8,35,64,1)] gap-2 my-auto px-2 py-1.5">
          Reception/LBR (D)
        </div>
        <div className="self-stretch bg-[rgba(8,35,64,1)] gap-2 my-auto px-2 py-1.5">
          Goalkeeper (R)
        </div>
      </div>
      <div className="flex w-full items-center gap-2 flex-wrap mt-2 max-md:max-w-full">
        <div className="self-stretch bg-[rgba(8,35,64,1)] gap-2 my-auto px-2 py-1.5">
          Deadball (Z)
        </div>
        <div className="self-stretch bg-[rgba(8,35,64,1)] gap-2 my-auto px-2 py-1.5">
          Player Action (X)
        </div>
        <div className="self-stretch bg-[rgba(8,35,64,1)] gap-2 my-auto px-2 py-1.5">
          Infractions (C)
        </div>
      </div>
    </div>
  );
};

export default EventTree;
