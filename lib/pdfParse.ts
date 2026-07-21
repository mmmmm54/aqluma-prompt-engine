import type { PdfGenerateResult, PdfPage, WorldId } from "./pdfTypes";

const WORLD_IDS: WorldId[] = ["briefing", "studio", "musee"];

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

function isPage(v: unknown): v is PdfPage {
  if (typeof v !== "object" || v === null) return false;
  const p = v as Record<string, unknown>;
  return (
    typeof p.pageNumber === "number" &&
    typeof p.pageTitle === "string" &&
    typeof p.layout === "string" &&
    typeof p.typographyNotes === "string" &&
    typeof p.colorUsage === "string" &&
    typeof p.imagePrompt === "string" &&
    typeof p.designNote === "string"
  );
}

// Parse + validate the model output. Throws a friendly Error on any problem.
export function parsePdfGenerateResult(raw: string): PdfGenerateResult {
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

  if (typeof obj.guideTitle !== "string") {
    throw new Error("Missing guideTitle in model output.");
  }
  if (typeof obj.world !== "string" || !WORLD_IDS.includes(obj.world as WorldId)) {
    throw new Error("Missing or invalid world in model output.");
  }
  if (typeof obj.worldRationale !== "string") {
    throw new Error("Missing worldRationale in model output.");
  }

  const ts = obj.typographySystem as Record<string, unknown> | undefined;
  if (
    typeof ts !== "object" ||
    ts === null ||
    typeof ts.heading !== "string" ||
    typeof ts.body !== "string" ||
    typeof ts.accent !== "string"
  ) {
    throw new Error("Missing or invalid typographySystem in model output.");
  }

  const cs = obj.colorSystem as Record<string, unknown> | undefined;
  if (
    typeof cs !== "object" ||
    cs === null ||
    typeof cs.ground !== "string" ||
    typeof cs.primary !== "string" ||
    typeof cs.accent !== "string" ||
    typeof cs.accentRule !== "string"
  ) {
    throw new Error("Missing or invalid colorSystem in model output.");
  }

  if (!Array.isArray(obj.pages) || obj.pages.length === 0) {
    throw new Error("Model output contained no pages.");
  }
  if (!obj.pages.every(isPage)) {
    throw new Error("One or more pages is missing required fields.");
  }

  const pages = (obj.pages as PdfPage[])
    .slice()
    .sort((a, b) => a.pageNumber - b.pageNumber);

  return {
    guideTitle: obj.guideTitle,
    world: obj.world as WorldId,
    worldRationale: obj.worldRationale,
    typographySystem: {
      heading: ts.heading as string,
      body: ts.body as string,
      accent: ts.accent as string,
    },
    colorSystem: {
      ground: cs.ground as string,
      primary: cs.primary as string,
      accent: cs.accent as string,
      accentRule: cs.accentRule as string,
    },
    pages,
  };
}
