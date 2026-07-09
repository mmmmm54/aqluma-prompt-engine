import { NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT, buildUserMessage } from "@/lib/prompt";
import { parseGenerateResult } from "@/lib/parse";
import type { ApiResponse, IntakePayload } from "@/lib/types";

export const runtime = "nodejs";

// gpt-4.1-mini is the low-cost default (~5x cheaper than gpt-4.1) and still
// writes rich, art-directed prompts. Swap to "gpt-4.1" or "gpt-5.1" for max
// quality. All use standard params (temperature, max_tokens, JSON mode).
const MODEL = "gpt-4.1-mini";
// Headroom for a 5–7 slide carousel; you're billed on actual tokens used, so a
// single Static prompt stays cheap regardless of this cap.
const MAX_TOKENS = 3500;
const TEMPERATURE = 0.9;
// OpenAI can return transient 429 (rate limit) / 5xx spikes. Retry those a
// couple of times with backoff before surfacing an error to the user.
const MAX_ATTEMPTS = 3;

function badRequest(error: string) {
  return NextResponse.json<ApiResponse>({ ok: false, error }, { status: 400 });
}

function statusOf(err: unknown): number | undefined {
  if (err && typeof err === "object" && "status" in err) {
    const s = (err as { status?: unknown }).status;
    if (typeof s === "number") return s;
  }
  return undefined;
}

function isTransient(err: unknown): boolean {
  const s = statusOf(err);
  return s === 429 || (typeof s === "number" && s >= 500);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json<ApiResponse>(
      {
        ok: false,
        error:
          "Server is missing OPENAI_API_KEY. Add it to .env.local and restart.",
      },
      { status: 500 }
    );
  }

  let body: Partial<IntakePayload>;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid request body.");
  }

  if (!body.content || typeof body.content !== "string" || !body.content.trim()) {
    return badRequest("Please paste some content before generating.");
  }

  const world = body.world ?? "briefing";
  if (!["briefing", "studio", "musee"].includes(world)) {
    return badRequest("Please choose a valid style (world).");
  }
  const format = body.format ?? "Static";
  if (!["Static", "Carousel"].includes(format)) {
    return badRequest("Please choose a valid format.");
  }

  const aiElement = body.aiElement ?? "Auto";
  if (!["Auto", "Always", "None"].includes(aiElement)) {
    return badRequest("Please choose a valid AI-element option.");
  }

  const humanPresence = body.humanPresence ?? "None";
  if (!["Auto", "Always", "None"].includes(humanPresence)) {
    return badRequest("Please choose a valid human-presence option.");
  }

  // Clamp numeric options into safe ranges.
  const slideCount =
    typeof body.slideCount === "number" && body.slideCount >= 3 && body.slideCount <= 10
      ? Math.round(body.slideCount)
      : 0; // 0 = auto
  const variations =
    typeof body.variations === "number" && body.variations >= 1 && body.variations <= 3
      ? Math.round(body.variations)
      : 1;

  const payload: IntakePayload = {
    content: body.content,
    world,
    format,
    aiElement,
    aiElementHint: body.aiElementHint ?? "",
    humanPresence,
    humanPresenceHint: body.humanPresenceHint ?? "",
    platform: body.platform ?? "Both",
    goal: body.goal ?? "Trust",
    audience: body.audience ?? "Both",
    mustInclude: body.mustInclude ?? "",
    textInImage: Boolean(body.textInImage),
    exactWords: body.exactWords ?? "",
    outputFormat: body.outputFormat === "flow" ? "flow" : "brief",
    pastContext: Array.isArray(body.pastContext) ? body.pastContext : undefined,

    // Creative look
    aspectRatio: body.aspectRatio ?? "4:5",
    mood: body.mood ?? "Auto",
    lighting: body.lighting ?? "Auto",
    lensCrop: body.lensCrop ?? "Auto",
    negativeSpace: body.negativeSpace ?? "Auto",

    // Human & casting
    compareMode: Boolean(body.compareMode),
    peopleCount: body.peopleCount ?? "Auto",
    studentGender: body.studentGender ?? "Auto",
    humanEmotion: body.humanEmotion ?? "Auto",
    cropStyle: body.cropStyle ?? "Auto",
    wantPersonas: Boolean(body.wantPersonas),

    // Carousel structure
    slideCount,
    narrativeArc: body.narrativeArc ?? "Auto",
    perSlideNotes: body.perSlideNotes ?? "",

    // Output & targeting
    targetModel: body.targetModel ?? "Nano Banana 2",
    customNegatives: body.customNegatives ?? "",
    variations,
    onImageLanguage: body.onImageLanguage ?? "French",
  };

  const openai = new OpenAI({ apiKey });

  let rawText = "";
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: MODEL,
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
        // Force raw JSON (no markdown fences).
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserMessage(payload) },
        ],
      });

      rawText = (completion.choices[0]?.message?.content ?? "").trim();
      if (!rawText) {
        throw new Error("Empty response from the model.");
      }
      lastError = undefined;
      break;
    } catch (err) {
      lastError = err;
      if (isTransient(err) && attempt < MAX_ATTEMPTS) {
        await sleep(attempt * 1200); // 1.2s, 2.4s backoff
        continue;
      }
      break;
    }
  }

  if (lastError || !rawText) {
    const detail =
      lastError instanceof Error
        ? lastError.message
        : "Unknown error calling the model.";
    const friendly = isTransient(lastError)
      ? "The model is busy right now. Please try again in a moment."
      : `Could not reach the model. ${detail}`;
    return NextResponse.json<ApiResponse>(
      { ok: false, error: friendly },
      { status: 502 }
    );
  }

  try {
    const data = parseGenerateResult(rawText);
    return NextResponse.json<ApiResponse>({ ok: true, data });
  } catch (err) {
    const detail =
      err instanceof Error ? err.message : "Could not parse model output.";
    return NextResponse.json<ApiResponse>(
      { ok: false, error: `${detail} Please try again.` },
      { status: 422 }
    );
  }
}
