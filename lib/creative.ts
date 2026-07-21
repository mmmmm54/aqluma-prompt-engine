import type { Format, WorldId } from "./types";

// ---------------------------------------------------------------------------
// AQLUMA CREATIVE ENGINE
// ---------------------------------------------------------------------------
// The root cause of "repetitive elements" was that the system prompt handed the
// model a small FIXED menu of hero objects (loh, abacus, compass, hourglass...).
// LLMs anchor hard to listed examples, so they kept reaching for the same props
// — and the anti-repetition only kicked in once localStorage history existed.
//
// This module fixes that at the source: a large, diverse library of creative
// building blocks (metaphor techniques, fresh hero objects, material states,
// camera twists, AI-element variations, wildcard/conceptual objects, and
// Moroccan school-memory deep cuts) plus a sampler that injects a FRESH,
// world-aware "spark kit" into every single generation. Because the blocks
// combine multiplicatively, no two runs get the same nudge — even for identical
// input and even with an empty history. These are INSPIRATION, not a checklist:
// the prompt tells the model to riff on them and invent beyond them.
// ---------------------------------------------------------------------------

// 1) METAPHOR TECHNIQUES — reusable LENSES for inventing a hero object from any
//    idea. Not objects; methods.
export const TECHNIQUES: string[] = [
  "Freeze the idea at its exact tipping point — the instant before the fall, the spill, the snap",
  "Autopsy the idea — object neatly disassembled and laid out in labelled parts",
  "Let wear tell the story — thumb-polish, a worn edge, the groove of ten thousand uses",
  "Show the honest repair — a visible mend, a contrasting stitch, a seam filled with gold or wax",
  "Build a queue or sequence with exactly one deviant member",
  "Record presence by absence — a cast, a mould, an imprint left in soft material",
  "Materialise the invisible — give doubt, time, or a voice a physical residue",
  "Wrong-material substitution — a familiar object rebuilt in an impossible material (a glass notebook, a wax key)",
  "Show the idea mid-translation — the same content in two physical forms, side by side",
  "Obsessive repetition, broken once — fifty identical things and one that isn't",
  "Archive the idea — under a glass dome, in a specimen box, sealed and dated as if precious evidence",
  "Measure the unmeasurable — calipers on a word, a ruler laid against shadow",
  "Open what is normally closed — a cutaway, a cross-section, an interior exposed",
  "Let gravity argue — a lean past reason, a stack past balance, weight hung from a single thread",
  "Tag it like forensic evidence — a numbered label, a string tag, an exhibit card",
  "Opposites touching at exactly one point of contact",
  "Enlarge one element until it becomes the landscape the others live in",
  "The knot or splice — two unlike materials joined, and the join is the subject",
  "Let the shadow disagree — a shadow larger, sharper, or shaped differently than its object",
  "Show the work half-finished, the tools still resting where they were set down",
  "Show only the trace after the event — the ring a cup left, the dust outline, the pressure mark",
  "Age one half of the object fifty years; keep the other half new",
  "Turn the object into a threshold — something to pass through, look through, cross",
  "Present the idea as an offering — laid on folded cloth, centred, ceremonial",
  "Break physics quietly — one page standing rigid, one drop climbing, nothing else strange",
  "Speak through negative space — the cutout, the hole, the missing volume in a full shelf",
  "Stack translucency — the idea legible only when layered sheets align",
  "Interrupt an inventory — sorted piles, and one item that fits no pile",
  "Literalise the abstract word — build the idiom as a real object (\"a gap in the story\" as an actual physical gap left in an otherwise complete row)",
  "Visual pun via material substitution — swap in the exact material the idea is about, so the object becomes the argument (a burnt object for excess heat, a hollow one for missing substance, a seedless one for absence)",
  "Fuse cause with effect in one object — the crack and the force that made it implied by the same shape",
  "Use scale itself as the metaphor — the same object miniaturised or monumentalised until size alone tells the story",
  "Two near-identical objects, one revealed correct by a single visible tell (weight, colour, temperature, wear) the other lacks",
  "Let the object complete or fail an expected pattern — a puzzle, a sequence, a set — as the entire metaphor, no caption needed",
  "Give the idea a temperature — frost, condensation, or heat-warp as the only signal of what happened",
  "Make the invisible audible — a sound-producing object frozen at the exact instant of its sound",
];

