
export interface AnnotationLabel {
  id: string;
  name: string;
  category: EventCategory;
  hotkey: string;
  description?: string;
  flags?: AnnotationFlag[]; // Added flags association
  flag_conditions?: FlagCondition[]; // Added for decision tree logic
}

export type EventCategory = "offense" | "defense" | "reception" | "goalkeeper" | "deadball" | "playerAction" | "infractions";

export interface AnnotationCategory {
  id: string; // Changed from EventCategory to string to match database UUID
  name: string;
  hotkey: string;
  matrix_position?: string; // Added matrix_position property
}

export interface AnnotationFlag {
  id: string;
  name: string;
  description?: string;
  order_priority: number; // Renamed from order to match database column
  values: FlagValue[]; // Changed from string[] to FlagValue[]
}

// New interface for flag values with hotkeys
export interface FlagValue {
  value: string;
  hotkey: string;
}

// Updated interface for conditional logic in the decision tree with flagsToHideIds array
export interface FlagCondition {
  flagId: string;
  value: string;
  flagsToHideIds: string[]; // Changed from nextFlagId to flagsToHideIds array
}

export type WizardStep = "default" | "flag";

// Simplified EventDetails type - only flags now
export type EventDetails = {
  flags: Record<string, string>;
};
