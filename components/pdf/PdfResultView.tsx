"use client";

import { useState } from "react";
import { worldName, type WorldId } from "@/lib/types";
import type { PdfGenerateResult } from "@/lib/pdfTypes";

interface Props {
  result: PdfGenerateResult;
  loading: boolean;
  onRegenerate: () => void;
}

// Same three worlds, same accent colours as the social ResultView (lib
// components/ResultView.tsx) — one visual identity across the whole app.
const THEME: Record<
  WorldId,
  { border: string; label: string; chip: string; btn: string; dot: string }
> = {
  briefing: {
    border: "border-clay/30",
    label: "text-clay",
    chip: "bg-clay text-canvas",
    btn: "border-clay/40 text-clay hover:bg-clay hover:text-canvas",
    dot: "bg-clay",
  },
  studio: {
    border: "border-bone/25",
    label: "text-bone",
    chip: "bg-bone text-canvas",
    btn: "border-bone/30 text-bone hover:bg-bone hover:text-canvas",
    dot: "bg-bone",
  },
  musee: {
    border: "border-saffron/30",
    label: "text-saffron",
    chip: "bg-saffron text-canvas",
    btn: "border-saffron/40 text-saffron hover:bg-saffron hover:text-canvas",
    dot: "bg-saffron",
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

export default function PdfResultView({ result, loading, onRegenerate }: Props) {
  const t = THEME[result.world];
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function toggle(pageNumber: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(pageNumber) ? next.delete(pageNumber) : next.add(pageNumber);
      return next;
    });
  }

  function allPromptsText(): string {
    const header = `${result.guideTitle} — ${worldName(result.world)}\n${result.worldRationale}\n`;
    const body = result.pages
      .map(
        (p) =>
          `Page ${p.pageNumber} — ${p.pageTitle}\n${p.imagePrompt}\n(Layout: ${p.layout})`
      )
      .join("\n\n");
    return `${header}\n${body}\n`;
  }

  function downloadTxt() {
    const blob = new Blob([allPromptsText()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aqluma-lead-magnet-${result.world}-${new Date()
      .toISOString()
      .slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="animate-fade-in">
      <div className="mb-5 rounded-xl2 border border-line bg-panel/40 px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${t.chip}`}
          >
            {worldName(result.world)}
          </span>
          <h2 className="font-serif text-xl leading-snug text-bone">{result.guideTitle}</h2>
        </div>
        <p className="mt-2 text-sm text-bone/70">{result.worldRationale}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-line bg-canvas/50 p-3.5">
            <p className={`text-xs font-semibold uppercase tracking-wide ${t.label}`}>
              Typography
            </p>
            <dl className="mt-2 space-y-1 text-sm text-bone/80">
              <div className="flex gap-2">
                <dt className="shrink-0 text-stone">Heading</dt>
                <dd>{result.typographySystem.heading}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 text-stone">Body</dt>
                <dd>{result.typographySystem.body}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 text-stone">Accent</dt>
                <dd>{result.typographySystem.accent}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-line bg-canvas/50 p-3.5">
            <p className={`text-xs font-semibold uppercase tracking-wide ${t.label}`}>Color</p>
            <dl className="mt-2 space-y-1 text-sm text-bone/80">
              <div className="flex items-center gap-2">
                <dt className="shrink-0 text-stone">Ground</dt>
                <dd>{result.colorSystem.ground}</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="shrink-0 text-stone">Primary</dt>
                <dd>{result.colorSystem.primary}</dd>
              </div>
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${t.dot}`} />
                <dt className="shrink-0 text-stone">Accent</dt>
                <dd>{result.colorSystem.accent}</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-bone/60">{result.colorSystem.accentRule}</p>
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <CopyButton text={allPromptsText()} className={t.btn} label="Copy all prompts" />
          <button
            type="button"
            onClick={downloadTxt}
            className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${t.btn}`}
          >
            ↓ Download .txt
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

      <div className="space-y-5">
        {result.pages.map((page) => {
          const isExpanded = expanded.has(page.pageNumber);
          return (
            <article
              key={page.pageNumber}
              className={`rounded-xl2 border bg-panel/60 p-6 shadow-card sm:p-7 ${t.border}`}
            >
              <header className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-serif text-lg leading-snug text-bone">
                  <span className={`mr-2 text-sm font-sans font-medium ${t.label}`}>
                    Page {page.pageNumber}
                  </span>
                  {page.pageTitle}
                </h3>
                <CopyButton text={page.imagePrompt} className={t.btn} />
              </header>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-stone">
                    Layout
                  </p>
                  <p className="mt-0.5 text-sm text-bone/80">{page.layout}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-stone">
                    Typography
                  </p>
                  <p className="mt-0.5 text-sm text-bone/80">{page.typographyNotes}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-stone">
                    Color usage
                  </p>
                  <p className="mt-0.5 text-sm text-bone/80">{page.colorUsage}</p>
                </div>
              </div>

              <div className="relative mt-4">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-stone">
                  Image prompt
                </p>
                <pre
                  className={`whitespace-pre-wrap rounded-lg border border-line bg-canvas/70 p-3.5 font-mono text-[12.5px] leading-relaxed text-bone/90 transition-all ${
                    isExpanded ? "max-h-none" : "max-h-24 overflow-hidden"
                  }`}
                >
                  {page.imagePrompt}
                </pre>
                {!isExpanded && (
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 rounded-b-lg bg-gradient-to-t from-canvas to-transparent" />
                )}
              </div>
              <button
                type="button"
                onClick={() => toggle(page.pageNumber)}
                className={`mt-1.5 text-xs font-medium transition ${t.label} hover:opacity-70`}
              >
                {isExpanded ? "▲ Collapse" : "▼ Show full prompt"}
              </button>

              <p className="mt-3 text-sm text-bone/70">
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wide ${t.label}`}
                >
                  Design note:{" "}
                </span>
                {page.designNote}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
