export type WorldId = "briefing" | "studio" | "musee";
export type Format = "Static" | "Carousel";
// Whether to depict a tangible AI element (device, chat, robot, on-screen mistake).
export type AiElement = "Auto" | "Always" | "None";

export interface Slide {
  imagePrompt: string;
  textSpace: string;
}

export interface GenerateResult {
  diagnosis: string;
  world: WorldId;
  format: Format;
  note?: string;
  // Static → exactly one slide. Carousel → 5–7 connected slides.
  slides: Slide[];
}

export type Platform = "Instagram" | "LinkedIn" | "Both";
export type Goal = "Trust" | "Educate" | "Promote" | "Engage";
export type Audience = "Parents" | "Students" | "Both";

export interface IntakePayload {
  content: string;
  world: WorldId;
  format: Format;
  aiElement: AiElement;
  aiElementHint: string;
  platform: Platform;
  goal: Goal;
  audience: Audience;
  mustInclude: string;
  textInImage: boolean;
  exactWords: string;
}

export type ApiResponse =
  | { ok: true; data: GenerateResult }
  | { ok: false; error: string };

// Display metadata for each world (used by the form selector and result card).
export const WORLDS: { id: WorldId; name: string; blurb: string }[] = [
  {
    id: "briefing",
    name: "Briefing Parents — Warm Clay Room",
    blurb: "Parent trust, calm rules, guidance at home.",
  },
  {
    id: "studio",
    name: "Studio AQLUMA — Light Studio Room",
    blurb: "Creation, method, briefs, student work.",
  },
  {
    id: "musee",
    name: "Musée des Erreurs IA — Dark Museum Room",
    blurb: "AI mistakes, verification, critical thinking.",
  },
];

export function worldName(id: WorldId): string {
  return WORLDS.find((w) => w.id === id)?.name ?? id;
}
