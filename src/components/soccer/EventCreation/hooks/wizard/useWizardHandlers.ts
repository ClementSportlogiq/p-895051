
import { useCallback } from "react";
import { AnnotationLabel, EventCategory } from "@/types/annotation";
import { WizardStep } from "@/types/annotation";

interface UseWizardHandlersProps {
  selection: {
    setSelectedCategory: (category: EventCategory | null) => void;
    setSelectedEvent: (event: string | null) => void; // Changed to string
    setSelectedEventName: (name: string | null) => void;
    setCurrentStep: (step: WizardStep) => void;
    setFlagConditions: (conditions: any[]) => void;
    currentStep: WizardStep;
    selectedCategory: EventCategory | null;
    selectedEvent: string | null; // Changed to string
    selectedEventName: string | null;
  };
  flagLogic: {
    flagsForLabel: any[];
    availableFlags: any[];
    currentFlagIndex: number;
    setCurrentFlagIndex: (index: number) => void;
    setFlagValues: (values: Record<string, string>) => void;
    flagValues: Record<string, string>;
    loadFlagsForLabel: (labelId: string) => void;
  };
  sockerContext: any;
}

export function useWizardHandlers({ selection, flagLogic, sockerContext }: UseWizardHandlersProps) {
  
  const handleCategorySelect = useCallback((category: EventCategory) => {
    selection.setSelectedCategory(category);
  }, [selection]);

  const handleQuickEventSelect = useCallback((eventId: string) => {
    // Find event from context or annotation labels
    const event = { id: eventId, name: eventId } as AnnotationLabel; // This should be properly resolved from context
    selection.setSelectedEvent(event.id); // Store just the ID as string
    selection.setSelectedEventName(event.name);
    
    // Load flags for this specific event/label
    if (event.flags && event.flags.length > 0) {
      flagLogic.loadFlagsForLabel(event.id);
      selection.setCurrentStep("flag");
    } else {
      // Complete event immediately if no flags
      sockerContext?.setSelectedEvent?.(event.name);
      selection.setCurrentStep("default");
    }
  }, [selection, flagLogic, sockerContext]);

  const handleEventSelect = useCallback((event: AnnotationLabel) => {
    selection.setSelectedEvent(event.id); // Store just the ID as string
    selection.setSelectedEventName(event.name);
    
    // Set flag conditions from the event
    if (event.flag_conditions) {
      selection.setFlagConditions(event.flag_conditions);
    }
    
    // Load flags for this specific event/label
    if (event.flags && event.flags.length > 0) {
      flagLogic.loadFlagsForLabel(event.id);
      selection.setCurrentStep("flag");
    } else {
      // Complete event immediately if no flags
      sockerContext?.setSelectedEvent?.(event.name);
      selection.setCurrentStep("default");
    }
  }, [selection, flagLogic, sockerContext]);

  const handleFlagValueSelect = useCallback((value: string) => {
    const currentFlag = flagLogic.availableFlags[flagLogic.currentFlagIndex];
    if (!currentFlag) return;

    // Update flag values
    const newFlagValues = {
      ...flagLogic.flagValues,
      [currentFlag.id]: value
    };
    flagLogic.setFlagValues(newFlagValues);

    // Move to next flag or complete
    const nextFlagIndex = flagLogic.currentFlagIndex + 1;
    if (nextFlagIndex < flagLogic.availableFlags.length) {
      flagLogic.setCurrentFlagIndex(nextFlagIndex);
    } else {
      // All flags completed - finish the event
      const eventName = selection.selectedEventName || 'Unknown Event';
      const flagString = Object.entries(newFlagValues)
        .map(([flagId, flagValue]) => {
          const flag = flagLogic.availableFlags.find(f => f.id === flagId);
          return flag ? `${flag.name}: ${flagValue}` : `${flagId}: ${flagValue}`;
        })
        .join(', ');
      
      const fullEventName = flagString ? `${eventName} (${flagString})` : eventName;
      sockerContext?.setSelectedEvent?.(fullEventName);
      
      // Reset to default state
      selection.setCurrentStep("default");
      selection.setSelectedCategory(null);
      selection.setSelectedEvent(null);
      selection.setSelectedEventName(null);
      flagLogic.setFlagValues({});
      flagLogic.setCurrentFlagIndex(0);
    }
  }, [flagLogic, selection, sockerContext]);

  const handleBack = useCallback(() => {
    if (selection.currentStep === "flag") {
      if (flagLogic.currentFlagIndex > 0) {
        // Go back to previous flag
        flagLogic.setCurrentFlagIndex(flagLogic.currentFlagIndex - 1);
      } else {
        // Go back to event selection
        if (selection.selectedCategory) {
          selection.setCurrentStep("default");
        } else {
          selection.setCurrentStep("default");
          selection.setSelectedCategory(null);
        }
      }
    } else if (selection.selectedCategory) {
      // Go back to main categories
      selection.setSelectedCategory(null);
    }
  }, [selection, flagLogic]);

  return {
    handleCategorySelect,
    handleQuickEventSelect,
    handleEventSelect,
    handleFlagValueSelect,
    handleBack
  };
}
