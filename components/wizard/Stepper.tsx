"use client";

// Progress header: ① ② ③ ④ with labels. Completed/earlier steps are clickable.
export default function Stepper({
  steps,
  current,
  maxReached,
  onJump,
}: {
  steps: string[];
  current: number;
  maxReached: number;
  onJump: (i: number) => void;
}) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3">
      {steps.map((label, i) => {
        const active = i === current;
        const done = i < current;
        const reachable = i <= maxReached;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
            <button
              type="button"
              disabled={!reachable}
              onClick={() => reachable && onJump(i)}
              className={`group flex min-w-0 items-center gap-2 ${
                reachable ? "cursor-pointer" : "cursor-not-allowed"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition ${
                  active
                    ? "border-saffron bg-saffron text-canvas"
                    : done
                      ? "border-saffron/40 bg-saffron/15 text-saffron"
                      : "border-line bg-panel/50 text-stone"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span
                className={`truncate text-sm transition ${
                  active
                    ? "font-medium text-bone"
                    : reachable
                      ? "text-bone/60 group-hover:text-bone"
                      : "text-stone/60"
                }`}
              >
                {label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <span
                className={`hidden h-px flex-1 sm:block ${
                  done ? "bg-saffron/40" : "bg-line"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
