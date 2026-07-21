export type WorldId = "briefing" | "studio" | "musee";
export type Format = "Static" | "Carousel";
export type AiElement = "Auto" | "Always" | "None";
export type HumanPresence = "Auto" | "Always" | "None";
export type Rating = "up" | "down";

// --- Creative look ---
export type AspectRatio = "4:5" | "1:1" | "9:16" | "16:9";
export type Mood =
  | "Auto"
  | "Calm"
  | "Joyful"
  | "Hopeful"
  | "Serious"
  | "Dramatic"
  | "Playful";
export type Lighting =
  | "Auto"
  | "Golden hour"
  | "Soft daylight"
  | "Night spotlight"
  | "Dramatic side"
  | "Overcast soft";
export type LensCrop =
  | "Auto"
  | "Wide establishing"
  | "Portrait 85mm"
  | "Macro hands"
  | "Over-the-shoulder"
  | "Top-down flat-lay";
export type NegativeSpace = "Auto" | "Top" | "Left" | "Right" | "Center";

// --- Human & casting ---
export type PeopleCount = "Auto" | "One" | "Two" | "Group";
export type StudentGender = "Auto" | "Boy" | "Girl" | "Mixed";
export type HumanEmotion =
  | "Auto"
  | "Joy"
  | "Pride"
  | "Focus"
  | "Curiosity"
  | "Doubt"
  | "Aha";
export type CropStyle = "Auto" | "Hands only" | "Partial figure" | "Full figure";

// A fixed "character sheet" for one invented person — reused verbatim across
// every slide that shows them, so the same face/hair/wardrobe recurs across
// a carousel instead of a new-looking person each slide.
export interface Persona {
  name: string;
  age: string;
  role: string;
  physicalDescription: string;
  wardrobe: string;
}

// --- Carousel structure ---
export type NarrativeArc =
  | "Auto"
  | "Problem → Method → Result"
  | "Myth-buster"
  | "Step-by-step"
  | "Story";

// --- Output & targeting ---
export type TargetModel = "Nano Banana 2" | "Midjourney" | "Flux" | "DALL-E / GPT";
export type OnImageLanguage = "French" | "Arabic" | "English";

export interface Slide {
  imagePrompt: string;
  textSpace: string;
}

export interface GenerateResult {
  diagnosis: string;
  world: WorldId;
  format: Format;
  note?: string;
  slides: Slide[];
  personas?: Persona[]; // only present when named personas were requested
}

export type Platform = "Instagram" | "LinkedIn" | "Facebook" | "Both";
export type Goal = "Trust" | "Educate" | "Promote" | "Engage";
export type Audience = "Parents" | "Students" | "Both";

export type OutputFormat = "brief" | "flow";

export interface IntakePayload {
  content: string;
  world: WorldId;
  format: Format;
  aiElement: AiElement;
  aiElementHint: string;
  humanPresence: HumanPresence;
  humanPresenceHint: string;
  platform: Platform;
  goal: Goal;
  audience: Audience;
  mustInclude: string;
  textInImage: boolean;
  exactWords: string;
  referenceImageUrl?: string;
  outputFormat: OutputFormat;
  pastContext?: string[]; // recent visual approaches/hero objects to avoid repeating

  // --- Creative look ---
  aspectRatio: AspectRatio;
  mood: Mood;
  lighting: Lighting;
  lensCrop: LensCrop;
  negativeSpace: NegativeSpace;

  // --- Human & casting (used when humanPresence !== "None") ---
  compareMode: boolean; // copier vs. thinker staging
  peopleCount: PeopleCount;
  studentGender: StudentGender;
  humanEmotion: HumanEmotion;
  cropStyle: CropStyle;
  wantPersonas: boolean; // invent named, consistent character(s) instead of generic humans

  // --- Carousel structure ---
  slideCount: number; // 0 = auto (5–7)
  narrativeArc: NarrativeArc;
  perSlideNotes: string;

  // --- Output & targeting ---
  targetModel: TargetModel;
  customNegatives: string;
  variations: number; // 1–3 alternative takes (Static only)
  onImageLanguage: OnImageLanguage;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  result: GenerateResult;
  payload: IntakePayload;
  rating?: Rating;
}

export type ApiResponse =
  | { ok: true; data: GenerateResult }
  | { ok: false; error: string };

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
