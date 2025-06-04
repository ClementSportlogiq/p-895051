
import { useEffect } from "react";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";
import { useDefaultWizardConfig } from "@/hooks/useDefaultWizardConfig";
import { WizardStep, EventCategory, AnnotationFlag } from "@/types/annotation";

interface UseEventTreeKeyboardProps {
  currentStep: WizardStep;
  selectedCategory: EventCategory | null;
  flagsForLabel: AnnotationFlag[];
  availableFlags?: AnnotationFlag[];
  currentFlagIndex: number;
  handleQuickEventSelect: (eventId: string) => void;
  handleCategorySelect: (categoryId: EventCategory) => void;
  handleEventSelect: (eventId: string) => void;
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
  handleFlagValueSelect
}: UseEventTreeKeyboardProps) => {
  const { getQuickEvents, getLabelsByCategory, categories } = useAnnotationLabels();
  const { getQuickEventsByMatrix, getCategoriesByMatrix } = useDefaultWizardConfig();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      
      if (currentStep === "default") {
        // Get matrix-based assignments
        const quickEventsMatrix = getQuickEventsByMatrix(getQuickEvents());
        const categoriesMatrix = getCategoriesByMatrix(categories);
        
        // Handle matrix-based quick events (Q, W, E, R)
        if (['Q', 'W', 'E', 'R'].includes(key) && quickEventsMatrix[key]) {
          handleQuickEventSelect(quickEventsMatrix[key].id);
          return;
        }
        
        // Handle matrix-based categories (A, S, D, F, Z, X, C, V)
        if (['A', 'S', 'D', 'F', 'Z', 'X', 'C', 'V'].includes(key) && categoriesMatrix[key]) {
          // Cast the category ID to EventCategory since we know it's compatible
          handleCategorySelect(categoriesMatrix[key].id as EventCategory);
          return;
        }
        
        // Fallback to legacy hotkey system if no matrix assignments
        if (Object.keys(quickEventsMatrix).length === 0 && !selectedCategory) {
          const quickEvents = getQuickEvents();
          const event = quickEvents.find(evt => evt.hotkey.toUpperCase() === key);
          if (event) {
            handleQuickEventSelect(event.id);
            return;
          }
        }
        
        // Legacy category selection if no matrix assignments
        if (Object.keys(categoriesMatrix).length === 0) {
          const category = categories.find(cat => cat.hotkey.toUpperCase() === key);
          if (category) {
            // Cast the category ID to EventCategory since we know it's compatible
            handleCategorySelect(category.id as EventCategory);
            return;
          }
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
    handleFlagValueSelect,
    getQuickEvents,
    getLabelsByCategory,
    categories,
    getQuickEventsByMatrix,
    getCategoriesByMatrix
  ]);
};

export default useEventTreeKeyboard;
