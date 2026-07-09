"use client";

export type Accent = "clay" | "saffron" | "stone" | "bone";

// Per-accent classes for the selected state (kept explicit so Tailwind keeps them).
const SELECTED: Record<Accent, string> = {
  clay: "border-clay ring-2 ring-clay/25 bg-clay/10",
  saffron: "border-saffron ring-2 ring-saffron/25 bg-saffron/10",
  stone: "border-stone ring-2 ring-stone/25 bg-stone/10",
  bone: "border-bone/70 ring-2 ring-bone/20 bg-bone/5",
};
const DOT: Record<Accent, string> = {
  clay: "bg-clay",
  saffron: "bg-saffron",
  stone: "bg-stone",
  bone: "bg-bone",
};

// A selectable card with a title, optional blurb and accent dot (world/format pickers).
export default function OptionCard({
  title,
  hint,
  selected,
  onClick,
  accent = "saffron",
}: {
  title: string;
  hint?: string;
  selected: boolean;
  onClick: () => void;
  accent?: Accent;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-xl2 border p-4 text-left transition ${
        selected
          ? SELECTED[accent]
          : "border-line bg-panel/40 hover:border-stone/50 hover:bg-panel/70"
      }`}
    >
      <span className="flex items-center gap-2">
        <span className={`h-2 w-2 shrink-0 rounded-full ${DOT[accent]}`} />
        <span className="font-serif text-base leading-snug text-bone">{title}</span>
      </span>
      {hint && <span className="mt-1.5 block text-xs leading-relaxed text-stone">{hint}</span>}
    </button>
  );
}
