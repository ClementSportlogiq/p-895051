
import { useState, useEffect } from 'react';
import { AnnotationLabel, EventCategory, AnnotationCategory } from '@/types/annotation';

// Default categories that are always available
export const defaultCategories: AnnotationCategory[] = [
  { id: "offense", name: "Offense", hotkey: "A" },
  { id: "defense", name: "Defense", hotkey: "S" },
  { id: "reception", name: "Reception/LBR", hotkey: "D" },
  { id: "goalkeeper", name: "Goalkeeper", hotkey: "F" },
  { id: "deadball", name: "Deadball", hotkey: "Z" },
  { id: "playerAction", name: "Player Action", hotkey: "X" },
  { id: "infractions", name: "Infractions", hotkey: "C" },
];

// Default quick events in case no custom labels are defined
const defaultQuickEvents: AnnotationLabel[] = [
  { id: "pass", name: "Pass", category: "offense", hotkey: "Q", description: "Standard pass" },
  { id: "reception", name: "Reception", category: "reception", hotkey: "W", description: "Ball reception" },
  { id: "lbr", name: "LBR", category: "reception", hotkey: "E", description: "Lost ball reception" },
  { id: "interception", name: "Interception", category: "defense", hotkey: "R", description: "Interception" },
];

export function useAnnotationLabels() {
  const [labels, setLabels] = useState<AnnotationLabel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load labels from localStorage
    const loadLabels = () => {
      const savedLabels = localStorage.getItem("annotationLabels");
      if (savedLabels) {
        setLabels(JSON.parse(savedLabels));
      } else {
        // Use default labels if none are stored
        setLabels(defaultQuickEvents);
      }
      setIsLoading(false);
    };

    loadLabels();

    // Set up event listener for label changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "annotationLabels") {
        loadLabels();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getQuickEvents = (): AnnotationLabel[] => {
    // Get the most used labels from each category, limited to 4 for quick events
    return labels.slice(0, 4);
  };

  const getLabelsByCategory = (category: EventCategory): AnnotationLabel[] => {
    return labels.filter(label => label.category === category);
  };

  return {
    labels,
    isLoading,
    getQuickEvents,
    getLabelsByCategory,
    categories: defaultCategories
  };
}

export default useAnnotationLabels;
