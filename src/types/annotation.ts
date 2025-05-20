
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
  values: string[];
}

export type WizardStep = "default" | "pressure" | "bodyPart" | "flag";

// Add this new type to fix the typing issue
export type EventDetails = Record<string, string | Record<string, string>>;
