import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import CalendarView from "@/components/calendar/CalendarView";
import { parseCalendarMarkdown } from "@/lib/calendarParser";

export const metadata = {
  title: "AQLUMA Content Calendar",
  description: "Month 3 and Month 4 LinkedIn / Facebook content calendar.",
};

export default function CalendarPage() {
  const filePath = path.join(process.cwd(), "data", "aqluma-calendar.md");
  const raw = fs.readFileSync(filePath, "utf-8");
  const items = parseCalendarMarkdown(raw);

  return (
    <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="mb-8">
        <Link
          href="/"
          className="mb-4 inline-block text-xs font-medium text-stone transition hover:text-bone"
        >
          ← Back to Prompt Engine
        </Link>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-saffron">
          AQLUMA
        </p>
        <h1 className="font-serif text-3xl leading-tight text-bone sm:text-4xl">
          Content Calendar
        </h1>
        <p className="mt-3 max-w-2xl text-stone">
          Month 3 and Month 4, LinkedIn and Facebook — {items.length} content items.
          Static posts and 6-slide carousels, grouped by month and week.
        </p>
      </header>

      <CalendarView items={items} />
    </main>
  );
}
