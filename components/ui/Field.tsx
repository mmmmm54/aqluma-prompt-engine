"use client";

// Shared dark form styling used across every wizard step.
export const labelCls = "block text-sm font-medium text-bone/80 mb-1.5";
export const fieldCls =
  "w-full rounded-lg border border-line bg-panel/60 px-3.5 py-2.5 text-bone " +
  "outline-none transition placeholder:text-stone/60 " +
  "focus:border-saffron/60 focus:ring-2 focus:ring-saffron/15";

// Labelled single-line text input.
export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  optional,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  optional?: boolean;
}) {
  return (
    <div>
      <span className={labelCls}>
        {label}
        {optional && <span className="ml-1 text-stone">(optional)</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={fieldCls}
      />
    </div>
  );
}

// Labelled multi-line textarea.
export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  hint,
}: {
  label: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <span className={labelCls}>{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={`${fieldCls} resize-y leading-relaxed`}
      />
      {hint && <p className="mt-1.5 text-xs text-stone">{hint}</p>}
    </div>
  );
}

// Labelled dropdown built from a list of string options.
export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  optional,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
  optional?: boolean;
}) {
  return (
    <div>
      <span className={labelCls}>
        {label}
        {optional && <span className="ml-1 text-stone">(optional)</span>}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={fieldCls}
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-panel text-bone">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
