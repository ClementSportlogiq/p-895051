
import { useEffect } from "react";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";
import { WizardStep, EventCategory, AnnotationFlag } from "@/types/annotation";
import { pressureOptions, bodyPartOptions } from "./eventData";

interface UseEventTreeKeyboardProps {
  currentStep: WizardStep;
  selectedCategory: EventCategory | null;
  flagsForLabel: AnnotationFlag[];
  availableFlags?: AnnotationFlag[]; // Available flags that aren't hidden by conditions
  currentFlagIndex: number;
  handleQuickEventSelect: (eventId: string) => void;
  handleCategorySelect: (categoryId: EventCategory) => void;
  handleEventSelect: (eventId: string) => void;
  handlePressureSelect: (pressureId: string) => void;
  handleBodyPartSelect: (bodyPartId: string) => void;
  handleFlagValueSelect: (value: string) => void;
}

export const useEventTreeKeyboard = ({
  currentStep,
  selectedCategory,
  flagsForLabel = [],
  availableFlags = [],
  currentFlagIndex,
  handleQuickEventSelect,
  handleCategorySelect,
  handleEventSelect,
  handlePressureSelect,
  handleBodyPartSelect,
  handleFlagValueSelect
}: UseEventTreeKeyboardProps) => {
  const { getQuickEvents, getLabelsByCategory, categories } = useAnnotationLabels();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      
      if (currentStep === "default") {
        // Quick events (check hotkeys)
        if (!selectedCategory) {
          const quickEvents = getQuickEvents();
          const event = quickEvents.find(evt => evt.hotkey.toUpperCase() === key);
          if (event) {
            handleQuickEventSelect(event.id);
            return;
          }
        }
        
        // Categories
        const category = categories.find(cat => cat.hotkey.toUpperCase() === key);
        if (category) {
          handleCategorySelect(category.id);
        }
      } 
      else if (currentStep === "pressure") {
        // Pressure options
        const pressure = pressureOptions.find(opt => opt.hotkey.toUpperCase() === key);
        if (pressure) {
          handlePressureSelect(pressure.id);
        }
      }
      else if (currentStep === "bodyPart") {
        // Body part options
        const bodyPart = bodyPartOptions.find(opt => opt.hotkey.toUpperCase() === key);
        if (bodyPart) {
          handleBodyPartSelect(bodyPart.id);
        }
      }
      else if (currentStep === "flag") {
        // Flag value selection by hotkey - support the new FlagValue structure
        if (flagsForLabel.length > 0 && currentFlagIndex < flagsForLabel.length) {
          const currentFlag = flagsForLabel[currentFlagIndex];
          
          // Only process hotkeys for flags that aren't hidden by conditions
          const isAvailable = availableFlags.some(f => f.id === currentFlag.id);
          
          if (isAvailable && currentFlag?.values) {
            // Handle both string and FlagValue types
            const matchedValue = currentFlag.values.find(val => {
              if (typeof val === 'string') {
                return false; // Legacy string values don't have hotkeys
              } else {
                return val.hotkey.toUpperCase() === key;
              }
            });
            
            if (matchedValue && typeof matchedValue !== 'string') {
              handleFlagValueSelect(matchedValue.value);
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentStep, 
    selectedCategory, 
    flagsForLabel,
    availableFlags,
    currentFlagIndex,
    handleQuickEventSelect,
    handleCategorySelect,
    handleEventSelect,
    handlePressureSelect,
    handleBodyPartSelect,
    handleFlagValueSelect,
    getQuickEvents,
    getLabelsByCategory,
    categories
  ]);
};

export default useEventTreeKeyboard;
