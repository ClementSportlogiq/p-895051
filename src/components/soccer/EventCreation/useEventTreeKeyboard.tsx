
import { useEffect } from "react";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";
import { WizardStep, EventCategory } from "@/types/annotation";
import { pressureOptions, bodyPartOptions } from "./eventData";

interface UseEventTreeKeyboardProps {
  currentStep: WizardStep;
  selectedCategory: EventCategory | null;
  handleQuickEventSelect: (eventId: string) => void;
  handleCategorySelect: (categoryId: EventCategory) => void;
  handleEventSelect: (eventId: string) => void;
  handlePressureSelect: (pressureId: string) => void;
  handleBodyPartSelect: (bodyPartId: string) => void;
}

export const useEventTreeKeyboard = ({
  currentStep,
  selectedCategory,
  handleQuickEventSelect,
  handleCategorySelect,
  handleEventSelect,
  handlePressureSelect,
  handleBodyPartSelect
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
      else if (selectedCategory && currentStep !== "pressure" && currentStep !== "bodyPart") {
        // Event selection from category
        const categoryEvents = getLabelsByCategory(selectedCategory);
        const event = categoryEvents.find(evt => evt.hotkey.toUpperCase() === key);
        if (event) {
          handleEventSelect(event.id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentStep, 
    selectedCategory, 
    handleQuickEventSelect,
    handleCategorySelect,
    handleEventSelect,
    handlePressureSelect,
    handleBodyPartSelect,
    getQuickEvents,
    getLabelsByCategory,
    categories
  ]);
};

export default useEventTreeKeyboard;
