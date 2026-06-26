"use client";

import { useState } from "react";
import {
  WORLDS,
  type AiElement,
  type Audience,
  type Format,
  type Goal,
  type IntakePayload,
  type Platform,
  type WorldId,
} from "@/lib/types";

interface Props {
  loading: boolean;
  onSubmit: (payload: IntakePayload) => void;
}

const PLATFORMS: Platform[] = ["Instagram", "LinkedIn", "Both"];
const GOALS: Goal[] = ["Trust", "Educate", "Promote", "Engage"];
const AUDIENCES: Audience[] = ["Parents", "Students", "Both"];
const FORMATS: { id: Format; hint: string }[] = [
  { id: "Static", hint: "One image prompt" },
  { id: "Carousel", hint: "5–7 connected slides" },
];
const AI_ELEMENTS: { id: AiElement; hint: string }[] = [
  { id: "Auto", hint: "Only when it fits" },
  { id: "Always", hint: "Force one in" },
  { id: "None", hint: "Pure still-life" },
];

const labelCls = "block text-sm font-medium text-ink/80 mb-1.5";
const fieldCls =
  "w-full rounded-lg border border-stone/40 bg-white/70 px-3.5 py-2.5 text-ink " +
  "outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/20 " +
  "placeholder:text-stone/70";

export default function IntakeForm({ loading, onSubmit }: Props) {
  const [content, setContent] = useState("");
  const [world, setWorld] = useState<WorldId>("briefing");
  const [format, setFormat] = useState<Format>("Static");
  const [aiElement, setAiElement] = useState<AiElement>("Auto");
  const [aiElementHint, setAiElementHint] = useState("");
  const [platform, setPlatform] = useState<Platform>("Both");
  const [goal, setGoal] = useState<Goal>("Trust");
  const [audience, setAudience] = useState<Audience>("Both");
  const [mustInclude, setMustInclude] = useState("");
  const [textInImage, setTextInImage] = useState(false);
  const [exactWords, setExactWords] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || loading) return;
    onSubmit({
      content,
      world,
      format,
      aiElement,
      aiElementHint,
      platform,
      goal,
      audience,
      mustInclude,
      textInImage,
      exactWords,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl2 border border-stone/25 bg-white/50 p-6 shadow-card sm:p-8"
    >
      <div className="mb-6">
        <label htmlFor="content" className={labelCls}>
          Content / script <span className="text-clay">*</span>
        </label>
        <textarea
          id="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          placeholder="Paste the post, script, or idea you want art-directed…"
          className={`${fieldCls} resize-y leading-relaxed`}
        />
      </div>

      {/* Primary choices: format + style */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <span className={labelCls}>Format</span>
          <div className="grid grid-cols-2 gap-2">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormat(f.id)}
                aria-pressed={format === f.id}
                className={`rounded-lg border px-3 py-2.5 text-left transition ${
                  format === f.id
                    ? "border-clay bg-clay/10 ring-2 ring-clay/20"
                    : "border-stone/40 bg-white/60 hover:border-stone/60"
                }`}
              >
                <span className="block text-sm font-medium text-ink">
                  {f.id}
                </span>
                <span className="block text-xs text-stone">{f.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="world" className={labelCls}>
            Style (world)
          </label>
          <select
            id="world"
            value={world}
            onChange={(e) => setWorld(e.target.value as WorldId)}
            className={fieldCls}
          >
            {WORLDS.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-stone">
            {WORLDS.find((w) => w.id === world)?.blurb}
          </p>
        </div>
      </div>

      {/* AI element: when to make the technology tangible */}
      <div className="mt-6">
        <span className={labelCls}>AI element</span>
        <div className="grid grid-cols-3 gap-2">
          {AI_ELEMENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAiElement(a.id)}
              aria-pressed={aiElement === a.id}
              className={`rounded-lg border px-3 py-2.5 text-left transition ${
                aiElement === a.id
                  ? "border-clay bg-clay/10 ring-2 ring-clay/20"
                  : "border-stone/40 bg-white/60 hover:border-stone/60"
              }`}
            >
              <span className="block text-sm font-medium text-ink">{a.id}</span>
              <span className="block text-xs text-stone">{a.hint}</span>
            </button>
          ))}
        </div>
        {aiElement !== "None" && (
          <input
            type="text"
            value={aiElementHint}
            onChange={(e) => setAiElementHint(e.target.value)}
            placeholder="Optional: steer it — e.g. ChatGPT chat, error on an iPhone, small robot…"
            className={`${fieldCls} mt-2`}
          />
        )}
        <p className="mt-1.5 text-xs text-stone">
          One tasteful device, on-screen AI mistake, or elegant robot — kept premium,
          never childish sci-fi.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="platform" className={labelCls}>
            Platform
          </label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
            className={fieldCls}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="goal" className={labelCls}>
            Goal
          </label>
          <select
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value as Goal)}
            className={fieldCls}
          >
            {GOALS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="audience" className={labelCls}>
            Audience
          </label>
          <select
            id="audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value as Audience)}
            className={fieldCls}
          >
            {AUDIENCES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="mustInclude" className={labelCls}>
          Must-include points <span className="text-stone">(optional)</span>
        </label>
        <input
          id="mustInclude"
          type="text"
          value={mustInclude}
          onChange={(e) => setMustInclude(e.target.value)}
          placeholder="e.g. a teapot, a single phone, a calm mood…"
          className={fieldCls}
        />
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-stone/30 bg-white/40 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-ink">Text inside the image?</p>
            <p className="text-xs text-stone">
              Default No — prompts leave clean negative space for your Figma copy.
            </p>
          </div>
          <div
            className="flex shrink-0 overflow-hidden rounded-full border border-stone/40 text-sm"
            role="group"
            aria-label="Text inside the image"
          >
            <button
              type="button"
              onClick={() => setTextInImage(false)}
              className={`px-4 py-1.5 transition ${
                !textInImage
                  ? "bg-ink text-bone"
                  : "bg-transparent text-ink/70 hover:bg-ink/5"
              }`}
              aria-pressed={!textInImage}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => setTextInImage(true)}
              className={`px-4 py-1.5 transition ${
                textInImage
                  ? "bg-clay text-white"
                  : "bg-transparent text-ink/70 hover:bg-ink/5"
              }`}
              aria-pressed={textInImage}
            >
              Yes
            </button>
          </div>
        </div>

        {textInImage && (
          <div className="mt-3">
            <label htmlFor="exactWords" className={labelCls}>
              Exact words to place in the image
            </label>
            <input
              id="exactWords"
              type="text"
              value={exactWords}
              onChange={(e) => setExactWords(e.target.value)}
              placeholder="Type the exact words…"
              className={fieldCls}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-clay px-5 py-3 font-medium text-white shadow-sm transition hover:bg-clay/90 focus:outline-none focus:ring-2 focus:ring-clay/40 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Writing your {format.toLowerCase()} prompt…
          </>
        ) : (
          `Generate the ${format.toLowerCase()} prompt`
        )}
      </button>
    </form>
  );
}
