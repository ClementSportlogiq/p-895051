
import { AnnotationLabel } from "@/types/annotation";

// Define the TreeEvent type that was missing
export interface TreeEvent {
  id: string;
  name: string;
  hotkey: string;
}

// Helper to get current events based on the selected category
export const getCategoryEvents = (category: string | null): AnnotationLabel[] => {
  // This function is now deprecated as we use useAnnotationLabels hook
  // but kept for backward compatibility
  return [];
};
