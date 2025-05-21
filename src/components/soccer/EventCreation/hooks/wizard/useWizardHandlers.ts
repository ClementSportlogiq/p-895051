
import { AnnotationLabel } from "@/types/annotation";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";

interface WizardHandlersProps {
  selection: {
    setCurrentStep: React.Dispatch<React.SetStateAction<"default" | "pressure" | "bodyPart" | "flag">>;
    setSelectedCategory: React.Dispatch<React.SetStateAction<any>>;
    setSelectedEvent: React.Dispatch<React.SetStateAction<string | null>>;
    setSelectedPressure: React.Dispatch<React.SetStateAction<string | null>>;
    setSelectedBodyPart: React.Dispatch<React.SetStateAction<string | null>>;
    selectedCategory: any;
    selectedEvent: string | null;
    selectedPressure: string | null;
    selectedBodyPart: string | null;
    currentStep: "default" | "pressure" | "bodyPart" | "flag";
  };
  flagLogic: {
    setCurrentLabelId: React.Dispatch<React.SetStateAction<string | null>>;
    setFlagsForLabel: React.Dispatch<React.SetStateAction<any[]>>;
    setCurrentFlagIndex: React.Dispatch<React.SetStateAction<number>>;
    setFlagValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    setAvailableFlags: React.Dispatch<React.SetStateAction<any[]>>;
    currentLabelId: string | null;
    flagsForLabel: any[];
    currentFlagIndex: number;
    flagValues: Record<string, string>;
    determineAvailableFlags: (label: AnnotationLabel, currentValues: Record<string, string>) => any[];
    getFlagNameById: (flags: any[], flagId: string) => string;
  };
  sockerContext: {
    setSelectedEventCategory: (category: any) => void;
    setSelectedEventType: (type: any) => void;
    setSelectedEventDetails: (details: any) => void;
  };
}