// 2) FRESH HERO OBJECTS — educational / knowledge, far beyond the tired list.
export const HERO_EDUCATIONAL: string[] = [
  "a marbled-paper ledger with a silk ribbon trailing off the pedestal",
  "a brass page-turner resting across an open dictionary",
  "a stack of library due-date cards stamped decades apart",
  "a rolled examination scroll tied with cotton string",
  "a bundle of sharpened pencils bound like kindling",
  "a typewriter with a single key raised mid-strike",
  "a galley proof dense with red proofreader's marks",
  "a book press clamping a freshly bound spine",
  "a bone folder resting on a crisply folded paper signature",
  "lead printing type spelling half a word in a compositor's stick",
  "a wooden letter tray of movable type sorted by frequency of use",
  "a knotted memory-cord, each knot a lesson learned",
  "a wooden ruler worn concave from decades of underlining",
  "an ivory slide rule pulled to one exact answer",
  "a small desk globe worn bald at one country from pointing",
  "a take-apart anatomical eye model with the iris removed",
  "a jar of pencil shavings layered like geological sediment",
  "a dip pen resting on a half-blotted signature",
  "a pigeonhole writing desk with one compartment left open",
  "a reading loupe asleep in the gutter of a dictionary",
  "an eraser worn to a wafer, its crumbs swept into one neat line",
  "a stack of exam booklets aligned to the millimetre",
  "a sentence diagrammed in pushpins and red thread on cork",
  "a paper fortune-teller folded from a graded quiz",
  "a hand-drawn map with its legend torn away",
  "a river-worn stone paperweighting a stack of homework",
  "a single wooden printing block of one letter, ink still tacky",
  "a red grading pen lying across a perfect, unmarked page",
  "three dictionaries stacked to child-seat height, seat-worn on top",
  "an overhead-projector transparency curling at the corners, notes in two hands",
  "a filmstrip of handwriting samples held to the light",
  "calligraphy nibs fanned like surgical instruments in a canvas roll",
  "a giant wooden blackboard protractor, arm-length, chalk-dusted",
  "a lesson-plan book with one week left blank",
  "a diploma tube, cap off, the document half-emerged",
  "a ring of vocabulary cards fanned open at the hardest word",
  "a beeswax writing tablet, one line smoothed away for rewriting",
  "a herbarium page — a pressed plant, a careful hand-lettered label",
  "a math exercise corrected in three colours of ink",
  "a crossword abandoned one square from complete",
  "an encyclopaedia set with one volume missing, the gap intact",
  "a portable écritoire opened to reveal ordered compartments",
  "a stack of tracing-paper overlays building a diagram layer by layer",
  "a teacher's pocket watch laid on an exam timetable",
  "a paper aeroplane folded from homework, nose crumpled from landing",
  "a green-shaded study lamp pooling light on a single paragraph",
  "a satchel unbuckled, books caught mid-spill",
  "a bundle of pen-pal letters in two languages, tied crosswise",
  "a cursive alphabet wall chart, one corner curling",
  "a numbered exam-seat card on an empty chair",
  "a library card stamped to its last line",
  "a chalk ledge holding stubs graded from new to nub",
  "a four-leaf clover taped inside a notebook for exam luck",
  "an ink bottle tipped for its last drop",
  "a graphite stick worn to the shape of its owner's grip",
  "a language-lab cassette, tape pulled into one loose curl",
  "a hand-drawn 'memory palace' floor plan, rooms labelled with facts",
  "an oral-exam number token beside its cloth drawstring bag",
  "an answer key sealed in manila with a red string-and-button closure",
  "essay drafts numbered v1 to v7, the top one finally clean",
  "a shorthand notebook, its symbols like a private code",
  "an atlas fallen open at the one well-travelled page, the spine broken exactly there",
];

