"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Wizard from "@/components/wizard/Wizard";
import ResultView from "@/components/ResultView";
import {
  clearHistory,
  exportHistoryJson,
  getRecentMetaphors,
  loadHistory,
  pushHistory,
  rateHistory,
} from "@/lib/history";
import type {
  ApiResponse,
  GenerateResult,
  HistoryEntry,
  IntakePayload,
  Rating,
} from "@/lib/types";

interface ResultEntry {
  id: string;
  result: GenerateResult;
  payload: IntakePayload;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [error, setError] = useState<string | null>(null);
  const [batchProgress, setBatchProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loaded = loadHistory();
    setHistory(loaded);
    // Seed ratings so reopened entries keep their 👍/👎.
    const seeded: Record<string, Rating> = {};
    for (const e of loaded) if (e.rating) seeded[e.id] = e.rating;
    setRatings(seeded);
  }, []);

  // Reopen a past result instantly — no API call, no cost.
  function reopenHistory(entry: HistoryEntry) {
    setError(null);
    setResults([{ id: entry.id, result: entry.result, payload: entry.payload }]);
    requestAnimationFrame(() =>
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  }

  async function callApi(payload: IntakePayload): Promise<ResultEntry | null> {
    try {
      const pastContext = getRecentMetaphors(12);
      const enrichedPayload: IntakePayload = { ...payload, pastContext };
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrichedPayload),
      });
      const data: ApiResponse = await res.json();
      if (data.ok) {
        const id = pushHistory(data.data, payload);
        setHistory(loadHistory());
        return { id, result: data.data, payload };
      } else {
        setError(data.error);
        return null;
      }
    } catch {
      setError("Network error — please try again.");
      return null;
    }
  }

  function scrollToResults() {
    requestAnimationFrame(() =>
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  }

  async function handleSubmit(payload: IntakePayload) {
    setLoading(true);
    setError(null);
    setResults([]);
    const entry = await callApi(payload);
    if (entry) {
      setResults([entry]);
      scrollToResults();
    }
    setLoading(false);
  }

  async function handleBatchSubmit(payloads: IntakePayload[]) {
    setLoading(true);
    setError(null);
    setResults([]);
    setBatchProgress({ current: 0, total: payloads.length });
    const acc: ResultEntry[] = [];
    for (let i = 0; i < payloads.length; i++) {
      setBatchProgress({ current: i + 1, total: payloads.length });
      const entry = await callApi(payloads[i]);
      if (entry) {
        acc.push(entry);
        setResults([...acc]);
      }
    }
    setBatchProgress(null);
    setLoading(false);
    scrollToResults();
  }

  async function handleRegenerate(entry: ResultEntry) {
    setLoading(true);
    setError(null);
    const fresh = await callApi(entry.payload);
    if (fresh) {
      setResults((prev) => prev.map((r) => (r.id === entry.id ? fresh : r)));
    }
    setLoading(false);
  }

  function handleRate(id: string, rating: Rating) {
    rateHistory(id, rating);
    setRatings((prev) => ({ ...prev, [id]: rating }));
    setHistory(loadHistory());
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="mb-8">
        <div className="mb-2 flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron">
            AQLUMA
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/lead-magnet"
              className="text-xs font-medium text-stone transition hover:text-bone"
            >
              Lead Magnet PDF →
            </Link>
            <Link
              href="/calendar"
              className="text-xs font-medium text-stone transition hover:text-bone"
            >
              Content Calendar →
            </Link>
          </div>
        </div>
        <h1 className="font-serif text-3xl leading-tight text-bone sm:text-4xl">
          Prompt Engine
        </h1>
        <p className="mt-3 max-w-2xl text-stone">
          A guided studio for art-directed image prompts. Move through the steps —
          content, style, options — then generate ready-to-copy prompts for your
          image model of choice.
        </p>
      </header>

      <Wizard
        loading={loading}
        onSubmit={handleSubmit}
        onBatchSubmit={handleBatchSubmit}
      />

      {error && (
        <div
          role="alert"
          className="mt-8 rounded-xl2 border border-clay/40 bg-clay/10 px-5 py-4 text-sm"
        >
          <p className="font-medium text-clay">Something didn&apos;t come through.</p>
          <p className="mt-1 text-bone/80">{error}</p>
        </div>
      )}

      {batchProgress && (
        <div className="mt-8 rounded-xl2 border border-line bg-panel/50 px-5 py-4">
          <p className="text-sm text-bone/80">
            Generating{" "}
            <span className="font-medium text-bone">{batchProgress.current}</span> of{" "}
            <span className="font-medium text-bone">{batchProgress.total}</span>…
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-saffron transition-all duration-500"
              style={{
                width: `${(batchProgress.current / batchProgress.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div ref={resultsRef} className="mt-10 space-y-10">
          {results.map((entry) => (
            <ResultView
              key={entry.id}
              result={entry.result}
              historyId={entry.id}
              currentRating={ratings[entry.id]}
              loading={loading}
              onRegenerate={() => handleRegenerate(entry)}
              onRate={handleRate}
            />
          ))}
        </div>
      )}

      {/* History drawer */}
      {history.length > 0 && (
        <div className="mt-16 border-t border-line pt-6">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setShowHistory((v) => !v)}
              className="text-sm font-medium text-stone transition hover:text-bone"
            >
              {showHistory ? "▲" : "▼"} History ({history.length})
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => exportHistoryJson()}
                className="text-xs text-stone transition hover:text-bone"
              >
                Export JSON
              </button>
              <button
                type="button"
                onClick={() => {
                  clearHistory();
                  setHistory([]);
                }}
                className="text-xs text-stone transition hover:text-clay"
              >
                Clear all
              </button>
            </div>
          </div>

          {showHistory && (
            <ul className="mt-4 space-y-2">
              {history.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => reopenHistory(entry)}
                    title="Reopen this result"
                    className="w-full rounded-lg border border-line bg-panel/40 px-4 py-3 text-left transition hover:border-saffron/40 hover:bg-panel/70"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                            entry.result.world === "briefing"
                              ? "bg-clay/20 text-clay"
                              : entry.result.world === "studio"
                                ? "bg-bone/15 text-bone"
                                : "bg-saffron/20 text-saffron"
                          }`}
                        >
                          {entry.result.world}
                        </span>
                        <span className="shrink-0 rounded-full bg-line px-2 py-0.5 text-[10px] font-medium uppercase text-stone">
                          {entry.result.format}
                          {entry.result.slides.length > 1
                            ? ` ·${entry.result.slides.length}`
                            : ""}
                        </span>
                        <span className="truncate text-sm text-bone/70">
                          {entry.result.diagnosis}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 text-xs text-stone">
                        {entry.rating === "up" && <span>👍</span>}
                        {entry.rating === "down" && <span>👎</span>}
                        <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <footer className="mt-16 border-t border-line pt-6 text-xs text-stone">
        The image prompts are the product. Copy, layout, and logo happen in Figma.
      </footer>
    </main>
  );
}
