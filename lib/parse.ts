import type { Format, GenerateResult, Persona, Slide, WorldId } from "./types";

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

function isPersona(v: unknown): v is Persona {
  if (typeof v !== "object" || v === null) return false;
  const p = v as Record<string, unknown>;
  return (
    typeof p.name === "string" &&
    typeof p.age === "string" &&
    typeof p.role === "string" &&
    typeof p.physicalDescription === "string" &&
    typeof p.wardrobe === "string"
  );
}

const PERSONA_TOKEN = /\{\{PERSONA:([^}]+)\}\}/g;

// Deterministically substitute {{PERSONA:<name>}} tokens with that persona's fixed
// physicalDescription + wardrobe. We do this in code rather than trusting the model to
// copy prose verbatim across slides — LLMs reliably paraphrase repeated descriptions,
// which silently breaks visual consistency across a carousel.
function resolvePersonaTokens(slides: Slide[], personas: Persona[] | undefined): Slide[] {
  if (!personas || personas.length === 0) return slides;
  const byName = new Map(personas.map((p) => [p.name.trim(), p]));

  return slides.map((slide) => ({
    ...slide,
    imagePrompt: slide.imagePrompt.replace(PERSONA_TOKEN, (match, rawName: string) => {
      const persona = byName.get(rawName.trim());
      if (!persona) return "the person"; // unknown name — degrade gracefully, no raw token leaks
      return `${persona.physicalDescription}, wearing ${persona.wardrobe}`;
    }),
  }));
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

  // Static is a single image, unless the user asked for alternative takes
  // (variations) — cap at 3 to guard against a runaway response.
  if (format === "Static") {
    slides = slides.slice(0, 3);
  }

  let personas: Persona[] | undefined;
  if (Array.isArray(obj.personas)) {
    // Defend against the model occasionally writing the {{PERSONA:name}} token into
    // the persona's own description fields instead of real prose (it should only ever
    // appear inside imagePrompt) — strip any stray token so the Cast sheet and the
    // substitution below never surface raw placeholder syntax.
    const stripToken = (s: string) => s.replace(PERSONA_TOKEN, "").trim();
    const cleaned = obj.personas
      .filter(isPersona)
      .map((p) => ({
        ...p,
        physicalDescription: stripToken(p.physicalDescription),
        wardrobe: stripToken(p.wardrobe),
      }))
      .filter((p) => p.physicalDescription.length > 0 && p.wardrobe.length > 0);
    personas = cleaned.length > 0 ? cleaned : undefined;
  }

  return {
    diagnosis: obj.diagnosis,
    world: obj.world as WorldId,
    format,
    note: typeof obj.note === "string" ? obj.note : undefined,
    slides: resolvePersonaTokens(slides, personas),
    personas,
  };
}
