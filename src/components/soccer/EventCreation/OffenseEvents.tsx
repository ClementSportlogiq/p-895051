
import React from "react";
import EventButtonRow from "./EventButtonRow";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";
import { AnnotationLabel } from "@/types/annotation";

interface OffenseEventsProps {
  onEventSelect: (event: AnnotationLabel) => void;
}

export const OffenseEvents: React.FC<OffenseEventsProps> = ({ onEventSelect }) => {
  const { getLabelsByCategory } = useAnnotationLabels();
  const offenseLabels = getLabelsByCategory("offense");
  
  // Split labels into rows of 4 for better UI organization
  const firstRow = offenseLabels.slice(0, 4);
  const secondRow = offenseLabels.slice(4, 8);
  
  return (
    <>
      <EventButtonRow items={firstRow} onSelect={onEventSelect} />
      {secondRow.length > 0 && (
        <EventButtonRow items={secondRow} onSelect={onEventSelect} />
      )}
    </>
  );
};

export default OffenseEvents;
