import type { Format, GenerateResult, Slide, WorldId } from "./types";

const WORLD_IDS: WorldId[] = ["briefing", "studio", "musee"];
const FORMATS: Format[] = ["Static", "Carousel"];

// Strip markdown code fences and surrounding prose so JSON.parse can work.
function stripFences(raw: string): string {
  let s = raw.trim();

  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) {
    s = fence[1].trim();
  }

  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    s = s.slice(first, last + 1);
  }

  return s.trim();
}

function isSlide(v: unknown): v is Slide {
  if (typeof v !== "object" || v === null) return false;
  const s = v as Record<string, unknown>;
  return typeof s.imagePrompt === "string" && typeof s.textSpace === "string";
}

// Parse + validate the model output. Throws a friendly Error on any problem.
export function parseGenerateResult(raw: string): GenerateResult {
  const cleaned = stripFences(raw);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("The model did not return valid JSON.");
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("The model output was not a JSON object.");
  }

  const obj = parsed as Record<string, unknown>;

  if (typeof obj.diagnosis !== "string") {
    throw new Error("Missing diagnosis in model output.");
  }
  if (
    typeof obj.world !== "string" ||
    !WORLD_IDS.includes(obj.world as WorldId)
  ) {
    throw new Error("Missing or invalid world in model output.");
  }
  if (typeof obj.format !== "string" || !FORMATS.includes(obj.format as Format)) {
    throw new Error("Missing or invalid format in model output.");
  }
  if (!Array.isArray(obj.slides) || obj.slides.length === 0) {
    throw new Error("Model output contained no slides.");
  }
  if (!obj.slides.every(isSlide)) {
    throw new Error("One or more slides is missing required fields.");
  }

  const format = obj.format as Format;
  let slides = obj.slides as Slide[];

  // Static must be a single image — keep only the first if the model overshoots.
  if (format === "Static") {
    slides = slides.slice(0, 1);
  }

  return {
    diagnosis: obj.diagnosis,
    world: obj.world as WorldId,
    format,
    note: typeof obj.note === "string" ? obj.note : undefined,
    slides,
  };
}
