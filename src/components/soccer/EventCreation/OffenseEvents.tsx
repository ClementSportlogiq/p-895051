
import React from "react";
import EventButtonRow from "./EventButtonRow";
import { offenseEvents, TreeEvent } from "./eventData";

interface OffenseEventsProps {
  onEventSelect: (event: TreeEvent) => void;
}

export const OffenseEvents: React.FC<OffenseEventsProps> = ({ onEventSelect }) => {
  return (
    <>
      <EventButtonRow items={offenseEvents.slice(0, 4)} onSelect={onEventSelect} />
      <EventButtonRow items={offenseEvents.slice(4, 8)} onSelect={onEventSelect} />
    </>
  );
};

export default OffenseEvents;