// 2b) NON-PAPER HERO OBJECTS — deliberately OUTSIDE the stationery/notebook/paper
//    domain, because that domain became this brand's most overused reflex. Spans
//    glass & liquid, textile, food, mechanical/scientific instruments, natural
//    materials, light devices, music, and small precious objects. Just as valid
//    a hero family as the educational list above — sometimes sharper, especially
//    for abstract ideas (verification, bias, doubt, completeness, speed).
export const HERO_NON_PAPER: string[] = [
  "a glass spirit-level vial, its bubble frozen exactly off-centre",
  "a decanter mid-pour, the stream caught as a solid glass thread",
  "a prism splitting one beam of light into a spectrum, one colour band missing",
  "an inkwell of clear water beside one of true ink, both catching the same light",
  "a single ice cube melting on a warm brass tray, the puddle shaped like a question mark",
  "a perfume bottle's glass stopper resting apart from its bottle, scent long gone",
  "a single loose thread pulled from a tightly woven cloth, the weave beginning to gape",
  "an embroidery hoop with the pattern half-finished, needle still through the last stitch",
  "a tailor's measuring tape coiled into a perfect spiral, one end frayed",
  "a patch sewn over a tear, the stitching visible and unapologetic",
  "a knitted swatch that changes gauge halfway, the tension visibly shifting",
  "a spool of thread unspooling in an impossibly taut straight line",
  "a pomegranate split open, seeds spilling in a precise, countable row",
  "a lump of sugar dissolving mid-drop into dark tea, the plume caught mid-swirl",
  "a citrus peeled in one unbroken spiral, resting coiled beside the fruit",
  "salt poured into the exact shape of a fingerprint on dark stone",
  "a loaf of bread torn rather than cut, the crumb structure exposed like a cross-section",
  "a single olive on a fork, oil pooling in a perfect ring beneath it",
  "a vintage barometer needle caught exactly between « clair » and « orage »",
  "a brass sextant aimed at nothing, its mirror catching an empty patch of light",
  "a tuning fork struck and humming, beside one gone silent and bent",
  "iron filings arranged by a hidden magnet into a pattern that shouldn't be possible",
  "a stethoscope resting on a block of stone, listening for a heartbeat that isn't there",
  "a weather vane frozen mid-spin, pointing confidently at the wrong direction",
  "nesting wooden dolls opened in a row, the smallest one missing",
  "a music box with its mechanism exposed, the comb missing one tooth",
  "a single dry leaf pressed under glass, its veins lit from behind",
  "a geode cracked open, one half rough stone and one half crystal light",
  "a river stone split clean by frost, both halves still touching at one edge",
  "a beeswax honeycomb fragment, one cell capped and one left open",
  "a single feather with its barbs deliberately unzipped on one side",
  "a fossil ammonite, its spiral interrupted by one flattened facet",
  "a magic-lantern slide projecting a faded image onto rising smoke",
  "a pinhole camera obscura box, the inverted image visible on its inner wall",
  "a candle behind a paper cutout, the cast shadow telling a different story than the object",
  "a sundial gnomon casting a shadow onto a dial with no markings",
  "a metronome arm frozen at the exact edge of its swing",
  "a single piano key removed from its bed, resting beside the keyboard",
  "a violin string snapped, curling away from the bridge",
  "a phonograph needle lifted just before the run-out groove",
  "a pocket watch case open, both hands stopped at a different time from each other",
  "a signet ring pressed into wax, the impression slightly smudged",
  "a single pearl broken free from its strand, rolling toward the table's edge",
];

// 3) MATERIAL & STATE MODIFIERS — make any object feel fresh via its condition.
export const MODIFIERS: string[] = [
  "rubbed with graphite until it shines like pewter",
  "edge-gilded, the gilding beginning to flake",
  "fire-singed at one corner, precisely and no further",
  "laminated with one air bubble trapped forever",
  "water-stained in concentric tide rings",
  "ironed flat, the ghosts of creases remaining",
  "candle-smoked to sepia at the edges",
  "darned with contrasting thread",
  "swollen from humidity, pages rippled like sand",
  "bleached until the text is a ghost of itself",
  "shellacked to a honey gloss",
  "crazed like old porcelain glaze",
  "dusted with chalk so fine it reads as frost",
  "oxidised to soft verdigris",
  "re-stitched once, in the wrong colour, decades ago",
  "fossil-stiff, as if excavated rather than found",
  "still warm from the photocopier",
  "freshly sharpened, one unbroken shaving still attached",
  "sleeved in archival mylar like a rare document",
  "taped long ago, the tape now amber and brittle",
  "rolled tight so long it holds the memory of the roll",
  "foxed with rust-coloured age spots",
  "embossed blind — letters with no ink, read only by shadow",
  "dew-beaded, as if left out overnight",
  "snapped clean and set back together, the crack still visible",
  "polished mirror-bright on one face, matte on the other",
  "soft with handling, corners rounded like pebbles",
  "ink-saturated until the paper is nearly black",
  "half-erased, the ghost strokes surviving",
  "sun-faded in stripes where the blinds cast their shadow",
  "strapped like a parcel with jute twine and a knot",
  "frozen mid-tear, paper fibres bridging the gap",
];

