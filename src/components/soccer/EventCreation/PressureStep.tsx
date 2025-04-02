
import React from "react";
import EventButtonRow from "./EventButtonRow";
import { pressureOptions, TreeEvent } from "./eventData";

interface PressureStepProps {
  onPressureSelect: (pressure: TreeEvent) => void;
}

export const PressureStep: React.FC<PressureStepProps> = ({ onPressureSelect }) => {
  return (
    <>
      <div className="text-black max-md:max-w-full">
        Select Pressure
      </div>
      <EventButtonRow items={pressureOptions} onSelect={onPressureSelect} />
    </>
  );
};

export default PressureStep;
