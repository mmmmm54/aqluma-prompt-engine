"use client";

import { useState } from "react";
import type { IntakePayload } from "@/lib/types";
import Stepper from "./Stepper";
import StepContent from "./StepContent";
import StepStyle from "./StepStyle";
import StepOptions from "./StepOptions";
import StepReview from "./StepReview";
import {
  DEFAULT_FORM,
  batchTopicList,
  buildPayloads,
  type Update,
  type WizardForm,
} from "./form";

const STEPS = ["Content", "Style", "Options", "Review"];

interface Props {
  loading: boolean;
  onSubmit: (payload: IntakePayload) => void;
  onBatchSubmit: (payloads: IntakePayload[]) => void;
}

export default function Wizard({ loading, onSubmit, onBatchSubmit }: Props) {
  const [form, setForm] = useState<WizardForm>(DEFAULT_FORM);
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);

  const update: Update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const hasInput = form.isBatch
    ? batchTopicList(form).length > 0
    : form.content.trim().length > 0;

  const isLast = step === STEPS.length - 1;

  function goto(next: number) {
    const clamped = Math.max(0, Math.min(next, STEPS.length - 1));
    setStep(clamped);
    setMaxReached((m) => Math.max(m, clamped));
  }

  function generate() {
    if (loading || !hasInput) return;
    const payloads = buildPayloads(form);
    if (form.isBatch) onBatchSubmit(payloads);
    else onSubmit(payloads[0]);
  }

  function startOver() {
    setForm((prev) => ({ ...prev, content: "", batchTopics: "" }));
    setStep(0);
  }

  return (
    <section className="rounded-xl2 border border-line bg-panel/40 shadow-card">
      {/* Stepper */}
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
        <div className="min-w-0 flex-1">
          <Stepper steps={STEPS} current={step} maxReached={maxReached} onJump={goto} />
        </div>
        {(form.content || form.batchTopics) && (
          <button
            type="button"
            onClick={startOver}
            className="shrink-0 text-xs text-stone transition hover:text-saffron"
          >
            Start over
          </button>
        )}
      </div>

      {/* Active step */}
      <div className="px-5 py-6 sm:px-7 sm:py-8">
        <div key={step} className="animate-fade-in">
          {step === 0 && <StepContent form={form} update={update} />}
          {step === 1 && <StepStyle form={form} update={update} />}
          {step === 2 && <StepOptions form={form} update={update} />}
          {step === 3 && <StepReview form={form} update={update} />}
        </div>
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-4 sm:px-7">
        <button
          type="button"
          onClick={() => goto(step - 1)}
          disabled={step === 0}
          className="rounded-lg px-4 py-2 text-sm font-medium text-bone/70 transition hover:text-bone disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Back
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={generate}
            disabled={loading || !hasInput}
            className="inline-flex items-center gap-2 rounded-lg bg-saffron px-6 py-2.5 font-medium text-canvas shadow-glow transition hover:bg-saffron/90 focus:outline-none focus:ring-2 focus:ring-saffron/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-canvas/40 border-t-canvas" />
                Generating…
              </>
            ) : form.isBatch ? (
              `Generate ${batchTopicList(form).length || ""} prompt${
                batchTopicList(form).length !== 1 ? "s" : ""
              }`
            ) : (
              "Generate prompt"
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => goto(step + 1)}
            disabled={step === 0 && !hasInput}
            className="rounded-lg bg-saffron px-6 py-2.5 font-medium text-canvas transition hover:bg-saffron/90 focus:outline-none focus:ring-2 focus:ring-saffron/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next →
          </button>
        )}
      </div>
    </section>
  );
}
