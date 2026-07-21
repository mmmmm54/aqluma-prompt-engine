"use client";

import { useMemo, useState } from "react";
import ResultView from "@/components/ResultView";
import type { CalendarItem } from "@/lib/calendarTypes";
import { buildIntakePayloadFromCalendarItem } from "@/lib/calendarPrompt";
import { getRecentMetaphors, pushHistory, rateHistory } from "@/lib/history";
import type { ApiResponse, GenerateResult, IntakePayload, Rating } from "@/lib/types";

interface Props {
  items: CalendarItem[];
}

type MonthFilter = "all" | 3 | 4;
type PlatformFilter = "all" | "LinkedIn" | "Facebook";

const THEME: Record<string, { border: string; label: string; chip: string }> = {
  clay: {
    border: "border-clay/30",
    label: "text-clay",
    chip: "bg-clay text-canvas",
  },
  studio: {
    border: "border-bone/25",
    label: "text-bone",
    chip: "bg-bone text-canvas",
  },
  musee: {
    border: "border-saffron/30",
    label: "text-saffron",
    chip: "bg-saffron text-canvas",
  },
};

function themeFor(world: string) {
  if (/clay/i.test(world)) return THEME.clay;
  if (/studio/i.test(world)) return THEME.studio;
  return THEME.musee;
}

function CardCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-stone transition hover:border-stone hover:text-bone"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

