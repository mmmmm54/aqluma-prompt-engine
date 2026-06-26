"use client";

import { useState } from "react";
import IntakeForm from "@/components/IntakeForm";
import ResultView from "@/components/ResultView";
import type { ApiResponse, GenerateResult, IntakePayload } from "@/lib/types";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(payload: IntakePayload) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: ApiResponse = await res.json();
      if (data.ok) {
        setResult(data.data);
      } else {
        setResult(null);
        setError(data.error);
      }
    } catch {
      setResult(null);
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-clay">
          AQLUMA
        </p>
        <h1 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">
          Prompt Engine
        </h1>
        <p className="mt-3 max-w-2xl text-stone">
          Paste a piece of content, pick a format (Static or Carousel) and a
          style (Briefing, Studio, or Musée), and get a ready-to-copy Nano
          Banana 2 image prompt.
        </p>
      </header>

      <IntakeForm loading={loading} onSubmit={handleSubmit} />

      {error && (
        <div
          role="alert"
          className="mt-8 rounded-xl2 border border-clay/30 bg-clay/8 px-5 py-4 text-sm text-ink"
        >
          <p className="font-medium text-clay">Something didn’t come through.</p>
          <p className="mt-1 text-ink/80">{error}</p>
        </div>
      )}

      {result && !loading && <ResultView result={result} />}

      <footer className="mt-16 border-t border-stone/20 pt-6 text-xs text-stone">
        The image prompts are the product. Copy, layout, and logo happen in Figma.
      </footer>
    </main>
  );
}
