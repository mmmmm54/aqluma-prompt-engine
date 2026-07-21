// Shared AQLUMA HOUSE STYLE + THE THREE WORLDS block — the single source of
// truth for what makes an AQLUMA image read as AQLUMA, whether it's a social
// post (lib/prompt.ts) or a lead-magnet PDF page (lib/pdfPrompt.ts). Edit here
// once and every engine that imports it stays visually identical.
export const HOUSE_STYLE_AND_WORLDS = `HOUSE STYLE — applies to EVERY world (this is what makes it look like real AQLUMA,
not an AI sample). Bake these into every prompt:
- A photographic, premium, EDITORIAL STILL-LIFE feel — like a high-end museum or
  product campaign shot on a medium-format camera, with real materials and true
  textures. Never glossy CGI, never stocky, never a "render".
- PALETTE BY WORLD — never blend the worlds together:
  • STUDIO and MUSÉE: a warm NEUTRAL palette (bone, sand, aged paper, deep ink,
    charcoal); the ONLY saturated colour is AQLUMA clay / terracotta-orange (a warm
    saffron an occasional second), used SPARINGLY as a single accent — one small
    object, a thread, a hand-drawn mark, or a faint warm tint of light. Everything
    else stays neutral.
  • BRIEFING is the one WARM CLAY world: the background wall IS a DEEPLY SATURATED
    burnt-terracotta / rust-orange matte plaster — rich, full-bodied colour dominating
    the entire frame. Think: the colour of fired clay, Moroccan tadelakt in deep ochre,
    or a sun-baked adobe wall at golden hour. It is NOT a tint, NOT a hint, NOT pale
    beige — it is a STRONG, WARM, SATURATED terracotta that fills the background. The
    surface is the same warm register (raw ochre, warm sandstone, burnt sienna mineral).
    Bright white / off-white / pale beige rooms belong to STUDIO only — never Briefing.
- SIGNATURE SURFACE — different per world, never swap them:
  • BRIEFING: a warm clay mineral surface — raw ochre plaster, warm sandstone, or
    aged terracotta-toned stone. Warm, matte, earthy. Never pale travertine here.
  • STUDIO: a pale travertine or limestone pedestal/plinth — pitted, porous beige,
    light and cool-neutral. Never warm clay here.
  • MUSÉE: a raw dark travertine or aged stone block under a single spotlight.
    The surface reads dark and heavy, not pale, not warm clay.
- Real, tactile, slightly aged objects: brass, aged silver, weathered paper, slate,
  ceramic, wood, woven textile. Hand-made over mass-produced.
- MOROCCAN IDENTITY — expressed through EDUCATIONAL NOSTALGIA, not handicraft:
  This is a Moroccan AI education brand for teenagers and parents. The Moroccan
  identity comes through the memory of learning in Morocco — the objects, textures,
  and atmosphere of Moroccan school culture across generations.

  MOROCCAN EDUCATIONAL NOSTALGIA — ONE valid object language among several, not
  the default reflex. These objects carry BOTH the Moroccan identity AND the
  educational subject at once, and are worth considering — but so are the
  CREATIVE SPARK KIT's non-paper hero objects (glass, textile, food, mechanical
  instruments, natural materials, light devices, music) injected with every
  request. Blank paper, notebooks, cahiers, and old textbooks have become this
  brand's most overused reflex — do not reach for them out of habit just because
  this is an education brand:
  • Loh (لوح) — the traditional wooden writing board from msid / Quranic school,
    white-clay coated, written in soot ink with a reed pen. Iconic Moroccan childhood.
    Perfect metaphor for writing, erasing, re-learning, or overwriting.
  • Qalam + Dawaya — traditional reed pen and ceramic ink pot: the original
    "prompt" tool. Represents authorship, voice, the act of putting thought to surface.
  • Old Moroccan school textbook — worn linen cover, Arabic and French script,
    aged yellowed pages, 1960s–1990s era. Represents fixed knowledge, curriculum,
    the authority of the written word.
  • Vintage school notebook (cahier) — grid or lined paper, handwritten Arabic or
    math, ink smudges from a fountain pen. Represents student work, drafts, revision.
  • Worn leather or woven-cloth school bag (محفظة) — the morning school run,
    the weight of books, childhood memory of learning. Nostalgia made physical.
  • Traditional Arabic calligraphy tools — brass or clay inkwell, split reed pen,
    fine aged paper rolled or folded. Represents language, precision, cultural script.
  • Aged wooden ruler (مسطرة) or geometry compass — method, precision, structure.
  • Abacus (معداد) — tactile pre-digital computation; rows of worn beads on wire.
  • Old folded paper map or worn globe — the world, geography, knowledge of place.
  • Chalk on dark aged slate — classroom correction, the mistake that gets erased,
    a sum crossed out, a word rewritten. Strong metaphor for AI errors and revision.
  • Old report card or exam paper — a teacher's red mark, a grade, a verdict.
    Represents evaluation, judgment, the fear of being wrong.
  • Stacked old textbooks — the foundation of knowledge, the weight of what came before.
  • Small brass hand-bell — the school bell, the start and end of learning time.

  These objects are NOT folkloric. They are the lived, universal memory of Moroccan
  school life — immediately recognised by every Moroccan parent and teenager.
  Use one as the HERO when it genuinely wins the golden test for THIS idea — not
  as a default choice made before considering the alternatives.

  NON-EDUCATIONAL / NON-PAPER PROPS (glass, textile, food, mechanical instrument,
  natural material, light device, music object): fully valid as the HERO too,
  whenever they embody the concept better than a school object would — which is
  often, especially for abstract ideas (trust, doubt, bias, verification, speed).
  Reserve them as secondary/accent only when a Moroccan educational object already
  won the golden test outright. One generic artisan prop per image max either way.

  NEVER: zellige tile panels, decorative teapots, souk displays, silver trays,
  folkloric patterns, pottery as hero, anything that reads "craft market" not "school".
- Calm, intentional composition with generous clean NEGATIVE SPACE for copy.
- At most one or two screens, and never the hero — analog objects lead, the screen
  is the quiet AI counterpoint.

THE THREE WORLDS — every visual lives in exactly one. Apply the house style above,
then this world's specifics:

A) BRIEFING PARENTS — Warm Clay Room.
Purpose: parent trust, AI guidance at home, calm rules, helping without replacing
thinking.
COLOUR IS THE FIRST RULE HERE: the background wall must be a DEEPLY SATURATED
burnt-terracotta / rust-orange matte plaster — the colour of fired Moroccan clay,
tadelakt in deep ochre, or a sun-baked adobe wall. Rich, warm, full-bodied. NOT pale,
NOT beige, NOT off-white. When writing the prompt, name this colour explicitly and
forcefully: "deeply saturated burnt-terracotta matte plaster wall", "rich rust-orange
clay wall", "warm fired-clay adobe background" — so the image model renders it strong.
Setting: golden afternoon daylight from a low side angle, casting long warm shadows
that deepen the terracotta tone. Surface: raw ochre plaster ledge, warm sandstone slab,
or burnt-sienna mineral tabletop — same warm register as the wall, never pale.
The ENTIRE frame should feel warm, grounded, clay-toned — never white, never cool,
never a pale editorial studio. If the whole image doesn't read as a warm terracotta
room at a glance, the colour direction is wrong.
Props: lead with an EDUCATIONAL object that a Moroccan parent would recognise from
their child's school life — an old textbook open on a page, a worn school notebook,
a stacked set of cahiers, a child's geometry compass on aged paper, an abacus, a
report card face-down. Pair with a parental object: a cup of atay on a clay saucer,
an aged document, a brass-clipped folder. At most ONE phone or tablet with a calm
screen — never the hero. Moroccan educational nostalgia is the emotional register:
the objects that a parent remembers from their own school days, now in a new AI era.
Feel: calm, trustworthy, premium — a serious parent-and-child briefing room,
unmistakably warm clay from wall to surface, school memory in every prop.

B) STUDIO AQLUMA — Light Studio Room.
Purpose: creation, method, briefs, prompts, revision, student work.

ENVIRONMENT — the established AQLUMA Studio look, do not deviate:
A premium warm-neutral editorial still-life scene. Light, calm, refined, educational.
- PALETTE: warm off-white / bone / cream. NOT pure white, NOT cold white, NOT clinical,
  NOT a sterile empty room, NOT a flat product mockup background. The walls have subtle
  plaster texture and gentle warm shadows — they feel like an aged atelier, not a cube.
- LIGHT: soft warm daylight from a tall window to one side. Directional, never flat,
  never cool. Gentle shadows that add depth and warmth without drama.
- BACKGROUND: always warm, textured, softly lit. Large clean negative space in the
  upper area left clear for typography — never fill the whole frame with objects.

SIGNATURE SURFACE — pale stone pedestal / plinth (always the base):
A single monolithic pale travertine or limestone block, centered or slightly
lower-centered in the frame, front-facing, sculptural. Hero objects sit naturally ON
TOP of the block. Keep the scene clean and spacious — do not overcrowd the pedestal.
NOT a desk, NOT a wide tabletop spread, NOT a lifestyle workspace scene. Reserve a
desk composition ONLY if the content explicitly requires it.

NARRATIVE LOGIC — every object must mean something:
Before choosing any prop, ask: "what does this represent from the content?" A viewer
should understand the concept from the image alone, without reading any text.
- HERO object = the central idea of the content (invent a fresh specific metaphor)
- SECONDARY object = a related step, contrast, or consequence from the content
- AI ELEMENT = ALWAYS PRESENT — the technology side of the story (see below)
Do NOT place objects because they look premium. Every object earns its place.

AI PRESENCE — MANDATORY in every image, varied across posts:
Every image MUST include a visible AI element. It is never optional. Rotate forms so
no two consecutive posts use the same AI element type:

FORM 1 — FRIENDLY ROBOT COMPANION (use regularly, not just occasionally):
A small, charming AI robot figure — simple, premium, crafted-object quality.
NOT sci-fi, NOT threatening, NOT a detailed mechanical machine.
Design: round or softly geometric head, two gentle LED-dot or circle eyes, a soft
curved smile line — minimal, expressive, immediately friendly. Matte finish in warm
white, bone, or soft grey. Small scale — desk-companion size, like a premium art
object. Think: a well-designed educational mascot made physical, something a 14-year-
old Moroccan student would find cool and approachable. Place it ON the pedestal
alongside the hero educational object — they are equals, a dialogue between old
learning tools and new AI. Vary the robot's pose subtly: facing the viewer, turned
slightly, or "looking at" the hero object.

FORM 2 — DEVICE (laptop, iPad, iPhone, tablet):
A real, premium, clean device showing an AI interface on screen:
- A chat assistant conversation with a friendly avatar bubble
- A prompt being typed, mid-sentence
- An AI-generated answer or draft displayed clearly
- For Musée: a clearly WRONG AI answer highlighted on screen
Device sits ON the pedestal, screen visible and readable (not blurred, not angled away).
Use a MacBook, a clean iPad Pro, or an iPhone — premium feel, not generic.

FORM 3 — PRINTED AI OUTPUT (physical):
A printed sheet, card, or folded paper showing AI-generated text — placed as an object.
The text on it can be partially readable: a short generated sentence, a bullet list,
a chat export. This makes AI tangible without a screen.

CAROUSEL RULE: vary the AI form across slides — robot on one slide, iPad on another,
printed output on another. Never the same form twice in a row.
The AI element and the educational hero share the pedestal as equals.

PROPS — educational objects first, vary every post:
The HERO object must feel EDUCATIONAL before it feels artisanal. Before choosing
any prop, ask: "does this immediately say 'learning', 'school', or 'knowledge'?"

EDUCATIONAL OBJECTS — default hero candidates (rotate, never repeat the same type):
- Writing / inscription: loh (wooden msid board), reed qalam on aged paper, chalk
  on slate, fountain pen on a school notebook, worn pencil, calligraphy inkwell
- Moroccan school memory: old Moroccan textbook (worn cover, Arabic script), vintage
  cahier, aged report card or exam with red marks, small leather school bag
- Instruments of method: wooden ruler, geometry compass open on a draft, abacus with
  worn beads, small brass protractor, spirit level
- Knowledge & world: folded vintage map, old globe segment, stack of worn textbooks,
  rolled parchment, film slide or contact sheet
- Classroom atmosphere: small school bell, chalk dust on dark stone, an erased slate
- Concept-driven (when the idea truly earns it): small hourglass, broken compass still
  pointing wrong, a scale with mismatched weights, a folded letter

SECONDARY / ACCENT only — never the hero:
- Thin strip of natural undyed textile as a base layer
- One small brass or copper detail (a book clasp, a pen ring, a small bowl)
- A single geometric module or stone fragment in the background

Subtle Moroccan detail when it serves the message — always educational, never folkloric.
Never reading glasses / spectacles. No decorative clay accent unless it genuinely
serves the concept — do not force it as decoration.
Feel: warm Moroccan school-memory atelier. Premium, meaningful, educational + AI first.

C) MUSÉE AQLUMA DES ERREURS IA — Dark Museum Room.
Purpose: AI mistakes, hallucinations, verification, false confidence, critical
thinking.
ENVIRONMENT — must read immediately as DARK MUSEUM, nothing else:
- Background: TRUE INK-BLACK or near-black. Not charcoal, not brown, not dark grey —
  deep black that recedes completely. The room is not visible; only the lit zone exists.
- Lighting: LOW-KEY, NARROW, CONTROLLED. ONE warm spotlight beam from directly above
  or slightly angled — narrow cone, hard-edged falloff. More shadow than light.
  The light reveals the OBJECT ONLY; the rest of the frame stays dark. Subtle fine
  dust particles floating in the beam (fine, not smoky). A faint warm saffron tint to
  the light only — never an orange glow filling the room.
- Negative space: the dark areas around the object ARE the negative space — deep, black,
  quiet. Do NOT lift the exposure to create a readable environment; keep it dark.
- NEVER: visible brown walls, medium-bright environment, soft all-over lighting,
  studio-style readability across the whole frame, bright neutral background, anything
  that reads halfway between Studio and Briefing.
SURFACE: a raw travertine or aged stone block / pedestal in the lower center of the
frame — isolated under the spotlight like a museum artifact. Sometimes topped with a
clear glass vitrine so the object reads as a specimen on display.
OBJECT / HERO COMPOSITION — vary every time, earn the metaphor from the concept:
Antique / vintage EDUCATIONAL objects are ONE strong option for the primary exhibit
— aged, slightly broken or tarnished, placed as a specimen under the spotlight —
but the CREATIVE SPARK KIT's non-paper and wildcard objects (glass, mechanical
instruments, natural materials, light devices) are equally valid exhibits and
often sharper for abstract ideas like doubt, bias, or incompleteness. Do not
default to "old exam paper" or "worn notebook" out of habit. Educational objects
below evoke the history of learning, knowledge, and the classroom when they earn it:
  • A cracked geometry compass still frozen open — precision gone wrong
  • A loh (wooden msid board) with half-erased soot script — knowledge impermanent
  • An old Moroccan textbook, pages splayed open at the wrong answer
  • A tarnished brass abacus with misaligned beads — calculation error
  • An aged exam paper with a bold red wrong mark, folded under glass
  • A broken hourglass with sand frozen mid-fall — AI speed vs. accuracy
  • An old scale with mismatched weights — AI bias, unequal judgment
  • A cracked slate with a half-erased equation — the mistake displayed
  • A worn school notebook, open to a page of corrections and crossed-out lines
  • A bent or split reed qalam, next to a blot of spilled ink — failed output
Choose based on the concept, never from a fixed list, and never reflexively.
TYPOGRAPHIC OBJECTS — banned as a default: do NOT use an oversized word block,
letterpress type sculpture, or text-as-hero-object as the repeated Musée solution.
A letterpress or chalked word may appear ONLY when the specific concept truly requires
it, and not more than occasionally across sessions.
AI DEVICE — variable hierarchy, not always background:
The AI screen (tablet, phone, laptop) does NOT have to be dim, blurred, or distant.
Based on the concept, the device may be:
- FOREGROUND / CO-HERO: the screen sits ON the pedestal, large, in focus, its interface
  clearly readable — when AI itself is the subject being examined (hallucination,
  overconfidence, a specific AI output). In this case the antique object and the screen
  share the spotlight as a duality.
- MIDGROUND / EQUAL: side by side with the antique object at similar scale, both under
  the beam, creating a direct visual confrontation between old and new.
- BACKGROUND / SECONDARY (traditional): small, softly out of focus, barely visible —
  only when the antique metaphor object is strong enough to carry the concept alone.
Choose the device hierarchy based on how central AI is to this specific content. If the
post is about an AI mistake, the AI screen deserves to be seen clearly, not hidden.
ACCENT: AQLUMA clay / terracotta as ONE small restrained mark only — a shard, a
thread, a hand-drawn correction circle, a faint saffron thread. Never let it dominate
or warm the whole scene. The room must never feel like Briefing's clay environment.
Moroccan detail only when it serves the message and stays subordinate (an aged silver
tiny detail at the very edge of the beam, almost in shadow — never a focal point).
Feel: cinematic, contemplative, museum-grade. A flaw or a tension placed under
controlled light to be examined. Never horror, never abstract, never bright.`;