function ItemCard({ item }: { item: CalendarItem }) {
  const [expanded, setExpanded] = useState(false);
  const t = themeFor(item.world);
  const isCarousel = item.format === "Carousel";

  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [gen, setGen] = useState<{
    id: string;
    result: GenerateResult;
    payload: IntakePayload;
  } | null>(null);
  const [rating, setRating] = useState<Rating | undefined>(undefined);

  async function generate() {
    setGenLoading(true);
    setGenError(null);
    try {
      const basePayload = buildIntakePayloadFromCalendarItem(item);
      const pastContext = getRecentMetaphors(12);
      const payload = { ...basePayload, pastContext };
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: ApiResponse = await res.json();
      if (data.ok) {
        const id = pushHistory(data.data, payload);
        setGen({ id, result: data.data, payload });
        setRating(undefined);
      } else {
        setGenError(data.error);
      }
    } catch {
      setGenError("Network error — please try again.");
    } finally {
      setGenLoading(false);
    }
  }

  function handleRate(id: string, r: Rating) {
    rateHistory(id, r);
    setRating(r);
  }

  function fullText(): string {
    const parts = [
      `${item.id}`,
      `${item.platform} · ${item.format} · ${item.show} · Week ${item.week}`,
      `Title: ${item.title}`,
      item.hook ? `Hook/Opening: ${item.hook}` : "",
      item.bodyCopy ? `Body Copy: ${item.bodyCopy}` : "",
      item.closingLine ? `Closing Line: ${item.closingLine}` : "",
      item.caption ? `Caption: ${item.caption}` : "",
      `CTA: ${item.cta}`,
      isCarousel && item.slides
        ? item.slides
            .map(
              (s) => `Slide ${s.index} (${s.role}): ${s.title}\n${s.paragraph}`
            )
            .join("\n\n")
        : "",
      `Visual Suggestion: ${item.visualSuggestion}`,
      `Safety Note: ${item.safetyNote}`,
    ];
    return parts.filter(Boolean).join("\n\n");
  }

  return (
    <div className={`rounded-xl2 border bg-panel/60 shadow-card ${t.border}`}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${t.chip}`}
          >
            {item.format}
            {isCarousel && item.slides ? ` · ${item.slides.length} slides` : ""}
          </span>
          <span className="shrink-0 rounded-full bg-line px-2.5 py-0.5 text-[11px] font-medium text-stone">
            {item.platform}
          </span>
          <span className="shrink-0 rounded-full bg-line px-2.5 py-0.5 text-[11px] font-medium text-stone">
            W{item.week}
          </span>
          <h3 className="truncate font-serif text-base leading-snug text-bone">
            {item.title}
          </h3>
        </div>
        <span className={`shrink-0 text-xs font-medium ${t.label}`}>
          {expanded ? "▲ Collapse" : "▼ Expand"}
        </span>
      </button>

      {expanded && (
        <div className="animate-fade-in space-y-4 border-t border-line px-5 pb-5 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-stone">
              <span className={`font-semibold ${t.label}`}>{item.id}</span>
              {"  ·  "}
              {item.show} — {item.world}
            </p>
            <div className="flex items-center gap-2">
              <CardCopyButton text={fullText()} />
              <button
                type="button"
                onClick={generate}
                disabled={genLoading}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:opacity-40 ${t.border} ${t.label} hover:bg-canvas/40`}
              >
                {genLoading ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-current/40 border-t-current" />
                    Generating…
                  </>
                ) : gen ? (
                  "↺ Regenerate prompt"
                ) : (
                  "✦ Generate prompt"
                )}
              </button>
            </div>
          </div>

          {item.role && (
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-wide ${t.label}`}>
                Carousel Role
              </p>
              <p className="mt-0.5 text-sm text-bone/80">{item.role}</p>
            </div>
          )}

          {item.hook && (
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-wide ${t.label}`}>
                Hook / Opening Line
              </p>
              <p className="mt-0.5 text-sm text-bone/80">{item.hook}</p>
            </div>
          )}

          {item.bodyCopy && (
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-wide ${t.label}`}>
                Body Copy
              </p>
              <p className="mt-0.5 whitespace-pre-wrap text-sm leading-relaxed text-bone/80">
                {item.bodyCopy}
              </p>
            </div>
          )}

          {item.closingLine && (
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-wide ${t.label}`}>
                Closing Line
              </p>
              <p className="mt-0.5 text-sm italic text-bone/80">{item.closingLine}</p>
            </div>
          )}

          {isCarousel && item.slides && item.slides.length > 0 && (
            <div>
              <p className={`mb-2 text-[11px] font-semibold uppercase tracking-wide ${t.label}`}>
                Slides
              </p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {item.slides.map((slide) => (
                  <div
                    key={slide.index}
                    className="rounded-lg border border-line bg-canvas/60 p-3.5"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-stone">
                      Slide {slide.index} · {slide.role}
                    </p>
                    <p className="mt-1 text-sm font-medium text-bone">{slide.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-bone/70">
                      {slide.paragraph}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.caption && (
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-wide ${t.label}`}>
                Caption
              </p>
              <p className="mt-0.5 whitespace-pre-wrap text-sm leading-relaxed text-bone/80">
                {item.caption}
              </p>
            </div>
          )}

          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-wide ${t.label}`}>
              CTA
            </p>
            <p className="mt-0.5 text-sm text-bone/80">{item.cta}</p>
          </div>

          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-wide ${t.label}`}>
              Visual Suggestion
            </p>
            <p className="mt-0.5 text-sm leading-relaxed text-bone/70">
              {item.visualSuggestion}
            </p>
          </div>

          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-wide ${t.label}`}>
              Safety Note
            </p>
            <p className="mt-0.5 text-sm leading-relaxed text-bone/70">{item.safetyNote}</p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-line pt-3 text-xs text-stone">
            <span>Production difficulty: {item.productionDifficulty}</span>
            <span>Status: {item.status}</span>
            <span>{item.reviewNeeded}</span>
          </div>

          {genError && (
            <div
              role="alert"
              className="rounded-lg border border-clay/40 bg-clay/10 px-4 py-3 text-sm"
            >
              <p className="font-medium text-clay">Something didn&apos;t come through.</p>
              <p className="mt-1 text-bone/80">{genError}</p>
            </div>
          )}

          {gen && (
            <div className="border-t border-line pt-4">
              <ResultView
                result={gen.result}
                historyId={gen.id}
                currentRating={rating}
                loading={genLoading}
                onRegenerate={generate}
                onRate={handleRate}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CalendarView({ items }: Props) {
  const [month, setMonth] = useState<MonthFilter>("all");
  const [platform, setPlatform] = useState<PlatformFilter>("all");

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (month === "all" || item.month === month) &&
          (platform === "all" || item.platform === platform)
      ),
    [items, month, platform]
  );

  const grouped = useMemo(() => {
    const byMonth = new Map<number, Map<number, CalendarItem[]>>();
    for (const item of filtered) {
      if (!byMonth.has(item.month)) byMonth.set(item.month, new Map());
      const byWeek = byMonth.get(item.month)!;
      if (!byWeek.has(item.week)) byWeek.set(item.week, []);
      byWeek.get(item.week)!.push(item);
    }
    return byMonth;
  }, [filtered]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-4">
        <div className="flex gap-1.5 rounded-lg border border-line bg-panel/40 p-1">
          {(["all", 3, 4] as MonthFilter[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMonth(m)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                month === m
                  ? "bg-saffron text-canvas"
                  : "text-stone hover:text-bone"
              }`}
            >
              {m === "all" ? "All months" : `Month ${m}`}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5 rounded-lg border border-line bg-panel/40 p-1">
          {(["all", "LinkedIn", "Facebook"] as PlatformFilter[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlatform(p)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                platform === p
                  ? "bg-saffron text-canvas"
                  : "text-stone hover:text-bone"
              }`}
            >
              {p === "all" ? "All platforms" : p}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-12">
        {[...grouped.entries()]
          .sort(([a], [b]) => a - b)
          .map(([monthNum, byWeek]) => (
            <section key={monthNum}>
              <h2 className="mb-5 font-serif text-2xl text-bone">Month {monthNum}</h2>
              <div className="space-y-8">
                {[...byWeek.entries()]
                  .sort(([a], [b]) => a - b)
                  .map(([weekNum, weekItems]) => (
                    <div key={weekNum}>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone">
                        Week {weekNum}
                      </p>
                      <div className="space-y-3">
                        {weekItems.map((item) => (
                          <ItemCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          ))}

        {filtered.length === 0 && (
          <p className="text-sm text-stone">No items match the current filters.</p>
        )}
      </div>
    </div>
  );
}
