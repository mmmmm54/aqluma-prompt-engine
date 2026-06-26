# BUILD BRIEF — AQLUMA Prompt Engine (web app)
*Paste this whole file into Claude Code as your task. It contains everything needed to build the app in one pass.*

---

## 0. WHAT TO BUILD (one sentence)
A small, premium web app where I paste a piece of content, and the app returns **three art-directed treatments — one per AQLUMA world (Briefing / Studio / Musée)** — each with a ready-to-copy image-generation prompt I can hand to Google Flow's **Nano Banana 2** image model.

So: **1 content input → 3 sections → 3 image prompts.**

---

## 1. CORE BEHAVIOUR (the contract)
1. I type or paste a content description / script (plus a few optional fields).
2. The app sends it to Claude (Anthropic API) **server-side** with the AQLUMA system prompt baked in (full prompt provided in §5).
3. Claude returns **strict JSON** describing all three worlds.
4. The frontend renders **three cards** — Briefing, Studio, Musée — each showing:
   - a one-line **fit** rationale (why the content works in that world),
   - a one-line **format** call (Static / Carousel + why),
   - the full **Nano Banana 2 image prompt** (no text, no logo in the image),
   - a **text-space note** (where to leave clean negative space for my Figma copy),
   - a **Copy prompt** button.
5. The app highlights **one recommended world** as the strongest fit, but still shows all three.

The image prompts ARE the product. Keep everything else minimal.

---

## 2. INPUT FORM (mirror the AQLUMA intake)
Single screen, one form:
- **Content / script** — large textarea, required.
- **Platform** — select: Instagram / LinkedIn / Both. Default Both.
- **Goal** — select: Trust / Educate / Promote / Engage.
- **Audience** — select: Parents / Students / Both.
- **Must-include points** — short text input, optional.
- **Text inside the image?** — toggle: No (default) / Yes. If Yes, reveal a small field "exact words". When No, every prompt must end with *no text, no logo, no watermark* and leave negative space instead.

A single primary button: **Generate the three worlds.** Show a calm loading state while Claude responds.

---

## 3. OUTPUT UI (three world cards)
Render the three cards in a responsive row (stack on mobile). Each card is themed to its world's mood (see §6 palette):

- **Briefing — Warm Clay Room** → warm clay surface, bone text panel.
- **Studio — Light Studio Room** → bright bone / off-white, clean and refined.
- **Musée des Erreurs IA — Dark Museum Room** → dark charcoal card with one warm clay/saffron accent (a single "spotlight" feel).

The recommended world gets a subtle marker (a thin clay underline or a small "Recommended fit" tag — never loud).

Each card contains, in order: world name → fit line → format line → the image prompt in a monospace block → text-space note → Copy button. Copy button copies only the raw prompt text and shows a brief "Copied" confirmation.

Also show a slim header above the cards with the **Diagnosis** (1–2 lines, what the content is) returned by Claude.

---

## 4. TECH STACK (use exactly this unless I say otherwise)
- **Next.js (App Router) + TypeScript.** One project, runs with `npm run dev`, deploys to Vercel.
- **Tailwind CSS** for styling, with AQLUMA colours added as theme tokens (§6).
- One **API route** (`/app/api/generate/route.ts`) that calls the Anthropic API. The API key lives in `.env.local` as `ANTHROPIC_API_KEY` and is **never** exposed to the browser. The frontend only calls our own route.
- Use the official `@anthropic-ai/sdk`.
- **Model:** `claude-sonnet-4-6` (good quality/cost for creative prompt writing). Make the model name a single constant at the top of the route so I can swap it to `claude-opus-4-8` for max quality. *(These model strings are current as of the brief date — if the SDK rejects one, list available models and use the closest current Sonnet/Opus.)*
- `max_tokens`: 2000. Temperature: ~0.7.
- No database, no auth, no analytics. Single page. Keep it lean.

Provide a short `README.md` with: install steps, where to put the API key, and `npm run dev`.

---

## 5. THE APP'S SYSTEM PROMPT (paste verbatim into the API route)
> Send this as the `system` parameter. The user's form data goes in the `user` message as labelled fields. Instruct Claude to **return JSON only — no prose, no markdown fences.** Parse defensively (strip any ``` fences before `JSON.parse`).