export function useWizardHandlers({
  selection,
  flagLogic,
  sockerContext
}: WizardHandlersProps) {
  const { getLabelsByCategory, getQuickEvents } = useAnnotationLabels();

  // Handler for category selection
  const handleCategorySelect = (category: any) => {
    selection.setSelectedCategory(category);
  };

  // Handler for quick events
  const handleQuickEventSelect = (eventId: string) => {
    const event = getQuickEvents().find(evt => evt.id === eventId);
    if (event) {
      handleEventSelect(event);
    }
  };

  // Handler for event selection
  const handleEventSelect = (event: AnnotationLabel) => {
    selection.setSelectedEvent(event.name);
    flagLogic.setCurrentLabelId(event.id);
    
    // Check if the event has associated flags
    if (event.flags && event.flags.length > 0) {
      // Sort flags by order_priority for the decision tree
      const orderedFlags = [...event.flags].sort((a, b) => 
        (a.order_priority || 0) - (b.order_priority || 0)
      );
      
      // Determine which flags should be available based on conditions
      const initialAvailableFlags = flagLogic.determineAvailableFlags(event, {});
      
      flagLogic.setFlagsForLabel(orderedFlags);
      flagLogic.setAvailableFlags(initialAvailableFlags);
      flagLogic.setCurrentFlagIndex(0);
      selection.setCurrentStep("flag");
    } 
    // If Pass is selected, go to pressure selection
    else if (event.id === "pass") {
      selection.setCurrentStep("pressure");
    }
  };

  // Handler for pressure selection
  const handlePressureSelect = (pressure: {id: string; name: string; hotkey: string}) => {
    selection.setSelectedPressure(pressure.name);
    selection.setCurrentStep("bodyPart");
  };

  // Handler for body part selection
  const handleBodyPartSelect = (bodyPart: {id: string; name: string; hotkey: string}) => {
    selection.setSelectedBodyPart(bodyPart.name);
    
    // After body part, check if there are flags to process
    if (flagLogic.currentLabelId) {
      const allLabels = getLabelsByCategory(selection.selectedCategory);
      const eventWithFlags = allLabels.find(l => l.id === flagLogic.currentLabelId);
      
      if (eventWithFlags?.flags && eventWithFlags.flags.length > 0) {
        // Sort flags by order_priority for the decision tree
        const orderedFlags = [...eventWithFlags.flags].sort((a, b) => 
          (a.order_priority || 0) - (b.order_priority || 0)
        );
        flagLogic.setFlagsForLabel(orderedFlags);
        flagLogic.setAvailableFlags(flagLogic.determineAvailableFlags(eventWithFlags, {}));
        flagLogic.setCurrentFlagIndex(0);
        selection.setCurrentStep("flag");
      }
    }
  };
  
  // Handler for flag value selection
  const handleFlagValueSelect = (value: string) => {
    const currentFlag = flagLogic.flagsForLabel[flagLogic.currentFlagIndex];
    
    // Store selected flag value
    const updatedFlagValues = {
      ...flagLogic.flagValues,
      [currentFlag.name]: value
    };
    
    flagLogic.setFlagValues(updatedFlagValues);
    
    // Get the current label to check conditions
    if (flagLogic.currentLabelId) {
      const allLabels = getLabelsByCategory(selection.selectedCategory);
      const eventWithFlags = allLabels.find(l => l.id === flagLogic.currentLabelId);
      
      if (eventWithFlags) {
        // Update available flags based on new selection - this will determine
        // which flags are hidden based on the conditions
        const newAvailableFlags = flagLogic.determineAvailableFlags(eventWithFlags, updatedFlagValues);
        flagLogic.setAvailableFlags(newAvailableFlags);
      }
    }
    
    // Move to next flag if available
    if (flagLogic.currentFlagIndex < flagLogic.flagsForLabel.length - 1) {
      // Find the next flag that should be displayed (not hidden)
      let nextIndex = flagLogic.currentFlagIndex + 1;
      
      // Skip over any flags that should be hidden based on conditions
      while (
        nextIndex < flagLogic.flagsForLabel.length && 
        !flagLogic.availableFlags.some(f => f.id === flagLogic.flagsForLabel[nextIndex].id)
      ) {
        nextIndex++;
      }
      
      // If we found a valid next flag, set it
      if (nextIndex < flagLogic.flagsForLabel.length) {
        flagLogic.setCurrentFlagIndex(nextIndex);
      }
    }
  };

  // Handler for going back in the wizard
  const handleBack = () => {
    if (selection.currentStep === "flag") {
      // If we're on the first flag, go back to the previous step
      if (flagLogic.currentFlagIndex === 0) {
        if (selection.selectedBodyPart) {
          // If we came from bodyPart step
          selection.setCurrentStep("bodyPart");
        } else if (selection.selectedPressure) {
          // If we came from pressure step
          selection.setCurrentStep("pressure");
        } else {
          // If we came directly from event selection
          selection.setCurrentStep("default");
        }
      } else {
        // Go back to the previous flag
        flagLogic.setCurrentFlagIndex(prev => prev - 1);
        // Remove the value for the current flag
        const currentFlag = flagLogic.flagsForLabel[flagLogic.currentFlagIndex];
        const newFlagValues = { ...flagLogic.flagValues };
        delete newFlagValues[currentFlag.name];
        flagLogic.setFlagValues(newFlagValues);
      }
    }
    else if (selection.currentStep === "bodyPart") {
      selection.setCurrentStep("pressure");
      selection.setSelectedBodyPart(null);
    } 
    else if (selection.currentStep === "pressure") {
      selection.setCurrentStep("default");
      selection.setSelectedEvent(null);
      selection.setSelectedPressure(null);
    } 
    else if (selection.selectedCategory) {
      selection.setSelectedCategory(null);
      selection.setSelectedEvent(null);
      selection.setCurrentStep("default");
    }
  };

  const resetWizard = () => {
    selection.setCurrentStep("default");
    selection.setSelectedCategory(null);
    selection.setSelectedEvent(null);
    selection.setSelectedPressure(null);
    selection.setSelectedBodyPart(null);
    flagLogic.setCurrentLabelId(null);
    flagLogic.setFlagsForLabel([]);
    flagLogic.setCurrentFlagIndex(0);
    flagLogic.setFlagValues({});
    flagLogic.setAvailableFlags([]);
    sockerContext.setSelectedEventCategory(null);
    sockerContext.setSelectedEventType(null);
    sockerContext.setSelectedEventDetails(null);
  };

  return {
    handleCategorySelect,
    handleQuickEventSelect,
    handleEventSelect,
    handlePressureSelect,
    handleBodyPartSelect,
    handleFlagValueSelect,
    handleBack,
    resetWizard
  };
}
