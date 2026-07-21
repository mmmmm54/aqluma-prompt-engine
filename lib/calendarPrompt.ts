import type { CalendarItem } from "./calendarTypes";
import type { Audience, Goal, IntakePayload, WorldId } from "./types";

function worldIdFor(world: string): WorldId {
  if (/clay/i.test(world)) return "briefing";
  if (/studio/i.test(world)) return "studio";
  return "musee";
}

function goalFor(show: string): Goal {
  if (/briefing/i.test(show)) return "Trust";
  if (/studio/i.test(show)) return "Promote";
  return "Educate";
}

function audienceFor(show: string): Audience {
  return /briefing/i.test(show) ? "Parents" : "Students";
}

// The brand's own Visual Suggestion / 1080x1350 vs 1080x1080 spec tells us the
// intended crop; fall back to a platform default when it isn't stated.
function aspectRatioFor(item: CalendarItem): IntakePayload["aspectRatio"] {
  if (/1080\s*x\s*1350/i.test(item.visualSuggestion)) return "4:5";
  if (/1080\s*x\s*1080/i.test(item.visualSuggestion)) return "1:1";
  return item.platform === "Facebook" ? "1:1" : "4:5";
}

function buildContent(item: CalendarItem): string {
  const parts = [
    item.title,
    item.hook,
    item.bodyCopy,
    item.closingLine,
    item.caption,
  ].filter(Boolean);
  return parts.join("\n\n");
}

function buildMustInclude(item: CalendarItem): string {
  const parts: string[] = [
    "Invent your OWN fresh hero-object metaphor from the content below — do NOT " +
      "reuse this post's original shoot-brief props literally (notebook, tea glass, " +
      "blank paper, magnifying glass, etc. are the OLD literal brief, not the goal). " +
      "Use the creative spark kit below and the GOLDEN TEST to find something sharper.",
  ];
  if (item.safetyNote) {
    parts.push(`Hard brand-safety constraints (must still respect): ${item.safetyNote}`);
  }
  return parts.join("\n");
}

// Turns one parsed calendar item into a ready-to-send IntakePayload for
// /api/generate — reusing the exact same engine the main Prompt Engine page uses.
export function buildIntakePayloadFromCalendarItem(item: CalendarItem): IntakePayload {
  const isCarousel = item.format === "Carousel";

  return {
    content: buildContent(item),
    world: worldIdFor(item.world),
    format: item.format,
    aiElement: "Auto",
    aiElementHint: "",
    humanPresence: "None",
    humanPresenceHint: "",
    platform: item.platform,
    goal: goalFor(item.show),
    audience: audienceFor(item.show),
    mustInclude: buildMustInclude(item),
    textInImage: false,
    exactWords: "",
    outputFormat: "brief",

    aspectRatio: aspectRatioFor(item),
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

    slideCount: isCarousel ? (item.slides?.length ?? 6) : 0,
    narrativeArc: "Auto",
    perSlideNotes: isCarousel
      ? (item.slides ?? [])
          .map((s) => `${s.role}: ${s.title} — ${s.paragraph}`)
          .join("\n")
      : "",

    targetModel: "Nano Banana 2",
    customNegatives: "",
    variations: 1,
    onImageLanguage: "French",
  };
}
