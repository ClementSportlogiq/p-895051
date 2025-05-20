
import { AnnotationLabel } from "@/types/annotation";

// Define the TreeEvent type that was missing
export interface TreeEvent {
  id: string;
  name: string;
  hotkey: string;
}

// Define pressure options
export const pressureOptions = [
  { id: "pressure", name: "Pressure", hotkey: "Q" },
  { id: "noPressure", name: "No Pressure", hotkey: "W" },
];

// Define body part options
export const bodyPartOptions = [
  { id: "leftFoot", name: "Left Foot", hotkey: "Q" },
  { id: "rightFoot", name: "Right Foot", hotkey: "W" },
  { id: "head", name: "Head", hotkey: "E" },
  { id: "other", name: "Other", hotkey: "R" },
  { id: "leftHand", name: "Left Hand", hotkey: "A" },
  { id: "rightHand", name: "Right Hand", hotkey: "S" },
  { id: "bothHands", name: "Both Hands", hotkey: "D" },
];

// Helper to get current events based on the selected category
export const getCategoryEvents = (category: string | null): AnnotationLabel[] => {
  // This function is now deprecated as we use useAnnotationLabels hook
  // but kept for backward compatibility
  return [];
};
