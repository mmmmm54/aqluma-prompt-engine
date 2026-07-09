"use client";

import Segmented from "@/components/ui/Segmented";
import { TextArea } from "@/components/ui/Field";
import { batchTopicList, type StepProps } from "./form";

export default function StepContent({ form, update }: StepProps) {
  const topics = batchTopicList(form);
  const overflow =
    form.batchTopics.split("\n").filter((t) => t.trim()).length > 5;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-bone/70">Mode</span>
        <Segmented
          ariaLabel="Mode"
          value={form.isBatch ? "batch" : "single"}
          onChange={(v) => update("isBatch", v === "batch")}
          options={[
            { value: "single", label: "Single", hint: "One post" },
            { value: "batch", label: "Batch / Calendar", hint: "Up to 5 posts" },
          ]}
        />
      </div>

      {form.isBatch ? (
        <div>
          <TextArea
            label={
              <>
                Topics <span className="text-saffron">*</span>
                <span className="ml-2 font-normal text-stone">(one per line · max 5)</span>
              </>
            }
            value={form.batchTopics}
            onChange={(v) => update("batchTopics", v)}
            rows={7}
            placeholder={
              "How to guide your child's ChatGPT use\n" +
              "AI hallucinations explained simply\n" +
              "Creating better prompts step by step\n" +
              "When AI gets it wrong — real examples\n" +
              "5 rules for safe AI use at home"
            }
          />
          {topics.length > 0 && (
            <p className="mt-1.5 text-xs text-stone">
              {topics.length} topic{topics.length !== 1 ? "s" : ""} detected
              {overflow ? " — only the first 5 will be generated" : ""}
            </p>
          )}
        </div>
      ) : (
        <TextArea
          label={
            <>
              Content / script <span className="text-saffron">*</span>
            </>
          }
          value={form.content}
          onChange={(v) => update("content", v)}
          rows={8}
          placeholder="Paste the post, script, or idea you want art-directed…"
        />
      )}
    </div>
  );
}
