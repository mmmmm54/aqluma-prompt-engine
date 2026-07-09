"use client";

import { WORLDS } from "@/lib/types";
import OptionCard from "@/components/ui/OptionCard";
import { SelectField, labelCls } from "@/components/ui/Field";
import {
  AUDIENCES,
  FORMATS,
  GOALS,
  PLATFORMS,
  WORLD_ACCENT,
} from "./options";
import type { StepProps } from "./form";

export default function StepStyle({ form, update }: StepProps) {
  return (
    <div className="space-y-7">
      {/* World */}
      <div>
        <span className={labelCls}>Style (world)</span>
        <div className="grid gap-3 sm:grid-cols-3">
          {WORLDS.map((w) => (
            <OptionCard
              key={w.id}
              title={w.name}
              hint={w.blurb}
              accent={WORLD_ACCENT[w.id]}
              selected={form.world === w.id}
              onClick={() => update("world", w.id)}
            />
          ))}
        </div>
      </div>

      {/* Format */}
      <div>
        <span className={labelCls}>Format</span>
        <div className="grid gap-3 sm:grid-cols-2">
          {FORMATS.map((f) => (
            <OptionCard
              key={f.id}
              title={f.id}
              hint={f.hint}
              selected={form.format === f.id}
              onClick={() => update("format", f.id)}
            />
          ))}
        </div>
      </div>

      {/* Platform / Goal / Audience */}
      <div className="grid gap-5 sm:grid-cols-3">
        <SelectField
          label="Platform"
          value={form.platform}
          options={PLATFORMS}
          onChange={(v) => update("platform", v)}
        />
        <SelectField
          label="Goal"
          value={form.goal}
          options={GOALS}
          onChange={(v) => update("goal", v)}
        />
        <SelectField
          label="Audience"
          value={form.audience}
          options={AUDIENCES}
          onChange={(v) => update("audience", v)}
        />
      </div>
      <p className="text-xs text-stone">
        Audience decides who appears when people are shown: Students → only the teen,
        Parents → only the parent, Both → together.
      </p>
    </div>
  );
}
