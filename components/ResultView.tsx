"use client";

import { useState } from "react";
import { worldName, type GenerateResult, type WorldId } from "@/lib/types";

interface Props {
  result: GenerateResult;
}

// Per-world mood (§3 of the brief). Each maps to a themed surface and accents.
const THEME: Record<
  WorldId,
  {
    card: string;
    name: string;
    label: string;
    body: string;
    promptBlock: string;
    chip: string;
    copyBtn: string;
  }
> = {
  briefing: {
    card: "bg-clay/12 border-clay/25",
    name: "text-ink",
    label: "text-clay",
    body: "text-ink/80",
    promptBlock: "bg-bone/80 border-clay/20 text-ink/90",
    chip: "bg-clay text-white",
    copyBtn: "border-clay/40 text-clay hover:bg-clay hover:text-white",
  },
  studio: {
    card: "bg-white border-stone/25",
    name: "text-ink",
    label: "text-stone",
    body: "text-ink/75",
    promptBlock: "bg-bone/70 border-stone/25 text-ink/90",
    chip: "bg-ink text-bone",
    copyBtn: "border-ink/30 text-ink hover:bg-ink hover:text-bone",
  },
  musee: {
    card: "bg-black border-black shadow-spotlight",
    name: "text-bone",
    label: "text-saffron",
    body: "text-bone/70",
    promptBlock: "bg-white/5 border-saffron/20 text-bone/90",
    chip: "bg-saffron text-black",
    copyBtn: "border-saffron/50 text-saffron hover:bg-saffron hover:text-black",
  },
};

function CopyButton({ text, className }: { text: string; className: string }) {
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
      {copied ? "Copied ✓" : "Copy prompt"}
    </button>
  );
}

export default function ResultView({ result }: Props) {
  const t = THEME[result.world];
  const isCarousel = result.format === "Carousel";

  return (
    <section className="mt-10">
      <div className="mb-6 rounded-xl2 border border-stone/25 bg-white/40 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone">
          Diagnosis
        </p>
        <p className="mt-1 font-serif text-lg leading-snug text-ink">
          {result.diagnosis}
        </p>
      </div>

      <article className={`rounded-xl2 border p-6 shadow-card sm:p-8 ${t.card}`}>
        <header className="mb-5 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${t.chip}`}
          >
            {result.format}
            {isCarousel ? ` · ${result.slides.length} slides` : ""}
          </span>
          <h2 className={`font-serif text-xl leading-snug ${t.name}`}>
            {worldName(result.world)}
          </h2>
        </header>

        {result.note && (
          <div className="mb-5">
            <p
              className={`text-xs font-semibold uppercase tracking-wide ${t.label}`}
            >
              Approach
            </p>
            <p className={`mt-0.5 text-sm ${t.body}`}>{result.note}</p>
          </div>
        )}

        <div className="space-y-5">
          {result.slides.map((slide, i) => (
            <div key={i}>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <p
                  className={`text-xs font-semibold uppercase tracking-wide ${t.label}`}
                >
                  {isCarousel ? `Slide ${i + 1}` : "Image prompt"}
                </p>
                <CopyButton text={slide.imagePrompt} className={t.copyBtn} />
              </div>
              <pre
                className={`max-h-80 overflow-auto whitespace-pre-wrap rounded-lg border p-3.5 font-mono text-[12.5px] leading-relaxed ${t.promptBlock}`}
              >
                {slide.imagePrompt}
              </pre>
              <p className={`mt-2 text-sm ${t.body}`}>
                <span
                  className={`font-semibold uppercase tracking-wide text-[11px] ${t.label}`}
                >
                  Text space:{" "}
                </span>
                {slide.textSpace}
              </p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
