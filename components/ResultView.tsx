"use client";

import { useState } from "react";
import { worldName, type GenerateResult, type Rating, type WorldId } from "@/lib/types";

interface Props {
  result: GenerateResult;
  historyId: string;
  currentRating?: Rating;
  onRegenerate: () => void;
  onRate: (id: string, rating: Rating) => void;
  loading: boolean;
}

// Uniform dark cards — each world is signalled by an ACCENT only (border/label/chip).
const THEME: Record<
  WorldId,
  {
    border: string;
    label: string;
    chip: string;
    btn: string;
    rateActive: string;
  }
> = {
  briefing: {
    border: "border-clay/30",
    label: "text-clay",
    chip: "bg-clay text-canvas",
    btn: "border-clay/40 text-clay hover:bg-clay hover:text-canvas",
    rateActive: "bg-clay/15 border-clay text-clay",
  },
  studio: {
    border: "border-bone/25",
    label: "text-bone",
    chip: "bg-bone text-canvas",
    btn: "border-bone/30 text-bone hover:bg-bone hover:text-canvas",
    rateActive: "bg-bone/10 border-bone/50 text-bone",
  },
  musee: {
    border: "border-saffron/30",
    label: "text-saffron",
    chip: "bg-saffron text-canvas",
    btn: "border-saffron/40 text-saffron hover:bg-saffron hover:text-canvas",
    rateActive: "bg-saffron/15 border-saffron text-saffron",
  },
};

function CopyButton({
  text,
  className,
  label = "Copy prompt",
}: {
  text: string;
  className: string;
  label?: string;
}) {
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
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${className}`}
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

export default function ResultView({
  result,
  historyId,
  currentRating,
  onRegenerate,
  onRate,
  loading,
}: Props) {
  const t = THEME[result.world];
  const isCarousel = result.format === "Carousel";
  const hasVariations = !isCarousel && result.slides.length > 1;
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function labelFor(i: number): string {
    if (isCarousel) return `Slide ${i + 1}`;
    if (hasVariations) return `Variation ${i + 1}`;
    return "Image prompt";
  }

  // All prompts as one labelled text block — for Copy All and Download.
  function allPromptsText(): string {
    const header = `${worldName(result.world)} — ${result.format}\n${result.diagnosis}${
      result.note ? `\nApproach: ${result.note}` : ""
    }\n`;
    const body = result.slides
      .map((s, i) => `${labelFor(i)}:\n${s.imagePrompt}\n(Text space: ${s.textSpace})`)
      .join("\n\n");
    return `${header}\n${body}\n`;
  }

  function downloadTxt() {
    const blob = new Blob([allPromptsText()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aqluma-${result.world}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="animate-fade-in">
      <div className="mb-5 rounded-xl2 border border-line bg-panel/40 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone">
          Diagnosis
        </p>
        <p className="mt-1 font-serif text-lg leading-snug text-bone">
          {result.diagnosis}
        </p>
      </div>

      <article className={`rounded-xl2 border bg-panel/60 p-6 shadow-card sm:p-8 ${t.border}`}>
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${t.chip}`}
            >
              {result.format}
              {isCarousel ? ` · ${result.slides.length} slides` : ""}
              {hasVariations ? ` · ${result.slides.length} variations` : ""}
            </span>
            <h2 className="font-serif text-xl leading-snug text-bone">
              {worldName(result.world)}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onRate(historyId, "up")}
                title="Good prompt"
                className={`rounded-lg border px-2.5 py-1.5 text-sm transition ${
                  currentRating === "up"
                    ? t.rateActive
                    : "border-line text-stone hover:border-stone hover:text-bone"
                }`}
              >
                👍
              </button>
              <button
                type="button"
                onClick={() => onRate(historyId, "down")}
                title="Needs improvement"
                className={`rounded-lg border px-2.5 py-1.5 text-sm transition ${
                  currentRating === "down"
                    ? t.rateActive
                    : "border-line text-stone hover:border-stone hover:text-bone"
                }`}
              >
                👎
              </button>
            </div>

            <button
              type="button"
              onClick={onRegenerate}
              disabled={loading}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-sm font-medium transition disabled:opacity-40 ${t.btn}`}
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/40 border-t-current" />
                  Regenerating…
                </>
              ) : (
                "↺ Regenerate"
              )}
            </button>
          </div>
        </header>

        {result.note && (
          <div className="mb-5">
            <p className={`text-xs font-semibold uppercase tracking-wide ${t.label}`}>
              Approach
            </p>
            <p className="mt-0.5 text-sm text-bone/70">{result.note}</p>
          </div>
        )}

        {result.personas && result.personas.length > 0 && (
          <div className="mb-5 rounded-lg border border-line bg-canvas/60 p-4">
            <p className={`text-xs font-semibold uppercase tracking-wide ${t.label}`}>
              Cast
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {result.personas.map((persona, i) => (
                <div key={i} className="rounded-lg border border-line bg-panel/40 p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-bone">
                      {persona.name}{" "}
                      <span className="font-normal text-stone">
                        · {persona.age} · {persona.role}
                      </span>
                    </p>
                    <CopyButton
                      text={`${persona.physicalDescription}\n${persona.wardrobe}`}
                      className={t.btn}
                      label="Copy"
                    />
                  </div>
                  <p className="mt-2 text-sm text-bone/70">{persona.physicalDescription}</p>
                  <p className="mt-1 text-sm text-bone/70">{persona.wardrobe}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.slides.length > 1 && (
          <div className="mb-5 flex flex-wrap gap-2">
            <CopyButton
              text={allPromptsText()}
              className={t.btn}
              label={`Copy all ${result.slides.length}`}
            />
            <button
              type="button"
              onClick={downloadTxt}
              className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${t.btn}`}
            >
              ↓ Download .txt
            </button>
          </div>
        )}

        <div className="space-y-5">
          {result.slides.map((slide, i) => {
            const isExpanded = expanded.has(i);
            return (
              <div key={i}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <p className={`text-xs font-semibold uppercase tracking-wide ${t.label}`}>
                    {labelFor(i)}
                  </p>
                  <CopyButton text={slide.imagePrompt} className={t.btn} />
                </div>

                <div className="relative">
                  <pre
                    className={`whitespace-pre-wrap rounded-lg border border-line bg-canvas/70 p-3.5 font-mono text-[12.5px] leading-relaxed text-bone/90 transition-all ${
                      isExpanded ? "max-h-none" : "max-h-24 overflow-hidden"
                    }`}
                  >
                    {slide.imagePrompt}
                  </pre>
                  {!isExpanded && (
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 rounded-b-lg bg-gradient-to-t from-canvas to-transparent" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className={`mt-1.5 text-xs font-medium transition ${t.label} hover:opacity-70`}
                >
                  {isExpanded ? "▲ Collapse" : "▼ Show full prompt"}
                </button>

                <p className="mt-2 text-sm text-bone/70">
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wide ${t.label}`}
                  >
                    Text space:{" "}
                  </span>
                  {slide.textSpace}
                </p>
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
}
