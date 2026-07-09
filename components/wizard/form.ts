import type { IntakePayload } from "@/lib/types";

// The wizard's working state: every IntakePayload field (minus content, which is
// entered per-post, and pastContext, which the page injects) plus the batch inputs.
export interface WizardForm
  extends Omit<IntakePayload, "content" | "pastContext" | "referenceImageUrl"> {
  isBatch: boolean;
  content: string;
  batchTopics: string;
  referenceImageUrl: string; // always a string in the form; trimmed on build
}

export type Update = <K extends keyof WizardForm>(
  key: K,
  value: WizardForm[K]
) => void;

export interface StepProps {
  form: WizardForm;
  update: Update;
}

export const DEFAULT_FORM: WizardForm = {
  isBatch: false,
  content: "",
  batchTopics: "",
  world: "briefing",
  format: "Static",
  aiElement: "Auto",
  aiElementHint: "",
  humanPresence: "None",
  humanPresenceHint: "",
  platform: "Both",
  goal: "Trust",
  audience: "Both",
  mustInclude: "",
  textInImage: false,
  exactWords: "",
  referenceImageUrl: "",
  outputFormat: "brief",
  aspectRatio: "4:5",
  mood: "Auto",
  lighting: "Auto",
  lensCrop: "Auto",
  negativeSpace: "Auto",
  compareMode: false,
  peopleCount: "Auto",
  studentGender: "Auto",
  humanEmotion: "Auto",
  cropStyle: "Auto",
  wantPersonas: false,
  slideCount: 0,
  narrativeArc: "Auto",
  perSlideNotes: "",
  targetModel: "Nano Banana 2",
  customNegatives: "",
  variations: 1,
  onImageLanguage: "French",
};

// Up to 5 non-empty topic lines (same rule as the old batch form).
export function batchTopicList(form: WizardForm): string[] {
  return form.batchTopics
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 5);
}

// Turn the wizard state into one or more IntakePayloads for the API.
export function buildPayloads(form: WizardForm): IntakePayload[] {
  const {
    isBatch: _isBatch,
    content,
    batchTopics: _batchTopics,
    referenceImageUrl,
    ...rest
  } = form;

  const base: Omit<IntakePayload, "content"> = {
    ...rest,
    referenceImageUrl: referenceImageUrl.trim() || undefined,
  };

  if (form.isBatch) {
    return batchTopicList(form).map((topic) => ({ ...base, content: topic }));
  }
  return [{ ...base, content }];
}
