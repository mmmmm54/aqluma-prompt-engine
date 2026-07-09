"use client";

import { worldName } from "@/lib/types";
import Chip from "@/components/ui/Chip";
import { batchTopicList, type StepProps } from "./form";

export default function StepReview({ form }: StepProps) {
  const topics = batchTopicList(form);

  const chips: { label: string; value: string }[] = [
    { label: "Mode", value: form.isBatch ? `Batch · ${topics.length}` : "Single" },
    { label: "World", value: worldName(form.world) },
    { label: "Format", value: form.format },
    { label: "Prompt", value: form.outputFormat === "flow" ? "Flow-ready" : "Reading" },
    { label: "Model", value: form.targetModel },
    { label: "Aspect", value: form.aspectRatio },
    { label: "Platform", value: form.platform },
    { label: "Goal", value: form.goal },
    { label: "Audience", value: form.audience },
    { label: "AI", value: form.aiElement },
    { label: "Humans", value: form.humanPresence },
  ];
  if (form.humanPresence !== "None" && form.compareMode)
    chips.push({ label: "Cast", value: "Copier vs Thinker" });
  if (form.mood !== "Auto") chips.push({ label: "Mood", value: form.mood });
  if (form.lighting !== "Auto") chips.push({ label: "Light", value: form.lighting });
  if (form.lensCrop !== "Auto") chips.push({ label: "Lens", value: form.lensCrop });
  if (form.format === "Carousel" && form.slideCount >= 3)
    chips.push({ label: "Slides", value: String(form.slideCount) });
  if (form.format === "Carousel" && form.narrativeArc !== "Auto")
    chips.push({ label: "Arc", value: form.narrativeArc });
  if (form.format === "Static" && form.variations > 1)
    chips.push({ label: "Variations", value: String(form.variations) });
  if (form.onImageLanguage !== "French")
    chips.push({ label: "Text lang", value: form.onImageLanguage });
  if (form.textInImage && form.exactWords.trim())
    chips.push({ label: "Overlay", value: `“${form.exactWords.trim()}”` });

  const contentPreview = form.isBatch
    ? topics.join("  ·  ")
    : form.content.trim();

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-saffron">
          Your setup
        </p>
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <Chip key={c.label} label={c.label} value={c.value} />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone">
          {form.isBatch ? "Topics" : "Content"}
        </p>
        <div className="max-h-40 overflow-auto rounded-lg border border-line bg-panel/40 px-4 py-3 text-sm leading-relaxed text-bone/80">
          {contentPreview || (
            <span className="text-stone">Nothing entered yet — go back to step 1.</span>
          )}
        </div>
      </div>

      <p className="text-xs text-stone">
        Prompts are the product — copy, layout, and logo happen in Figma.
      </p>
    </div>
  );
}
