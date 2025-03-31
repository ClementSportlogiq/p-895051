import React from "react";
import GameInfo from "./GameInfo";
import RosterPanel from "./RosterPanel";
import EventLog from "./EventLog";

export const RightPanel: React.FC = () => {
  return (
    <div className="self-stretch min-w-60 min-h-[958px] w-[767px] my-auto max-md:max-w-full">
      <GameInfo />
      <RosterPanel />
      <EventLog />
    </div>
  );
};

export default RightPanel;
