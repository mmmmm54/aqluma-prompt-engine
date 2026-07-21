export interface CalendarSlide {
  index: number;
  role: string;
  title: string;
  paragraph: string;
}

export interface CalendarItem {
  id: string;
  month: 3 | 4;
  week: number;
  platform: "LinkedIn" | "Facebook";
  format: "Static" | "Carousel";
  show: string;
  world: string;
  title: string;
  role?: string;
  hook?: string;
  bodyCopy?: string;
  closingLine?: string;
  caption?: string;
  cta: string;
  visualSuggestion: string;
  safetyNote: string;
  productionDifficulty: string;
  status: string;
  reviewNeeded: string;
  slides?: CalendarSlide[];
}