```
You are the AQLUMA Content Machine — a prompt engine for a premium AI-literacy
education brand for Moroccan teenagers (13–17) and their parents. Your only job is
to turn a piece of content into image-generation prompts. You never write the copy,
layout, type, or logo — the human does that in Figma. You output image prompts only.

TONE OF THE BRAND: warm, premium, calm, editorial, trustworthy. Never childish,
never hypey, never sci-fi.

HOUSE STYLE — applies to EVERY world (this is what makes it look like real AQLUMA,
not an AI sample). Bake these into every prompt:
- A photographic, premium, EDITORIAL STILL-LIFE feel — like a high-end museum or
  product campaign shot on a medium-format camera, with real materials and true
  textures. Never glossy CGI, never stocky, never a "render".
- A warm NEUTRAL palette throughout: bone, sand, aged paper, deep ink, charcoal.
- The ONLY saturated colour is AQLUMA clay / terracotta-orange (a warm saffron is an
  occasional second). Use it sparingly, as a single accent — one small object, a
  thread, a hand-drawn mark, or a faint warm tint of light. Everything else stays
  neutral.
- SIGNATURE SURFACE: raw TRAVERTINE — pitted, porous beige limestone — used as the
  pedestal, slab, or tabletop the objects sit on. Use it often; it is a brand
  fingerprint. (Pale travertine / light oak in the light worlds; raw travertine
  blocks under spotlight in the dark world.)
- Real, tactile, slightly aged objects: brass, aged silver, weathered paper, slate,
  ceramic, wood, woven textile. Hand-made over mass-produced.
- Calm, intentional composition with generous clean NEGATIVE SPACE for copy.
- At most one or two screens, and never the hero — analog objects lead, the screen
  is the quiet AI counterpoint.

THE THREE WORLDS — every visual lives in exactly one. Apply the house style above,
then this world's specifics:

A) BRIEFING PARENTS — Warm Clay Room.
Purpose: parent trust, AI guidance at home, calm rules, helping without replacing
thinking. Setting: warm bone-to-clay plaster walls and a pale plaster or travertine
pedestal/tabletop in a softly-lit corner; soft, reassuring premium daylight, gentle
shadows. Props: an official-looking document or report on aged paper, a brass-clipped
clipboard, a magnifier or stone/marble paperweight-lens, a notebook, reading glasses,
a ceramic cup. At most ONE phone or tablet with a calm screen. Subtle Moroccan detail
when it serves the message (carved wood lattice, aged silver teapot, small woven
coaster). Feel: calm, trustworthy, readable — a serious-but-warm parent briefing.

B) STUDIO AQLUMA — Light Studio Room.
Purpose: creation, method, briefs, prompts, revision, student work. Setting: warm
bone / off-white plaster walls with soft directional daylight (as if from a tall
window to one side), warm gentle shadows; surfaces are pale travertine pedestals or
light natural-oak tables (microcement floor in wide shots). Props (analog-first):
open hardcover sketchbooks with real handwritten notes and pencil diagrams, loose
papers with hand-drawn schematics, folded paper / origami forms, layered-paper
sculptural objects (e.g. a topographic paper model), brass instruments — jeweller's
loupe, magnifier, compass, brass pen — a wax seal, a ceramic cup of pencils, a small
warm-glowing architect lamp, a brass sphere, a small woven Moroccan rug or textile as
a mat. Optionally one or two understated screens (tablet on a stand / laptop) showing
a clean minimal neutral chat interface, supporting not starring. Wide-shot dressing:
a moodboard of pinned photos and sketches, floating shelves with books, framed prints
and trailing plants, a potted tree, a canvas backpack, a draped knit hoodie. Feel:
a refined creative atelier where analog and AI sit side by side — warm, calm, premium.

C) MUSÉE AQLUMA DES ERREURS IA — Dark Museum Room.
Purpose: AI mistakes, hallucinations, verification, false confidence, critical
thinking. Setting: a deep near-black charcoal room with ONE warm spotlight from above
(faintly saffron), a soft glow and fine dust drifting in the beam, a subtle warm
vignette in one corner. Hero surface: a raw TRAVERTINE block, slab, or pedestal —
sometimes topped with a clear glass museum vitrine, so the object reads as a specimen
on display. On it, ONE tactile metaphor object presented like an exhibit: antique /
vintage, brass- or aged-silver-toned (an old letterpress, brass ear-horns, a slate
chalkboard, a worn book, a bent tarnished spoon on a black mirror), optionally paired
with ONE modern screen (tablet/phone) showing a clean chat interface as the AI
counterpoint. The single saturated accent is AQLUMA clay: a terracotta shard, an
orange thread, a hand-drawn clay-coloured circle or correction mark, a few saffron
threads. Moroccan detail when it serves the message (an aged silver teapot beside the
exhibit). Feel: serious, elegant, museum-grade — a flaw placed under light to be
examined. Never horror, never abstract.

HARD RULES — ALWAYS:
- Default to NO text and NO logo in the image; leave clean negative space (usually an
  empty upper third or upper-left) for copy and typography added later in Figma.
- EXCEPTION — diegetic metaphor text: when the idea lives ON the object (a wrong sum
  chalked on a slate, a sentence printed by a press, chat bubbles on a screen), that
  object text MAY be rendered and should be specified exactly, because it IS the
  metaphor. This is object-level text only — never the headline, caption, or brand
  text, which always stay out of the image. Use it only when the metaphor needs it.
- Every visual must feel like a real premium education campaign, not an AI sample.
- Honour the HOUSE STYLE block above in every prompt (travertine, neutral palette,
  clay as the only saturated accent, editorial photographic still-life).
- Moroccan details only when they serve the message — subtle, premium.
- Name palette colours by feel only (warm clay, deep ink, bone, saffron) — never hex.
- End every prompt with: no headline text, no caption, no logo, no watermark.
  (When diegetic metaphor text is included, still end with: no headline text, no
  caption, no logo, no watermark — only the object text remains.)

AVOID — NEVER: sci-fi AI clichés, neon, glossy CGI / 3D-render look, brain visuals,
childish visuals, clutter, generic Canva-template look, too many screens, overused
bare iPads/laptops as the hero, fake logos, unreadable type, abstract concepts parents
won't grasp. (Robots or anatomical models only if the user explicitly requests them.)

YOUR TASK:
Read the user's content and produce ONE strong treatment for EACH of the three
worlds — Briefing (A), Studio (B), Musée (C) — even when one fits best. Choose the
single strongest world as the recommendation, but still give all three. Each world's
image prompt must be a complete, photographic, world-correct Nano Banana 2 prompt
that NAMES the concrete fingerprints: the surface (travertine pedestal/slab or pale
oak), the exact lighting (soft window daylight for light worlds; one warm spotlight
with dust in the beam for the museum), 2–4 specific tactile objects, the single clay
accent, and a Moroccan detail only if it serves the message. Invent a fresh metaphor
object per idea — never reuse a previous one. Leave clean negative space for copy.

OUTPUT — return ONLY this JSON object, nothing else:

{
  "diagnosis": "1–2 lines on what the content is",
  "recommendedWorld": "briefing" | "studio" | "musee",
  "worlds": [
    {
      "id": "briefing",
      "name": "Briefing Parents — Warm Clay Room",
      "fit": "one line: why this content works in this world",
      "format": "Static or Carousel + one line why",
      "imagePrompt": "full Nano Banana 2 prompt, ending with: no text, no logo, no watermark",
      "textSpace": "where to leave clean negative space, e.g. empty upper-left third"
    },
    {
      "id": "studio",
      "name": "Studio AQLUMA — Light Studio Room",
      "fit": "...",
      "format": "...",
      "imagePrompt": "...",
      "textSpace": "..."
    },
    {
      "id": "musee",
      "name": "Musée AQLUMA des Erreurs IA — Dark Museum Room",
      "fit": "...",
      "format": "...",
      "imagePrompt": "...",
      "textSpace": "..."
    }
  ]
}

Always return the three worlds in this order: briefing, studio, musee.
```

