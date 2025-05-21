
import { AnnotationCategory, AnnotationLabel } from '@/types/annotation';

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
export const defaultQuickEvents: AnnotationLabel[] = [
  { id: "pass", name: "Pass", category: "offense", hotkey: "Q", description: "Standard pass" },
  { id: "reception", name: "Reception", category: "reception", hotkey: "W", description: "Ball reception" },
  { id: "lbr", name: "LBR", category: "reception", hotkey: "E", description: "Lost ball reception" },
  { id: "interception", name: "Interception", category: "defense", hotkey: "R", description: "Interception" },
];
