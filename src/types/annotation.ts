
export interface AnnotationLabel {
  id: string;
  name: string;
  category: EventCategory;
  hotkey: string;
  description?: string;
  flags?: AnnotationFlag[]; // Added flags association
}

export type EventCategory = "offense" | "defense" | "reception" | "goalkeeper" | "deadball" | "playerAction" | "infractions";

export interface AnnotationCategory {
  id: EventCategory;
  name: string;
  hotkey: string;
}

export interface AnnotationFlag {
  id: string;
  name: string;
  description?: string;
  order: number; // Added order field for decision tree processing
  values: FlagValue[]; // Changed from string[] to FlagValue[]
}

// New interface for flag values with hotkeys
export interface FlagValue {
  value: string;
  hotkey: string;
}

export type WizardStep = "default" | "pressure" | "bodyPart" | "flag";

// Define EventDetails type to fix the typing issue
export type EventDetails = {
  pressure: string;
  bodyPart: string;
  flags: Record<string, string>;
};
