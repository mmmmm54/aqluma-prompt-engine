import { NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT_PDF, buildPdfUserMessage } from "@/lib/pdfPrompt";
import { parsePdfGenerateResult } from "@/lib/pdfParse";
import type { PdfApiResponse, PdfIntakePayload, WorldId } from "@/lib/pdfTypes";

export const runtime = "nodejs";

const MODEL = "gpt-4.1-mini";
// 12 pages of layout + typography + color + a full image prompt each needs
// real headroom — this is a much larger response than a single social prompt.
const MAX_TOKENS = 8000;
const TEMPERATURE = 0.8;
const MAX_ATTEMPTS = 3;

const WORLD_HINT_IDS: (WorldId | "auto")[] = ["auto", "briefing", "studio", "musee"];

function badRequest(error: string) {
  return NextResponse.json<PdfApiResponse>({ ok: false, error }, { status: 400 });
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
    return NextResponse.json<PdfApiResponse>(
      {
        ok: false,
        error: "Server is missing OPENAI_API_KEY. Add it to .env.local and restart.",
      },
      { status: 500 }
    );
  }

  let body: Partial<PdfIntakePayload>;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid request body.");
  }

  if (!body.content || typeof body.content !== "string" || !body.content.trim()) {
    return badRequest("Please paste the lead magnet's page-by-page copy before generating.");
  }

  const worldHint = WORLD_HINT_IDS.includes(body.worldHint as WorldId | "auto")
    ? (body.worldHint as WorldId | "auto")
    : "auto";

  const payload: PdfIntakePayload = {
    content: body.content,
    worldHint,
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
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT_PDF },
          { role: "user", content: buildPdfUserMessage(payload) },
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
        await sleep(attempt * 1200);
        continue;
      }
      break;
    }
  }

  if (lastError || !rawText) {
    const detail =
      lastError instanceof Error ? lastError.message : "Unknown error calling the model.";
    const friendly = isTransient(lastError)
      ? "The model is busy right now. Please try again in a moment."
      : `Could not reach the model. ${detail}`;
    return NextResponse.json<PdfApiResponse>({ ok: false, error: friendly }, { status: 502 });
  }

  try {
    const data = parsePdfGenerateResult(rawText);
    return NextResponse.json<PdfApiResponse>({ ok: true, data });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Could not parse model output.";
    return NextResponse.json<PdfApiResponse>(
      { ok: false, error: `${detail} Please try again.` },
      { status: 422 }
    );
  }
}
