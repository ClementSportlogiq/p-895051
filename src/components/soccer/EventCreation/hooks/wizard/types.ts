import { AnnotationLabel, EventCategory, Flag, FlagCondition } from "@/types/annotation";

export interface WizardStateContextValue {
  currentStep: "default" | "pressure" | "bodyPart" | "flag";
  selectedCategory: EventCategory | null;
  selectedEvent: string | null;
  selectedEventName: string | null;
  currentLabelId: string;
  flagsForLabel: Flag[];
  availableFlags: Flag[];
  currentFlagIndex: number;
  flagConditions: FlagCondition[];
  handleCategorySelect: (category: EventCategory) => void;
  handleQuickEventSelect: (eventId: string) => void;
  handleEventSelect: (event: AnnotationLabel) => void;
  handlePressureSelect: (pressure: { id: string; name: string }) => void;
  handleBodyPartSelect: (bodyPart: { id: string; name: string }) => void;
  handleFlagValueSelect: (flagValue: string) => void;
  handleBack: () => void;
  resetWizard: () => void;
  resetState: () => void; // Add resetState to the interface
}
