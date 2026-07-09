"use client";

interface Option<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

// A pill-style toggle group (Single/Batch, Static/Carousel, Auto/Always/None…).
export default function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = "md",
}: {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel?: string;
  size?: "sm" | "md";
}) {
  const pad = size === "sm" ? "px-3.5 py-1.5 text-sm" : "px-4 py-2";
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap gap-1 rounded-full border border-line bg-panel/50 p-1"
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            title={o.hint}
            className={`rounded-full transition ${pad} ${
              active
                ? "bg-saffron font-medium text-canvas shadow-sm"
                : "text-bone/65 hover:bg-white/5 hover:text-bone"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
