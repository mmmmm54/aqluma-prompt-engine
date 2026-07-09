import type { GenerateResult, HistoryEntry, IntakePayload, Rating } from "./types";

const KEY = "aqluma_history";
const MAX = 20;

function read(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(entries: HistoryEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(entries));
}

export function loadHistory(): HistoryEntry[] {
  return read();
}

export function pushHistory(result: GenerateResult, payload: IntakePayload): string {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  write([{ id, timestamp: Date.now(), result, payload }, ...read()].slice(0, MAX));
  return id;
}

export function rateHistory(id: string, rating: Rating): void {
  write(read().map((e) => (e.id === id ? { ...e, rating } : e)));
}

export function exportHistoryJson(): void {
  const data = JSON.stringify(read(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `aqluma-history-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function clearHistory(): void {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}

// Returns a concise list of recent visual approaches (note + hero summary per slide)
// so the model can avoid repeating the same metaphors and hero objects.
export function getRecentMetaphors(limit = 12): string[] {
  return read()
    .slice(0, limit)
    .map((entry) => {
      const world = entry.result.world;
      const note = entry.result.note ?? entry.result.diagnosis;
      // Extract the first hero object from each slide (first comma-separated segment)
      const heroObjects = entry.result.slides
        .map((s) => s.imagePrompt.split(",")[0].trim())
        .filter(Boolean)
        .join(" → ");
      return `[${world}] ${note} | objects: ${heroObjects}`;
    });
}
