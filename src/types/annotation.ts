
export interface AnnotationLabel {
  id: string;
  name: string;
  category: EventCategory;
  hotkey: string;
  description?: string;
}

export type EventCategory = "offense" | "defense" | "reception" | "goalkeeper" | "deadball" | "playerAction" | "infractions";

export interface AnnotationCategory {
  id: EventCategory;
  name: string;
  hotkey: string;
}

export type WizardStep = "default" | "pressure" | "bodyPart";
