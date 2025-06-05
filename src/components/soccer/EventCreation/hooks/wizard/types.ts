
import { 
  WizardStep, 
  EventCategory, 
  AnnotationLabel, 
  AnnotationFlag, 
  FlagValue,
  FlagCondition
} from "@/types/annotation";

// Export WizardStep so it can be imported elsewhere
export type { WizardStep };

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
  handleFlagValueSelect: (value: string) => void;
  handleBack: () => void;
  resetWizard: () => void;
}
