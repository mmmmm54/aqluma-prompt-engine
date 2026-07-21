// Types for the "Lead Magnet PDF Designer" engine — a sister feature to the
// social Content Machine (lib/types.ts) that turns a written, page-by-page
// parent guide into a full page-by-page art-direction brief. It reuses the
// same three AQLUMA worlds (WorldId) as the social engine, so both features
// share one brand identity instead of each inventing its own palette system.
import type { WorldId } from "./types";

export type { WorldId };

export interface TypographySystem {
  heading: string;
  body: string;
  accent: string;
}

export interface ColorSystem {
  ground: string;
  primary: string;
  accent: string;
  accentRule: string;
}

export interface PdfPage {
  pageNumber: number;
  pageTitle: string;
  layout: string;
  typographyNotes: string;
  colorUsage: string;
  imagePrompt: string;
  designNote: string;
}

export interface PdfGenerateResult {
  guideTitle: string;
  world: WorldId;
  worldRationale: string;
  typographySystem: TypographySystem;
  colorSystem: ColorSystem;
  pages: PdfPage[];
}

export interface PdfIntakePayload {
  content: string; // the full pasted page-by-page lead magnet copy
  worldHint: WorldId | "auto";
}

export type PdfApiResponse =
  | { ok: true; data: PdfGenerateResult }
  | { ok: false; error: string };

export const WORLD_HINTS: { id: WorldId | "auto"; name: string; blurb: string }[] = [
  {
    id: "auto",
    name: "Auto-detect",
    blurb: "Let the model choose Briefing / Studio / Musée from the content.",
  },
  {
    id: "briefing",
    name: "Briefing — Warm Clay Room",
    blurb: "Parent trust, home guidance. Natural fit for Le Piège du Copier-Coller.",
  },
  {
    id: "studio",
    name: "Studio — Light Studio Room",
    blurb: "Creation, method, revision. Natural fit for La Voix Perdue.",
  },
  {
    id: "musee",
    name: "Musée des Erreurs IA — Dark Museum Room",
    blurb: "AI mistakes, verification. Natural fit for L'Erreur Assurée.",
  },
];
