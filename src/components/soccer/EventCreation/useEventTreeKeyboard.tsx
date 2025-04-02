
import { useEffect } from "react";
import { 
  WizardStep, 
  EventCategory, 
  quickEvents, 
  categories, 
  pressureOptions, 
  bodyPartOptions, 
  getCategoryEvents 
} from "./eventData";

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
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      
      if (currentStep === "default") {
        // Quick events (Q, W, E, R)
        if (["Q", "W", "E", "R"].includes(key)) {
          const event = quickEvents.find(evt => evt.hotkey === key);
          if (event) {
            handleQuickEventSelect(event.id);
          }
        } 
        // Categories (A, S, D, F, Z, X, C)
        else if (["A", "S", "D", "F", "Z", "X", "C"].includes(key)) {
          const category = categories.find(cat => cat.hotkey === key);
          if (category) {
            handleCategorySelect(category.id as EventCategory);
          }
        }
      } 
      else if (currentStep === "pressure") {
        // Pressure options (Q, W)
        if (["Q", "W"].includes(key)) {
          const pressure = pressureOptions.find(opt => opt.hotkey === key);
          if (pressure) {
            handlePressureSelect(pressure.id);
          }
        }
      }
      else if (currentStep === "bodyPart") {
        // Body part options (Q, W, E, R, A, S, D)
        if (["Q", "W", "E", "R", "A", "S", "D"].includes(key)) {
          const bodyPart = bodyPartOptions.find(opt => opt.hotkey === key);
          if (bodyPart) {
            handleBodyPartSelect(bodyPart.id);
          }
        }
      }
      else if (selectedCategory && currentStep !== "pressure" && currentStep !== "bodyPart") {
        // Event selection from category
        if (["Q", "W", "E", "R", "A", "S", "D", "F"].includes(key)) {
          const events = getCategoryEvents(selectedCategory);
          const event = events.find(evt => evt.hotkey === key);
          if (event) {
            handleEventSelect(event.id);
          }
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
    handleBodyPartSelect
  ]);
};

export default useEventTreeKeyboard;