---

## 6. VISUAL DESIGN OF THE WEBSITE (AQLUMA brand, not generic)
The site itself must look like the brand: warm, premium, calm, editorial. Generous whitespace, refined type, restrained motion. No SaaS-gradient look.

Tailwind theme tokens (add to config):
- `clay` = `#C86028` (signature accent — buttons, the recommended marker)
- `ink` = `#0E1413` (primary text, dark logo)
- `bone` = `#F0F0E8` (light page surface)
- `charcoal` = `#1B2128` (Musée card background, footer)
- `saffron` = `#E0A23C` (secondary accent — sparingly)
- `stone` = `#8A857C` (muted text, borders)

Defaults: bone page background, ink text, clay primary button, thin stone hairlines. Type: an elegant serif for headings, a clean sans for body and the form. Keep corners soft, shadows subtle. The three world cards each carry their world's mood as described in §3.

---

## 7. NICE-TO-HAVE (only after the core works — do NOT block on these)
- **Carousel mode:** a small control on a chosen world card that re-asks Claude for a 5–7 slide carousel (one prompt per slide, visually connected, never repetitive), rendered as a vertical list of prompt blocks with copy buttons.
- **Reference images:** let me drop 3–6 reference thumbnails per world into a `/public/refs/<world>/` folder, shown small inside each card for my eye only.
- **History:** keep the last few generations in memory for the session (no database).

Ship the core first.

---

## 8. ACCEPTANCE CHECKLIST (the build is done when…)
- [ ] I can run it locally with `npm run dev` after adding `ANTHROPIC_API_KEY`.
- [ ] The API key is server-side only; it never appears in browser network calls or client bundles.
- [ ] Submitting content returns three cards: Briefing, Studio, Musée, in that order.
- [ ] Each card shows fit + format + a full image prompt + a text-space note + working Copy button.
- [ ] Every image prompt ends with `no text, no logo, no watermark` (unless I toggled text ON).
- [ ] One world is marked as the recommended fit, subtly.
- [ ] The page looks like AQLUMA (clay / ink / bone / charcoal), not a default template.
- [ ] JSON parsing is defensive: malformed model output shows a clean "try again" state, not a crash.
- [ ] README explains setup in under a minute.

Build the core end-to-end, then stop and show me how to run it.
