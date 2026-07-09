import type {
  AiElement,
  AspectRatio,
  Audience,
  CropStyle,
  Format,
  Goal,
  HumanEmotion,
  HumanPresence,
  Lighting,
  LensCrop,
  Mood,
  NarrativeArc,
  NegativeSpace,
  OnImageLanguage,
  PeopleCount,
  Platform,
  StudentGender,
  TargetModel,
  WorldId,
} from "@/lib/types";
import type { Accent } from "@/components/ui/OptionCard";

export const WORLD_ACCENT: Record<WorldId, Accent> = {
  briefing: "clay",
  studio: "bone",
  musee: "saffron",
};

export const FORMATS: { id: Format; hint: string }[] = [
  { id: "Static", hint: "One image prompt" },
  { id: "Carousel", hint: "5–7 connected slides" },
];

export const AI_ELEMENTS: { value: AiElement; label: string; hint: string }[] = [
  { value: "Auto", label: "Auto", hint: "Only when it fits" },
  { value: "Always", label: "Always", hint: "Force one in" },
  { value: "None", label: "None", hint: "Pure still-life" },
];

export const HUMAN_PRESENCES: { value: HumanPresence; label: string; hint: string }[] = [
  { value: "None", label: "None", hint: "Objects only" },
  { value: "Auto", label: "Auto", hint: "Only when it fits" },
  { value: "Always", label: "Always", hint: "Real people in" },
];

export const PLATFORMS: Platform[] = ["Instagram", "LinkedIn", "Both"];
export const GOALS: Goal[] = ["Trust", "Educate", "Promote", "Engage"];
export const AUDIENCES: Audience[] = ["Parents", "Students", "Both"];

// Creative look
export const ASPECT_RATIOS: AspectRatio[] = ["4:5", "1:1", "9:16", "16:9"];
export const MOODS: Mood[] = [
  "Auto",
  "Calm",
  "Joyful",
  "Hopeful",
  "Serious",
  "Dramatic",
  "Playful",
];
export const LIGHTINGS: Lighting[] = [
  "Auto",
  "Golden hour",
  "Soft daylight",
  "Night spotlight",
  "Dramatic side",
  "Overcast soft",
];
export const LENS_CROPS: LensCrop[] = [
  "Auto",
  "Wide establishing",
  "Portrait 85mm",
  "Macro hands",
  "Over-the-shoulder",
  "Top-down flat-lay",
];
export const NEGATIVE_SPACES: NegativeSpace[] = ["Auto", "Top", "Left", "Right", "Center"];

// Human & casting
export const PEOPLE_COUNTS: PeopleCount[] = ["Auto", "One", "Two", "Group"];
export const STUDENT_GENDERS: StudentGender[] = ["Auto", "Boy", "Girl", "Mixed"];
export const HUMAN_EMOTIONS: HumanEmotion[] = [
  "Auto",
  "Joy",
  "Pride",
  "Focus",
  "Curiosity",
  "Doubt",
  "Aha",
];
export const CROP_STYLES: CropStyle[] = [
  "Auto",
  "Hands only",
  "Partial figure",
  "Full figure",
];

// Carousel structure
export const NARRATIVE_ARCS: NarrativeArc[] = [
  "Auto",
  "Problem → Method → Result",
  "Myth-buster",
  "Step-by-step",
  "Story",
];

// Output & targeting
export const TARGET_MODELS: TargetModel[] = [
  "Nano Banana 2",
  "Midjourney",
  "Flux",
  "DALL-E / GPT",
];
export const ON_IMAGE_LANGUAGES: OnImageLanguage[] = ["French", "Arabic", "English"];
