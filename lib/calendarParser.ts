import type { CalendarItem, CalendarSlide } from "./calendarTypes";

function cleanQuoted(value: string): string {
  return value
    .trim()
    .replace(/^\*+/, "")
    .replace(/\*+$/, "")
    .trim()
    .replace(/^«\s*/, "")
    .replace(/\s*»$/, "")
    .trim();
}

// Parses the "### ID" + "- **Field:** value" markdown calendar format
// (including nested "Slide-by-Slide Copy" lists) into structured items.
export function parseCalendarMarkdown(raw: string): CalendarItem[] {
  const lines = raw.split(/\r?\n/);
  const items: CalendarItem[] = [];

  let month: 3 | 4 = 3;
  let current: Record<string, string> | null = null;
  let currentId = "";
  let slides: CalendarSlide[] = [];
  let inSlideList = false;
  let currentSlide: Partial<CalendarSlide> | null = null;

  function flush() {
    if (!current) return;
    const format = (current["Format"] as "Static" | "Carousel") ?? "Static";
    const item: CalendarItem = {
      id: currentId,
      month,
      week: Number(current["Week"] ?? 0),
      platform: (current["Platform"] as "LinkedIn" | "Facebook") ?? "LinkedIn",
      format,
      show: current["Show"] ?? "",
      world: current["World"] ?? "",
      title: current["Post Title"] ?? current["Carousel Title"] ?? "",
      role: current["Carousel Role"],
      hook: current["Hook"] ?? current["Opening Line"],
      bodyCopy: current["Body Copy"],
      closingLine: current["Closing Line"],
      caption: current["Caption"],
      cta: current["CTA"] ?? "",
      visualSuggestion: current["Visual Suggestion"] ?? "",
      safetyNote: current["Safety Note"] ?? "",
      productionDifficulty: current["Production Difficulty"] ?? "",
      status: current["Status"] ?? "",
      reviewNeeded: current["Review Needed"] ?? "",
      slides: slides.length > 0 ? slides : undefined,
    };
    items.push(item);
    current = null;
    currentId = "";
    slides = [];
    inSlideList = false;
    currentSlide = null;
  }

  for (const line of lines) {
    const monthHeader = line.match(/^##\s+PART\s+\d+\.\s+Month\s+(\d+)/);
    if (monthHeader) {
      month = Number(monthHeader[1]) === 4 ? 4 : 3;
      continue;
    }

    const itemHeader = line.match(/^###\s+(.+?)\s*$/);
    if (itemHeader) {
      flush();
      current = {};
      currentId = itemHeader[1].trim();
      continue;
    }

    if (!current) continue;

    const slideStart = line.match(/^\s{4}-\s*Slide\s+(\d+)\s*$/);
    if (slideStart) {
      if (currentSlide) {
        slides.push({
          index: slides.length + 1,
          role: currentSlide.role ?? "",
          title: currentSlide.title ?? "",
          paragraph: currentSlide.paragraph ?? "",
        });
      }
      currentSlide = {};
      inSlideList = true;
      continue;
    }

    const slideField = line.match(/^\s{8}-\s*Slide\s+(Role|Title|Paragraph):\s*(.*)$/);
    if (slideField && currentSlide) {
      const [, field, value] = slideField;
      const cleaned = cleanQuoted(value);
      if (field === "Role") currentSlide.role = cleaned;
      if (field === "Title") currentSlide.title = cleaned;
      if (field === "Paragraph") currentSlide.paragraph = cleaned;
      continue;
    }

    const topField = line.match(/^-\s*\*\*([^*:]+):\*\*\s?(.*)$/);
    if (topField) {
      if (inSlideList && currentSlide) {
        slides.push({
          index: slides.length + 1,
          role: currentSlide.role ?? "",
          title: currentSlide.title ?? "",
          paragraph: currentSlide.paragraph ?? "",
        });
        currentSlide = null;
        inSlideList = false;
      }
      const [, field, value] = topField;
      current[field.trim()] = value.trim();
      continue;
    }
  }
  if (currentSlide) {
    slides.push({
      index: slides.length + 1,
      role: currentSlide.role ?? "",
      title: currentSlide.title ?? "",
      paragraph: currentSlide.paragraph ?? "",
    });
  }
  flush();

  return items;
}
