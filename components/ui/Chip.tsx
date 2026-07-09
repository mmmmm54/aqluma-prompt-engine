"use client";

// A small labelled summary pill used on the Review step.
export default function Chip({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel/60 px-3 py-1 text-xs">
      <span className="text-stone">{label}</span>
      <span className="font-medium text-bone">{value}</span>
    </span>
  );
}
