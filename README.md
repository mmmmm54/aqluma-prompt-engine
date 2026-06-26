# AQLUMA Prompt Engine

Paste a piece of content → get **three art-directed image prompts**, one per AQLUMA world
(Briefing / Studio / Musée), each ready to copy into Google Flow's **Nano Banana 2**.

The image prompts are the product. Copy, layout, type, and logo happen in Figma.

## Setup (under a minute)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add your API key.** Copy the example file and paste a real OpenAI key from
   [platform.openai.com/api-keys](https://platform.openai.com/api-keys):
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local`:
   ```
   OPENAI_API_KEY=your-key-here
   ```
   The key is read **server-side only** (in `app/api/generate/route.ts`) and never
   reaches the browser.

3. **Run it**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

## Configuration

- **Model:** set by the `MODEL` constant at the top of `app/api/generate/route.ts`.
  Defaults to `gpt-4.1-mini` (low cost). Swap to `gpt-4.1` or `gpt-5.1` for maximum quality.
- **max_tokens:** 2000. **temperature:** 0.7. Both in the same file.

## How it works

```
app/page.tsx            form + result state
components/IntakeForm    the intake form (content, platform, goal, audience, text toggle)
components/WorldCards    diagnosis header + three themed cards
components/WorldCard     one world: fit · format · image prompt · text space · Copy
app/api/generate/route  server route → OpenAI API → strict JSON
lib/prompt.ts           the AQLUMA system prompt (verbatim) + user-message builder
lib/parse.ts            defensive JSON parse (strips ``` fences, validates shape)
lib/types.ts            shared types
```

If the model ever returns malformed output, the UI shows a calm "try again" state
rather than crashing.

## Deploy

Deploys to Vercel as-is. Add `OPENAI_API_KEY` as an environment variable in the
Vercel project settings.

---

### Note for this machine

Node was installed locally at `~/.local/node` (no admin rights needed). If `node`
isn't found in a new terminal, add it to your PATH:

```bash
export PATH="$HOME/.local/node/bin:$PATH"
```

Add that line to `~/.zshrc` to make it permanent.
