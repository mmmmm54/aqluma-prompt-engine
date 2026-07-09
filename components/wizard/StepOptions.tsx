"use client";

import { useState } from "react";
import Segmented from "@/components/ui/Segmented";
import { SelectField, TextField, TextArea, fieldCls, labelCls } from "@/components/ui/Field";
import {
  AI_ELEMENTS,
  ASPECT_RATIOS,
  CROP_STYLES,
  HUMAN_EMOTIONS,
  HUMAN_PRESENCES,
  LENS_CROPS,
  LIGHTINGS,
  MOODS,
  NARRATIVE_ARCS,
  NEGATIVE_SPACES,
  ON_IMAGE_LANGUAGES,
  PEOPLE_COUNTS,
  STUDENT_GENDERS,
  TARGET_MODELS,
} from "./options";
import type { StepProps } from "./form";

// A collapsible titled section that keeps the step scannable.
function Section({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl2 border border-line bg-panel/30">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="text-sm font-medium text-bone">
          {title}
          {subtitle && <span className="ml-2 font-normal text-stone">{subtitle}</span>}
        </span>
        <span className="text-stone">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="border-t border-line/70 px-4 py-5">{children}</div>}
    </div>
  );
}

export default function StepOptions({ form, update }: StepProps) {
  const showCasting = form.humanPresence !== "None";
  const isCarousel = form.format === "Carousel";
  const isStatic = form.format === "Static";

  return (
    <div className="space-y-4">
      {/* Elements */}
      <Section title="Elements" subtitle="AI + humans" defaultOpen>
        <div className="space-y-6">
          <div>
            <span className={labelCls}>AI element</span>
            <Segmented
              value={form.aiElement}
              onChange={(v) => update("aiElement", v)}
              options={AI_ELEMENTS}
            />
            {form.aiElement !== "None" && (
              <input
                type="text"
                value={form.aiElementHint}
                onChange={(e) => update("aiElementHint", e.target.value)}
                placeholder="Optional: steer it — e.g. ChatGPT chat, error on an iPhone, small robot…"
                className={`${fieldCls} mt-2`}
              />
            )}
          </div>

          <div>
            <span className={labelCls}>Human presence</span>
            <Segmented
              value={form.humanPresence}
              onChange={(v) => update("humanPresence", v)}
              options={HUMAN_PRESENCES}
            />
            {form.humanPresence !== "None" && (
              <input
                type="text"
                value={form.humanPresenceHint}
                onChange={(e) => update("humanPresenceHint", e.target.value)}
                placeholder="Optional: steer it — e.g. proud parent + teen, copier vs. thinker side by side…"
                className={`${fieldCls} mt-2`}
              />
            )}
            <p className="mt-1.5 text-xs text-stone">
              Real, photographic high-class Moroccan families (la bourgeoisie) — modern
              dress, genuine emotion, creative angles, never AI-looking.
            </p>
          </div>
        </div>
      </Section>

      {/* Casting */}
      {showCasting && (
        <Section title="Human casting" subtitle="who & how" defaultOpen>
          <label className="mb-4 flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.compareMode}
              onChange={(e) => update("compareMode", e.target.checked)}
              className="h-4 w-4 accent-saffron"
            />
            <span className="text-sm text-bone">
              <span className="font-medium">Copier vs. Thinker</span> — stage the
              comparison (one copies AI blindly, one reasons with method)
            </span>
          </label>
          <label className="mb-4 flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.wantPersonas}
              onChange={(e) => update("wantPersonas", e.target.checked)}
              className="h-4 w-4 accent-saffron"
            />
            <span className="text-sm text-bone">
              <span className="font-medium">Named characters</span> — invent{" "}
              {form.peopleCount === "One"
                ? "1 person"
                : form.peopleCount === "Two"
                  ? "2 people"
                  : "distinct people"}{" "}
              with a fixed look (face, hair, wardrobe) that stays identical across every
              slide
            </span>
          </label>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <SelectField label="People count" value={form.peopleCount} options={PEOPLE_COUNTS} onChange={(v) => update("peopleCount", v)} />
            <SelectField label="Student gender" value={form.studentGender} options={STUDENT_GENDERS} onChange={(v) => update("studentGender", v)} />
            <SelectField label="Emotion" value={form.humanEmotion} options={HUMAN_EMOTIONS} onChange={(v) => update("humanEmotion", v)} />
            <SelectField label="Crop" value={form.cropStyle} options={CROP_STYLES} onChange={(v) => update("cropStyle", v)} />
          </div>
        </Section>
      )}

      {/* Creative look */}
      <Section title="Creative look" subtitle="ratio · mood · light · lens">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <SelectField label="Aspect ratio" value={form.aspectRatio} options={ASPECT_RATIOS} onChange={(v) => update("aspectRatio", v)} />
          <SelectField label="Mood" value={form.mood} options={MOODS} onChange={(v) => update("mood", v)} />
          <SelectField label="Lighting" value={form.lighting} options={LIGHTINGS} onChange={(v) => update("lighting", v)} />
          <SelectField label="Lens / framing" value={form.lensCrop} options={LENS_CROPS} onChange={(v) => update("lensCrop", v)} />
          <SelectField label="Negative space" value={form.negativeSpace} options={NEGATIVE_SPACES} onChange={(v) => update("negativeSpace", v)} />
        </div>
      </Section>

      {/* Carousel structure */}
      {isCarousel && (
        <Section title="Carousel structure" subtitle="slides · arc · notes" defaultOpen>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <span className={labelCls}>Slide count</span>
              <select
                value={form.slideCount}
                onChange={(e) => update("slideCount", Number(e.target.value))}
                className={fieldCls}
              >
                <option value={0} className="bg-panel">Auto (5–7)</option>
                {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n} className="bg-panel">
                    {n} slides
                  </option>
                ))}
              </select>
            </div>
            <SelectField label="Narrative arc" value={form.narrativeArc} options={NARRATIVE_ARCS} onChange={(v) => update("narrativeArc", v)} />
          </div>
          <div className="mt-4">
            <TextArea
              label={
                <>
                  Per-slide notes{" "}
                  <span className="font-normal text-stone">(one per line, optional)</span>
                </>
              }
              value={form.perSlideNotes}
              onChange={(v) => update("perSlideNotes", v)}
              rows={4}
              placeholder={"Slide 1: the hook — a child copying blindly\nSlide 2: the turn — pausing to think\nSlide 3: the method in action…"}
            />
          </div>
        </Section>
      )}

      {/* Output & targeting */}
      <Section title="Output & targeting" subtitle="model · language · variations">
        <div className="mb-5">
          <span className={labelCls}>Prompt style</span>
          <Segmented
            value={form.outputFormat}
            onChange={(v) => update("outputFormat", v)}
            options={[
              { value: "brief", label: "Reading", hint: "Rich prose brief" },
              { value: "flow", label: "Flow-ready", hint: "Keyword syntax" },
            ]}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <SelectField label="Target image model" value={form.targetModel} options={TARGET_MODELS} onChange={(v) => update("targetModel", v)} />
          <SelectField label="On-image text language" value={form.onImageLanguage} options={ON_IMAGE_LANGUAGES} onChange={(v) => update("onImageLanguage", v)} />
          {isStatic && (
            <div>
              <span className={labelCls}>Variations</span>
              <select
                value={form.variations}
                onChange={(e) => update("variations", Number(e.target.value))}
                className={fieldCls}
              >
                {[1, 2, 3].map((n) => (
                  <option key={n} value={n} className="bg-panel">
                    {n} {n === 1 ? "take" : "alternative takes"}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="mt-4">
          <TextField
            label="Custom negatives"
            optional
            value={form.customNegatives}
            onChange={(v) => update("customNegatives", v)}
            placeholder="e.g. no blue tones, no clutter, no crowds…"
          />
        </div>
      </Section>

      {/* Content extras */}
      <Section title="Content extras" subtitle="must-include · reference · overlay text">
        <div className="space-y-4">
          <TextField
            label="Must-include points"
            optional
            value={form.mustInclude}
            onChange={(v) => update("mustInclude", v)}
            placeholder="e.g. a teapot, a single phone, a calm mood…"
          />
          <TextField
            label="Style reference URL"
            optional
            type="url"
            value={form.referenceImageUrl}
            onChange={(v) => update("referenceImageUrl", v)}
            placeholder="Paste an image URL for mood / tonal reference…"
          />
          <div className="rounded-lg border border-line bg-panel/40 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-bone">Text inside the image?</p>
                <p className="text-xs text-stone">
                  Default No — prompts leave clean negative space for your Figma copy.
                </p>
              </div>
              <Segmented
                size="sm"
                ariaLabel="Text inside the image"
                value={form.textInImage ? "yes" : "no"}
                onChange={(v) => update("textInImage", v === "yes")}
                options={[
                  { value: "no", label: "No" },
                  { value: "yes", label: "Yes" },
                ]}
              />
            </div>
            {form.textInImage && (
              <input
                type="text"
                value={form.exactWords}
                onChange={(e) => update("exactWords", e.target.value)}
                placeholder="Type the exact words to place in the image…"
                className={`${fieldCls} mt-3`}
              />
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
