
import React from "react";
import EventButtonRow from "./EventButtonRow";
import { bodyPartOptions, TreeEvent } from "./eventData";

interface BodyPartStepProps {
  onBodyPartSelect: (bodyPart: TreeEvent) => void;
}

export const BodyPartStep: React.FC<BodyPartStepProps> = ({ onBodyPartSelect }) => {
  return (
    <>
      <div className="text-black max-md:max-w-full">
        Select Body Part
      </div>
      <EventButtonRow items={bodyPartOptions.slice(0, 4)} onSelect={onBodyPartSelect} />
      <EventButtonRow items={bodyPartOptions.slice(4)} onSelect={onBodyPartSelect} />
    </>
  );
};

export default BodyPartStep;