// 4) COMPOSITION / CAMERA TWISTS — fresh framing beyond flat eye-level.
export const CAMERA_TWISTS: string[] = [
  "worm's-eye from desk level, the object looming like architecture",
  "camera looking straight down the tunnel of a rolled document",
  "mirror-split symmetry with exactly one asymmetry",
  "three objects at three focal planes, only the middle one sharp",
  "one element allowed motion blur, everything else surgically still",
  "the shadow given more frame than the object that casts it",
  "shot down through the trembling surface of shallow water",
  "a dutch tilt so slight it merely unsettles",
  "reflection-only: the hero visible solely in the polished tabletop, the object itself out of frame",
  "true 90° overhead, one hard shadow at 45°",
  "framed through the negative space of another object — a ruler's hanging hole, a lens",
  "the object tiny and centred, the texture of the surface dominating",
  "profile silhouette against a softly lit wall, detail carried by rim light alone",
  "foreground defocus so heavy it becomes a pure colour field",
  "two-thirds of the frame in darkness, the object emerging at the light's edge",
  "macro so close the object becomes abstract topography",
  "an in-camera diptych — object and consequence divided by a hard shadow line",
  "shot at zero degrees along the surface, the tabletop becoming a horizon",
  "keystone view up a tall stack, photographed like a building",
  "caustic light through glass throwing script-like patterns across the scene",
  "a crop that beheads the object, keeping only the telling detail",
  "seen through fogged glass with one wiped-clear circle",
  "the hero 80% wrapped, only a sliver legible",
  "compressed telephoto flatness — objects layered like paper cutouts",
];

// 5) AI-ELEMENT VARIATIONS — fresh, non-repetitive quiet AI counterpoints.
//    On-screen / printed text stays FRENCH (the brand default).
export const AI_VARIATIONS: string[] = [
  "a tiny robot on its back beneath a leaning tower of dictionaries, unbothered",
  "a robot's antenna casting a shadow that points exactly at the hero object's flaw",
  "an e-reader propped like a place card, screen reading « Sources : 0 — Vérifions ensemble. »",
  "a phone face-down, its screen glow leaking out across the cloth",
  "a printed AI transcript slipped into the exam stack, header visible: « Réponse générée — à vérifier »",
  "a receipt-printer curl of AI output spilling off the pedestal, one line circled in pencil",
  "a tablet showing a half-typed French prompt, cursor mid-word: « Explique-moi la photosynthèse comme si j'avais 13 ans »",
  "a robot dusting the hero object with a tiny folded cloth",
  "a robot 'asleep' beside an open notebook, its dot-eye dimmed to a dash",
  "a smartwatch resting on flashcards, screen: « Pause — relis ta réponse »",
  "a pencil-written student question taped above the printed AI reply, red arrows between them",
  "a robot present only as a reflection in the varnish of the desk",
  "three printed AI answers to the same question, two crossed out in grease pencil",
  "an e-ink display bearing a single sentence: « Je peux me tromper. »",
  "a robot on extended tiptoe-legs, straining to see the top of the pedestal",
  "a device cable tied into a neat, loose bow",
  "a tablet displayed under glass like an exhibit, museum label: « Hallucination n°7 »",
  "tiny robot footprints in chalk dust leading toward the hero object, the robot out of frame",
  "a printed AI essay stamped in red by a teacher: « SOURCES ? »",
  "a fabric-grille smart speaker with a paper note taped on: « Demande-lui d'où ça vient »",
  "a robot holding a magnifying glass out toward the viewer, handle first",
  "a laptop open five degrees, a blade of screen-light striping the hero object",
];

