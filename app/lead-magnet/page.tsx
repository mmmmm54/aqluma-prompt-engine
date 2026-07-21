"use client";

import { useState } from "react";
import Link from "next/link";
import { TextArea } from "@/components/ui/Field";
import PdfResultView from "@/components/pdf/PdfResultView";
import { WORLD_HINTS } from "@/lib/pdfTypes";
import type { PdfApiResponse, PdfGenerateResult, PdfIntakePayload, WorldId } from "@/lib/pdfTypes";

export default function LeadMagnetPage() {
  const [content, setContent] = useState("");
  const [worldHint, setWorldHint] = useState<WorldId | "auto">("auto");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PdfGenerateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!content.trim()) {
      setError("Paste the lead magnet's page-by-page copy first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload: PdfIntakePayload = { content, worldHint };
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: PdfApiResponse = await res.json();
      if (data.ok) {
        setResult(data.data);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="mb-8">
        <div className="mb-2 flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron">
            AQLUMA
          </p>
          <Link href="/" className="text-xs font-medium text-stone transition hover:text-bone">
            ← Prompt Engine
          </Link>
        </div>
        <h1 className="font-serif text-3xl leading-tight text-bone sm:text-4xl">
          Lead Magnet PDF Designer
        </h1>
        <p className="mt-3 max-w-2xl text-stone">
          Paste one guide&apos;s page-by-page copy (title, texte principal, encadré,
          suggestion visuelle) and get a full page-by-page art-direction brief — layout,
          typography, color, and a ready-to-copy image prompt per page.
        </p>
      </header>

      <div className="space-y-5 rounded-xl2 border border-line bg-panel/40 p-5 sm:p-6">
        <TextArea
          label={
            <>
              Lead magnet copy <span className="text-saffron">*</span>
            </>
          }
          value={content}
          onChange={setContent}
          rows={14}
          placeholder={
            "Page 1 : Couverture\nTitre de la Page : Couverture\nTexte Principal : …\nSuggestion Visuelle : …\n\nPage 2 : …"
          }
          hint="Paste all 12 pages at once, in order — the model returns them in the same order."
        />

        <div>
          <span className="mb-1.5 block text-sm font-medium text-bone/80">AQLUMA world</span>
          <div className="flex flex-wrap gap-2">
            {WORLD_HINTS.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setWorldHint(w.id)}
                title={w.blurb}
                className={`rounded-lg border px-3.5 py-2 text-left text-sm transition ${
                  worldHint === w.id
                    ? "border-saffron/60 bg-saffron/10 text-bone"
                    : "border-line text-stone hover:border-stone hover:text-bone"
                }`}
              >
                {w.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-clay px-5 py-2.5 text-sm font-medium text-canvas transition hover:bg-clay/90 disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-canvas/40 border-t-canvas" />
              Designing the guide…
            </>
          ) : (
            "Design the PDF"
          )}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-8 rounded-xl2 border border-clay/40 bg-clay/10 px-5 py-4 text-sm"
        >
          <p className="font-medium text-clay">Something didn&apos;t come through.</p>
          <p className="mt-1 text-bone/80">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-10">
          <PdfResultView result={result} loading={loading} onRegenerate={generate} />
        </div>
      )}

      <footer className="mt-16 border-t border-line pt-6 text-xs text-stone">
        The design brief is the product. Final typesetting and print happen in Figma.
      </footer>
    </main>
  );
}
