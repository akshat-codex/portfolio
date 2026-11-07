---
version: 1
slug: "src-app-jsx"
primary_target: "src/App.jsx"
related_targets: []
---

# Portfolio home (single page)

## Scope and visitor mode

Experience. The whole single-page portfolio (src/App.jsx and every section component). Redesign round 2: the user reviewed the first Swiss build and found it too basic and static and disliked the visible grid. Motion is now the centrepiece. Content, links, CV, Web3Forms contact and photo are kept.

## Audience, job, proof, constraints

Recruiters skim for production proof in seconds; engineers dig into systems depth. Proof on hand: Gravity role, Polluxa SalesTech, Newton-AI (demo video), AI lead-gen repo, academic projects, CGPA 8.97, CV PDF. No metrics, testimonials or screenshots of work products exist; none may be invented. Static Vite/React/Tailwind/Framer Motion on Vercel; must stay fast on phones and honour prefers-reduced-motion.

## Direction contract

THESIS: The portfolio as a live datamatics installation: a backend engineer's work rendered inside a field of streaming data columns and sine lattices, with bold expanded Swiss type cutting through it. Motion is the proof of craft. Refuses the category default of a split hero with glowing gradient blobs, glass cards and a pill cloud, and refuses the static poster of round 1.

OWN-WORLD: Black #0b0b0c field, paper-white ink #f2f1ec, grey #8a8a86, hairline rgba(242,241,236,0.14), one signal orange #ff4d00 for live state, the current role, the cursor and primary actions. A full-screen canvas data field (barcode-like vertical bar columns, monospace-free numeric ticks drawn as bars, travelling sine lattices) in paper at low opacity with occasional orange samples; it reacts to scroll velocity and the cursor and briefly inverts at section boundaries. Type: Archivo variable only, ultra-expanded black weights for display, tabular numerals for data. No visible layout grid lines, no gradients, glows, glass, shadows, rounded pills or icon tiles; square corners; separation by rules and space.

STORY: A short cinematic intro resolves into the hero: the name assembles from scrambled data glyphs and leans toward the cursor. Scrolling, the visitor rides smooth inertial scroll through scroll-scrubbed sections, follows a message through the Polluxa pipeline, sweeps sideways through the project showcase, scans a dense skills index, and leaves by downloading the CV, opening GitHub, or sending a message.

FIRST VIEWPORT: Live data field full-bleed behind everything. Top bar: "AKS" mark left, numbered section links, Download CV in orange. Name enormous in expanded black caps across ~3/4 width, two lines, assembling letter by letter after the intro; greyscale portrait as a hard-edged module at right, with a slow scan line passing over it. Under the name: one-line intro, a ruled Role / Focus / Base data row with an orange "now" marker, Download CV as a magnetic primary button plus GitHub / LinkedIn / Email. A scroll cue that is itself a moving data bar.

FORM: Datamatics Field (dealt challenger ikeda-datamatics, competitive in round 1, adopted by the user in round 2) fused with the Swiss type system kept from the assigned direction. Raises kept: numbered pipeline stations, outcome traced to stack, edge-to-edge skills density, one enormous element per section, tabular measured facts. seed:768bd0334f4b903f

SIGNATURE INTERACTION AND MOTION GRAMMAR: Signatures: (1) the reactive data field background; (2) the kinetic name assembling from scrambled glyphs; (3) the Polluxa pipeline, a pinned scroll-driven sequence where an orange packet travels API → Service → PostgreSQL → Celery → Redis → SMTP/IMAP; (4) a pinned horizontal project showcase. Global: Lenis smooth scroll; custom cursor on fine pointers that morphs over links ("view" label over projects); magnetic primary buttons; scroll-scrubbed reveals (mask-rise, parallax on the portrait, numbers counting once). Easing ease-out-quart; nothing bounces. Reduced motion or coarse pointer: no smooth scroll, no custom cursor, static data field frame, no pinning, all content visible.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
