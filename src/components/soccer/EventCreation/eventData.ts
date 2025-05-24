
import { AnnotationLabel } from "@/types/annotation";

// Define the TreeEvent type that was missing
export interface TreeEvent {
  id: string;
  name: string;
  hotkey: string;
}

// Legacy pressure and body part options (kept for backward compatibility)
export const pressureOptions = [
  { id: "low", name: "Low", hotkey: "L" },
  { id: "medium", name: "Medium", hotkey: "M" },
  { id: "high", name: "High", hotkey: "H" }
];

export const bodyPartOptions = [
  { id: "head", name: "Head", hotkey: "H" },
  { id: "foot", name: "Foot", hotkey: "F" },
  { id: "chest", name: "Chest", hotkey: "C" }
];

// Helper to get current events based on the selected category
export const getCategoryEvents = (category: string | null): AnnotationLabel[] => {
  // This function is now deprecated as we use useAnnotationLabels hook
  // but kept for backward compatibility
  return [];
};
