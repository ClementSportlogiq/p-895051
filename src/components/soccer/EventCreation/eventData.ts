
export type WizardStep = "default" | "pressure" | "bodyPart";
export type EventCategory = "offense" | "defense" | "reception" | "goalkeeper" | "deadball" | "playerAction" | "infractions";

export interface TreeEvent {
  id: string;
  name: string;
  hotkey: string;
}

// Define event categories with their hotkeys
export const categories: TreeEvent[] = [
  { id: "offense", name: "Offense", hotkey: "A" },
  { id: "defense", name: "Defense", hotkey: "S" },
  { id: "reception", name: "Reception/LBR", hotkey: "D" },
  { id: "goalkeeper", name: "Goalkeeper", hotkey: "F" },
  { id: "deadball", name: "Deadball", hotkey: "Z" },
  { id: "playerAction", name: "Player Action", hotkey: "X" },
  { id: "infractions", name: "Infractions", hotkey: "C" },
];

// Define quick events with their hotkeys
export const quickEvents: TreeEvent[] = [
  { id: "pass", name: "Pass", hotkey: "Q" },
  { id: "reception", name: "Reception", hotkey: "W" },
  { id: "lbr", name: "LBR", hotkey: "E" },
  { id: "interception", name: "Interception", hotkey: "R" },
];

// Define offense events
export const offenseEvents: TreeEvent[] = [
  { id: "pass", name: "Pass", hotkey: "Q" },
  { id: "cross", name: "Cross", hotkey: "W" },
  { id: "shot", name: "Shot", hotkey: "E" },
  { id: "failedShot", name: "Failed Shot", hotkey: "R" },
  { id: "blockedShot", name: "Blocked Shot", hotkey: "A" },
  { id: "goal", name: "Goal", hotkey: "S" },
  { id: "ownGoal", name: "Own Goal", hotkey: "D" },
  { id: "shootoutGoal", name: "Shoot-out Goal", hotkey: "F" },
];

// Define pressure options
export const pressureOptions: TreeEvent[] = [
  { id: "pressure", name: "Pressure", hotkey: "Q" },
  { id: "noPressure", name: "No Pressure", hotkey: "W" },
];

// Define body part options
export const bodyPartOptions: TreeEvent[] = [
  { id: "leftFoot", name: "Left Foot", hotkey: "Q" },
  { id: "rightFoot", name: "Right Foot", hotkey: "W" },
  { id: "head", name: "Head", hotkey: "E" },
  { id: "other", name: "Other", hotkey: "R" },
  { id: "leftHand", name: "Left Hand", hotkey: "A" },
  { id: "rightHand", name: "Right Hand", hotkey: "S" },
  { id: "bothHands", name: "Both Hands", hotkey: "D" },
];

// Helper to get current events based on the selected category
export const getCategoryEvents = (category: EventCategory | null): TreeEvent[] => {
  switch (category) {
    case "offense":
      return offenseEvents;
    // Add more cases for other categories as needed
    default:
      return [];
  }
};
