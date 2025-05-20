
import { useState, useEffect } from "react";
import { useSoccer } from "@/context/SoccerContext";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";
import { 
  WizardStep, 
  EventCategory, 
  AnnotationLabel, 
  AnnotationFlag, 
  EventDetails 
} from "@/types/annotation";

export function useWizardState() {
  const { 
    setSelectedEventCategory, 
    setSelectedEventType,
    setSelectedEventDetails
  } = useSoccer();
  
  const { getLabelsByCategory, getQuickEvents } = useAnnotationLabels();

  // Main wizard state
  const [currentStep, setCurrentStep] = useState<WizardStep>("default");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedPressure, setSelectedPressure] = useState<string | null>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  
  // Flag handling state
  const [currentLabelId, setCurrentLabelId] = useState<string | null>(null);
  const [flagsForLabel, setFlagsForLabel] = useState<AnnotationFlag[]>([]);
  const [currentFlagIndex, setCurrentFlagIndex] = useState<number>(0);
  const [flagValues, setFlagValues] = useState<Record<string, string>>({});

  // Update the context when selections change
  useEffect(() => {
    setSelectedEventCategory(selectedCategory);
    
    // Set event details based on selection steps
    let details = "";
    if (selectedEvent) {
      details = selectedEvent;
      if (selectedPressure) {
        details += ` (${selectedPressure})`;
      }
      if (selectedBodyPart) {
        details += ` - ${selectedBodyPart}`;
      }
      
      // Add flag values to details if available
      const flagDetails = Object.entries(flagValues);
      if (flagDetails.length > 0) {
        flagDetails.forEach(([flagName, value]) => {
          details += ` | ${flagName}: ${value}`;
        });
      }
    }
    
    setSelectedEventType(details);
    
    // Set additional details for context
    const additionalDetails: EventDetails = {
      pressure: selectedPressure || "",
      bodyPart: selectedBodyPart || "",
      flags: flagValues
    };
    
    setSelectedEventDetails(additionalDetails);
  }, [
    selectedEvent, 
    selectedPressure, 
    selectedBodyPart, 
    selectedCategory, 
    flagValues, 
    setSelectedEventCategory, 
    setSelectedEventType, 
    setSelectedEventDetails
  ]);

  const resetWizard = () => {
    setCurrentStep("default");
    setSelectedCategory(null);
    setSelectedEvent(null);
    setSelectedPressure(null);
    setSelectedBodyPart(null);
    setCurrentLabelId(null);
    setFlagsForLabel([]);
    setCurrentFlagIndex(0);
    setFlagValues({});
    setSelectedEventCategory(null);
    setSelectedEventType(null);
    setSelectedEventDetails(null);
  };

  // Handler for category selection
  const handleCategorySelect = (category: EventCategory) => {
    setSelectedCategory(category);
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
    setSelectedEvent(event.name);
    setCurrentLabelId(event.id);
    
    // Check if the event has associated flags
    if (event.flags && event.flags.length > 0) {
      setFlagsForLabel(event.flags);
      setCurrentFlagIndex(0);
      setCurrentStep("flag");
    } 
    // If Pass is selected, go to pressure selection
    else if (event.id === "pass") {
      setCurrentStep("pressure");
    }
  };

  // Handler for pressure selection
  const handlePressureSelect = (pressure: AnnotationLabel) => {
    setSelectedPressure(pressure.name);
    setCurrentStep("bodyPart");
  };

  // Handler for body part selection
  const handleBodyPartSelect = (bodyPart: AnnotationLabel) => {
    setSelectedBodyPart(bodyPart.name);
    
    // After body part, check if there are flags to process
    if (currentLabelId) {
      const { labels } = useAnnotationLabels();
      const eventWithFlags = labels.find(l => l.id === currentLabelId);
      if (eventWithFlags?.flags && eventWithFlags.flags.length > 0) {
        setFlagsForLabel(eventWithFlags.flags);
        setCurrentFlagIndex(0);
        setCurrentStep("flag");
      }
    }
  };
  
  // Handler for flag value selection
  const handleFlagValueSelect = (value: string) => {
    const currentFlag = flagsForLabel[currentFlagIndex];
    
    // Store selected flag value
    setFlagValues(prev => ({
      ...prev,
      [currentFlag.name]: value
    }));
    
    // Move to next flag if available
    if (currentFlagIndex < flagsForLabel.length - 1) {
      setCurrentFlagIndex(prev => prev + 1);
    }
  };

  // Handler for going back in the wizard
  const handleBack = () => {
    if (currentStep === "flag") {
      // If we're on the first flag, go back to the previous step
      if (currentFlagIndex === 0) {
        if (selectedBodyPart) {
          // If we came from bodyPart step
          setCurrentStep("bodyPart");
        } else if (selectedPressure) {
          // If we came from pressure step
          setCurrentStep("pressure");
        } else {
          // If we came directly from event selection
          setCurrentStep("default");
        }
      } else {
        // Go back to the previous flag
        setCurrentFlagIndex(prev => prev - 1);
        // Remove the value for the current flag
        const currentFlag = flagsForLabel[currentFlagIndex];
        const newFlagValues = { ...flagValues };
        delete newFlagValues[currentFlag.name];
        setFlagValues(newFlagValues);
      }
    }
    else if (currentStep === "bodyPart") {
      setCurrentStep("pressure");
      setSelectedBodyPart(null);
    } 
    else if (currentStep === "pressure") {
      setCurrentStep("default");
      setSelectedEvent(null);
      setSelectedPressure(null);
    } 
    else if (selectedCategory) {
      setSelectedCategory(null);
      setSelectedEvent(null);
      setCurrentStep("default");
    }
  };

  return {
    currentStep,
    selectedCategory,
    selectedEvent,
    currentLabelId,
    flagsForLabel,
    currentFlagIndex,
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
