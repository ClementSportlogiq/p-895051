
import { 
  WizardStep, 
  EventCategory, 
  AnnotationLabel, 
  AnnotationFlag, 
  FlagValue,
  FlagCondition
} from "@/types/annotation";

export interface WizardStateContextValue {
  currentStep: WizardStep;
  selectedCategory: EventCategory | null;
  selectedEvent: string | null;
  selectedEventName: string | null;
  currentLabelId: string | null;
  flagsForLabel: AnnotationFlag[];
  availableFlags: AnnotationFlag[];
  currentFlagIndex: number;
  flagConditions: FlagCondition[];
  handleCategorySelect: (category: EventCategory) => void;
  handleQuickEventSelect: (eventId: string) => void;
  handleEventSelect: (event: AnnotationLabel) => void;
  handlePressureSelect: (pressure: {id: string; name: string; hotkey: string}) => void;
  handleBodyPartSelect: (bodyPart: {id: string; name: string; hotkey: string}) => void;
  handleFlagValueSelect: (value: string) => void;
  handleBack: () => void;
  resetWizard: () => void;
  // Add the missing properties to match implementation
  selection: any; // State from useSelectionState
  flagLogic: any; // State from useFlagLogic
}