// 6) CONCEPTUAL / WILDCARD METAPHOR OBJECTS — bolder, lateral, still physical.
//    Best for abstract ideas (trust, doubt, bias, verification, hallucination).
export const WILDCARD: string[] = [
  "a plumb bob hanging one hair off true vertical — bias",
  "a wax seal that doesn't match the ring beside it — forged authority",
  "a photocopy of a photocopy of a photocopy, each generation fainter — copied knowledge degrading",
  "five relayed handwritten notes, the message mutating line by line — hallucination as a game of telephone",
  "two drawn circles — one fast and wobbly, one slow and true — a stopwatch between them",
  "a sieve holding only what it caught, the fine dust long gone through",
  "a padlock with three keys laid out, only one cut correctly",
  "a mirror angled to show the object's unlabelled back",
  "an anchor-shaped paperweight pinning a single flimsy note",
  "a bridge of stacked books between two tables, sagging at midspan",
  "a rope frayed to one strand, still holding the weight",
  "a domino run with one tile lifted out of the line",
  "iron filings combed into a pattern by a hidden magnet — invisible influence",
  "a die with the same number on every face",
  "a trophy cup whose engraving plate is blank",
  "a megaphone facing a wall",
  "a ladder leaning up into darkness, its top rungs missing",
  "an official-looking rubber stamp with no letters on its face",
  "a jigsaw with one piece from another puzzle forced into place",
  "a metronome set faster than the sheet music demands",
  "one word rubber-stamped across a page, fainter and fainter — an echo made physical",
  "a magnifying glass centred on a blank spot where text should be",
  "a barometer stuck on « beau temps » while rain streaks the window",
  "a signature practised fifty times down a page, only the last one perfect",
  "an ornate award ribbon embroidered with one word: « PEUT-ÊTRE »",
  "a keyhole glowing with light, no door around it",
  "a chain of steel paperclips with a single gold one — one verified fact",
  "a pencil with erasers at both ends and no lead",
  "an X-ray film of a book, showing nothing inside",
  "a folding carpenter's ruler zigzagged into a question mark",
  "a wax fruit among real fruit, betrayed only by its dust",
  "a bell jar over an empty pedestal, label reading « FAIT VÉRIFIÉ »",
];

// 7) MOROCCAN EDUCATIONAL-NOSTALGIA DEEP CUTS — modern-to-vintage Moroccan
//    school reality, never folklore. On-object text stays French.
export const MOROCCAN_DEEP_CUTS: string[] = [
  "a Dauphin ballpoint from the hanout, ink tube visibly half-spent",
  "the blue kraft book covering with its printed label — Nom / Classe / Matière — filled in careful cursive",
  "a copie double à grands carreaux Seyès, folded once for the exam",
  "a cahier de textes with the week's devoirs entered in two colours",
  "the pink buvard, marbled with generations of blotted ink",
  "an effaceur bleu-et-blanc, both caps long lost",
  "a bottle of Tipp-Ex, dried into a white sculpture around its rim",
  "a Bic quatre-couleurs with the green never once used",
  "a checked school tablier, a first name embroidered on the pocket by maman",
  "a carnet de correspondance open to a note marked « à signer »",
  "a bulletin de notes with the moyenne underlined twice in red",
  "a tableau d'honneur certificate in a gilt frame from the photo studio",
  "a cardboard box of Robercolor chalks with one row missing",
  "the blackboard rag, stiff with dried chalk paste",
  "a Velleda ardoise blanche and its nearly-dead marker",
  "the yellow 30 cm plastic ruler, edge nicked from years of tracing",
  "a double-decker trousse, its broken zip pull replaced by a paperclip",
  "a taille-crayon à réservoir, dome clouded with graphite",
  "the blue-and-pink gomme bicolore — the blue end that always tore the page",
  "a green plastic protège-cahier with split corners",
  "a Bescherelle with the « avoir » conjugation page coming loose",
  "an Al Moufid textbook annotated in Arabic and French in the same margin",
  "a liste des fournitures scolaires ticked off in pencil at the papeterie counter",
  "a newspaper page of bac results with one name circled in pen",
  "a convocation à l'examen folded eight times to wallet size",
  "the school's violet ink stamp, slightly rotated as always, beside a sheet of carbon paper still holding the ghost of last year's exam",
];

