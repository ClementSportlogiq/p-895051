
import { useState, useEffect } from 'react';
import { AnnotationLabel, EventCategory, AnnotationCategory, AnnotationFlag } from '@/types/annotation';

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
  const [flags, setFlags] = useState<AnnotationFlag[]>([]);
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
      
      // Load flags
      const savedFlags = localStorage.getItem("annotationFlags");
      if (savedFlags) {
        setFlags(JSON.parse(savedFlags));
      }
      
      setIsLoading(false);
    };

    loadLabels();

    // Set up event listener for label changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "annotationLabels") {
        loadLabels();
      } else if (e.key === "annotationFlags") {
        const savedFlags = localStorage.getItem("annotationFlags");
        if (savedFlags) {
          setFlags(JSON.parse(savedFlags));
        }
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

  const getFlagsByLabel = (labelId: string): AnnotationFlag[] => {
    const label = labels.find(l => l.id === labelId);
    return label?.flags || [];
  };

  return {
    labels,
    flags,
    isLoading,
    getQuickEvents,
    getLabelsByCategory,
    getFlagsByLabel,
    categories: defaultCategories
  };
}

export default useAnnotationLabels;
