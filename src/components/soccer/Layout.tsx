
import React from "react";
import BrowserUI from "./BrowserUI";
import VideoPlayer from "./VideoPlayer";
import EventCreation from "./EventCreation";
import RightPanel from "./RightPanel";
import CustomHeader from "./CustomHeader";

export const SoccerLayout: React.FC = () => {
  return (
    <div className="bg-white overflow-hidden relative">
      <BrowserUI />
      <CustomHeader />
      <div className="flex w-full items-center gap-[30px] justify-between flex-1 flex-wrap h-full p-5 max-md:max-w-full">
        <div className="self-stretch min-w-60 w-[1083px] my-auto max-md:max-w-full">
          <VideoPlayer />
          <EventCreation />
        </div>
        <RightPanel />
      </div>
    </div>
  );
};

export default SoccerLayout;