// --- Sampling helpers --------------------------------------------------------

// Fisher-Yates partial shuffle: return up to n distinct random items from arr.
// Always shuffles (even when n >= length) so a merged pool truly interleaves.
function sample<T>(arr: readonly T[], n: number): T[] {
  const pool = [...arr];
  const count = Math.min(n, pool.length);
  const out: T[] = [];
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(Math.random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
    out.push(pool[i]);
  }
  return out;
}

// How the hero-object pool is weighted per world (see the Fable creative brief:
// Musée favours conceptual/wildcard + dark states; Briefing favours warm,
// domestic, Moroccan-memory objects; Studio favours process objects & tools).
const WORLD_MIX: Record<
  WorldId,
  { educational: number; wildcard: number; moroccan: number; nonPaper: number }
> = {
  briefing: { educational: 2, wildcard: 1, moroccan: 2, nonPaper: 2 },
  studio: { educational: 2, wildcard: 2, moroccan: 1, nonPaper: 3 },
  musee: { educational: 1, wildcard: 3, moroccan: 1, nonPaper: 3 },
};

function bullet(items: string[]): string {
  return items.map((s) => `  • ${s}`).join("\n");
}

// Build a fresh, world-aware "spark kit" to inject into the user message.
// A carousel needs more distinct hero sparks (one direction per slide), so the
// hero pool scales with format. Everything is sampled anew on every call, so
// identical inputs still diverge — this is the core anti-repetition mechanism.
export function buildCreativeSeed(world: WorldId, format: Format): string {
  const mix = WORLD_MIX[world];
  const heroBoost = format === "Carousel" ? 3 : 0;

  const heroSparks = sample([
    ...sample(HERO_EDUCATIONAL, mix.educational + heroBoost),
    ...sample(WILDCARD, mix.wildcard + (heroBoost ? 1 : 0)),
    ...sample(MOROCCAN_DEEP_CUTS, mix.moroccan),
    ...sample(HERO_NON_PAPER, mix.nonPaper + (heroBoost ? 2 : 0)),
  ], 999); // re-shuffle the merged pool so categories interleave

  const techniques = sample(TECHNIQUES, 3);
  const modifiers = sample(MODIFIERS, 2);
  const twists = sample(CAMERA_TWISTS, format === "Carousel" ? 3 : 2);
  const aiVars = sample(AI_VARIATIONS, format === "Carousel" ? 2 : 1);

  return [
    `CREATIVE SPARK KIT (freshly rolled for THIS generation — inspiration, NOT a checklist).`,
    `Use these to break out of the obvious. Do NOT list them all in one image and do NOT`,
    `copy any phrase verbatim: pick what genuinely fits THIS content, riff on it, and`,
    `invent BEYOND it. The hero object must still be earned from the content's one core`,
    `idea (apply the golden test). Every generation you receive a different kit — never`,
    `fall back to loh / abacus / compass / hourglass / plain slate out of habit.`,
    ``,
    `PAPER/NOTEBOOK IS NOT THE DEFAULT: blank paper, notebooks, cahiers, books, and`,
    `magnifying glasses have become this brand's most overused reflex — several of the`,
    `hero sparks below are deliberately from a completely different material world`,
    `(glass, textile, food, mechanical instrument, natural element, light device, music,`,
    `small precious object). Give those genuinely equal weight; across a set of posts,`,
    `a paper/stationery hero should be the exception, not the pattern.`,
    ``,
    `Metaphor techniques to try (a lens for inventing the hero, not an object):`,
    bullet(techniques),
    ``,
    `Hero-object sparks (directions to adapt — for a carousel, let each slide lean on a different one):`,
    bullet(heroSparks),
    ``,
    `Material / state modifiers (age or condition that makes an object feel specific, not generic):`,
    bullet(modifiers),
    ``,
    `Composition / camera twists (avoid flat eye-level; name the angle + lens in the prompt):`,
    bullet(twists),
    ``,
    `AI-element variations (keep it the quiet counterpoint; on-screen/printed text stays French):`,
    bullet(aiVars),
  ].join("\n");
}
