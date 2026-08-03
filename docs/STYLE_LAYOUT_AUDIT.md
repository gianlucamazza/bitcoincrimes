# Style & layout excellence audit

Full review of every layout, page, component, and the global stylesheet,
checked against `docs/BRAND.md` ("investigative journal" visual tone) and
WCAG 2.1 AA. Each finding cites the file and line it applies to.

Audit date: 2026-08-02. Scope: `src/styles/global.css`, `src/layouts/`,
`src/components/`, `src/pages/`, `public/` metadata assets.

**Implementation status (2026-08-03):** all 27 findings addressed in four
phased commits (P1 rendering/a11y, metadata, P2 dedup, P3 experience).
Deliberate deviations from the proposed fixes:

- Finding 3: the `--color-ink-faint` token itself was lightened to `#827e74`
  (AA) instead of adding a second `ink-dim` token.
- Finding 12: the `ring-paper` halo over the body gradient is accepted as-is
  (documented option in the finding).
- Finding 13: badge definitions exposed via `sr-only` text; homepage copy no
  longer promises hover.
- Finding 14: `datePublished` is omitted entirely — first-publication dates
  are not tracked in frontmatter.
- Finding 25: `input.focus()` on the search page is kept as a conscious
  decision (dedicated search page).

Severity legend:

- **P1** — visible rendering defect, accessibility failure, or broken
  metadata. Fix first.
- **P2** — inconsistency or duplication that erodes polish and
  maintainability.
- **P3** — enhancement; raises the ceiling, nothing is broken.

---

## P1 — Defects and accessibility failures

### 1. `.prose-case` does not style `ol`, `table`, `code`, or `blockquote` — and case bodies use them

`src/styles/global.css:84-111` styles `p`, `h2`, `h3`, `a`, `ul`,
`strong` only. Tailwind's preflight strips list markers, table spacing,
and code styling, so anything else renders broken:

- `bitfinex-2016.mdx:133-144` and `coldcard-rng-2026.mdx:141-166` use
  **ordered lists** → numbers are stripped (`list-style: none` from
  preflight), so "1. … 2. …" sequences render as unnumbered, unindented
  paragraphs.
- `coldcard-rng-2026.mdx:173-188` uses **markdown tables** → no borders,
  no cell padding, no overflow handling on mobile.
- Many cases use **inline code** (`` `ckcc.rng_bytes` ``,
  `` `1CGA4…` ``) → no font-size adjustment, no background, blends into
  body text.

Fix: extend `.prose-case` with `ol` (decimal markers, same spacing as
`ul`), `table`/`th`/`td` (line borders, padding, `overflow-x-auto`
wrapper or `display: block` on mobile), `code` (mono, `text-[0.9em]`,
`bg-paper-sunken`, subtle radius/padding), `blockquote`, and `h4` for
future-proofing.

### 2. Pagefind `<mark>` highlights are unstyled — browser-default yellow on the dark theme

`src/pages/search.astro:83-100` injects Pagefind excerpts, which contain
`<mark>` elements. Nothing styles `mark`, so results show the browser
default: saturated yellow background with black text — the single
loudest element on the site and directly against the "restrained amber"
brand tone. Fix in `global.css`:
`mark { background: var(--color-accent-soft); color: var(--color-ink); }`.

### 3. `--color-ink-faint` fails WCAG AA where it carries meaning

`#6b675e` on `#0f1110` is ≈ 3.4:1 — below the 4.5:1 requirement for
normal-size text. It is used for *meaningful* small text, not
decoration:

- date ranges on every case card (`CaseCard.astro:48`,
  `CaseFilters.tsx:184-189`)
- "Last reviewed" (`CaseCard.astro:61-63`)
- source reference links (`AmountFigure.astro:43-56`,
  `cases/[slug].astro:181-194`)
- filter labels (`CaseFilters.tsx:104-158`), footer legal line
  (`Footer.astro:61`)

Fix: lighten the token to ≈ `#827e74` (≥ 4.5:1) **or** keep the current
value for purely decorative text and introduce a `--color-ink-dim`
(AA-passing) for faint-but-meaningful text. The token approach keeps
the visual hierarchy without failing readers with low vision.

### 4. Serif headings render at an unloaded font weight

`global.css:71-75` sets `font-serif` on `h1–h3` but no `font-weight`.
Tailwind preflight sets headings to `font-weight: inherit` → 400. The
Google Fonts request (`BaseLayout.astro:81`) loads Source Serif 4 only
at **500/600/700**. Result: every heading asks for a weight that was
never loaded, so browsers substitute 500 or synthesize — rendering
varies by browser and the loaded 600/700 weights are never used.
Fix: declare an explicit weight in the base rule (e.g. `font-weight:
600` for the editorial look) and drop unused weights from the font
request.

### 5. Social preview image is an SVG — no platform renders it

`BaseLayout.astro:27,69,75` points `og:image` and `twitter:image` at
`/og.svg`. Facebook, X/Twitter, LinkedIn, Slack, and Discord do **not**
support SVG preview images, and `twitter:card summary_large_image` is
declared — so every share shows a blank card. Fix: export a 1200×630
PNG (or JPG) of the same design, keep the SVG for in-site use if
wanted, and add `og:image:width`/`og:image:height`/`og:image:alt`.

### 6. Active nav link has no `aria-current`

`Header.astro:36-52` computes `isActive()` but expresses it only as a
color change. Screen readers get no indication of the current page.
Add `aria-current={isActive(href) ? 'page' : undefined}` to the link.

### 7. In-page anchors hide under the sticky header

Only source anchors have `scroll-mt-24` (`cases/[slug].astro:285`). The
footer links to `about#corrections` (`Footer.astro:45`), whose `h2`
(`about.astro:59`) has no scroll margin — the target heading lands
underneath the sticky header (h-14/h-16 + border). Fix globally in
`global.css`: `@layer base { [id] { scroll-margin-top: 5rem; } }` and
drop the per-element utilities.

### 8. Related cases display the raw status enum

`cases/[slug].astro:255-257` prints `r.data.legal_status` — readers see
lowercase machine values ("convicted", "unresolved") instead of the
labels used everywhere else. This also violates the BRAND.md rule
against developer vocabulary on public pages. Fix:
`legalStatusLabels[r.data.legal_status as LegalStatus]`, ideally via
`StatusBadge` size="sm" for consistency with cards.

### 9. Source list numbers appear out of order

`cases/[slug].astro:33-37` numbers sources by frontmatter order but
displays them sorted primary-first, so the visible list can read
[3], [1], [4]… Citation anchors still work, but a numbered reference
list that isn't sequential reads as an error in a citation-first
product. Fix: build `sourceIndex` from `sourcesSorted` (primary-first
order) so the rendered list is always [1]…[n] and inline references
stay consistent.

---

## P2 — Consistency and duplication

### 10. The case card exists twice and has drifted

`CaseFilters.tsx:173-208` re-implements `CaseCard.astro` in JSX, and
the copies already disagree: the filtered list (the main `/cases` page)
**omits the case-status badge and the "Last reviewed" line** that cards
show on the homepage and category pages. Supporting duplication:

- `legalTone` map exists in both `StatusBadge.astro:19-28` and
  `CaseFilters.tsx:23-32`.
- `formatLooseDate` from `labels.ts` is re-implemented as `formatRange`
  in `CaseFilters.tsx:34-64` and `formatDate` in
  `TimelineView.tsx:26-53` — three copies of the month table.
- The timeline `sortKey` padding logic is copy-pasted in
  `index.astro:39-45` and `timeline.astro:15-20`.

Fix: import `formatLooseDate` (plain TS, already importable from React)
everywhere; move `legalTone` into `labels.ts`; either render `CaseCard`
markup from one shared source or, minimally, re-align the JSX card to
show the same fields. Extract a `timelineSortKey()` helper into
`labels.ts` or a small `dates.ts`.

### 11. Trailing-slash inconsistency in internal links

`Header.astro:9-13` and `Footer.astro:25-31` link `withBase('/cases')`
(no trailing slash); pages link `withBase('/cases/')`
(`index.astro:88,116`, `categories/[slug].astro:64`, …). On GitHub
Pages the slash-less form costs a redirect, and canonical URLs split
into two variants. Fix: standardize on trailing slash in every
`withBase()` call and set `trailingSlash: 'always'` in
`astro.config.mjs` so the build enforces it.

### 12. Small visual drift between siblings

- Timeline dots: `size-2` on the case page
  (`cases/[slug].astro:165`) vs `size-2.5` on the global timeline
  (`TimelineView.tsx:122`).
- Card grids: `gap-4 sm:gap-5` on homepage/cases vs bare `gap-4` on
  category pages (`categories/[slug].astro:46`).
- 404 buttons (`404.astro:14-31`) lack the hover states their homepage
  twins have (`hover:brightness-110`, `hover:text-accent` —
  `index.astro:87-98`).
- `HowToCite.astro:16` styles its `h2` as a micro-label
  (`text-sm uppercase`) while every sibling section `h2` on the case
  page is `text-2xl` serif — it reads as a different component family.
- Timeline ring color `ring-paper` sits on a body **gradient**
  (`global.css:33-35`), so halos subtly mismatch the background low on
  long pages; prefer a border + `background: inherit` approach or
  accept and document it.

### 13. Status-badge definitions are hover-only

`StatusBadge.astro:36,44` exposes the legal/case-status explanations
via `title` — invisible on touch devices and to keyboard users, yet the
homepage promises "Hover a badge on any case for a short definition"
(`index.astro:147-149`). Fix: link badges to the methodology status
list (`/methodology/#legal-status` with an added id), or add an
`sr-only` span with the help text; reword the homepage copy to
"tap or hover".

### 14. Structured-data semantics

- `cases/[slug].astro:66`: Article `datePublished` is set to the
  *crime's* start date — semantically wrong for schema.org (it means
  editorial publication). Use first-publication date or omit; keep
  `dateModified: last_reviewed`.
- Case pages keep `og:type: website` (`BaseLayout.astro:67`); expose an
  optional `ogType` prop and send `article` for case files.

### 15. Empty-state pattern differs between the two islands

`CaseFilters.tsx:165-169` swaps list ↔ message with a ternary;
`TimelineView.tsx:118-157` always renders the (possibly empty) `<ol>`
and appends the message *below*. Unify on the ternary.

### 16. Icons and touch metadata

`public/favicon.ico` exists but is never linked; on a project-page base
path (`/bitcoincrimes/`) the browser's automatic root-level
`/favicon.ico` request misses it. Add
`<link rel="alternate icon" href={withBase('/favicon.ico')}>` and an
`apple-touch-icon` (180×180 PNG) in `BaseLayout.astro`.

---

## P3 — Enhancements

### 17. Mobile nav is a bare horizontal scroller

`Header.astro:36` relies on `overflow-x-auto` with no affordance that
more items exist. Options, in ascending effort: edge fade-out mask;
shorten labels on mobile; collapse "Methodology"/"About" behind a
"More" item.

### 18. Filter state is not shareable

`CaseFilters.tsx` and `TimelineView.tsx` keep filters in React state
only. Syncing to `URLSearchParams` (on change, `history.replaceState`)
makes filtered views linkable and survives back/forward — cheap and
high-value for a research audience.

### 19. Timeline readability at scale

`TimelineView.tsx` renders one flat list (already ~hundreds of events).
Group by year with a sticky year marker in the gutter; consider
`content-visibility: auto` on entries for cheap render wins.

### 20. Line length on card lists

Cards on `/cases` stretch to `max-w-5xl`; summaries run long. Either a
`lg:grid-cols-2` grid (matches the milestone strip) or capping the list
at `max-w-3xl` improves scanning.

### 21. Wasted `backdrop-blur` on cards

`.card` (`global.css:121-123`) applies `backdrop-blur-sm` to every
card. Over the flat page background the blur is invisible but still
costs compositing on low-end devices — dozens of cards per page. Keep
blur only where there is real content behind it (sticky header) and
make `.card` background opaque.

### 22. Self-host fonts

`BaseLayout.astro:78-83` loads three Google Fonts families
render-blocking from a third party (also a privacy consideration for an
EU-read archive). Self-host via Fontsource/`astro:assets` with
`font-display: swap`, subset to used weights (see finding 4), and
preload the two above-the-fold faces.

### 23. External-link affordance on sources

Source links open in a new tab (`cases/[slug].astro:299-301`) with no
visual indicator. Add a small ↗ affix (`content: '↗'` via a utility
class) so researchers know they are leaving the archive; keep
`rel="noopener noreferrer"`.

### 24. Homepage milestone cards are only partially clickable

`index.astro:203-216`: the year and title are inert; only the small
case link navigates. Make the whole card the link (title as anchor,
stretched-link pattern) as `CaseCard` already does.

### 25. Search results could carry more trust signals

`search.astro:83-100` shows title + excerpt only. Adding the URL path
or the case's status badge (Pagefind custom metadata:
`data-pagefind-meta="status"` on the case header) would echo the
"status labeled" promise inside search. Also note `input.focus()` on
load moves focus for screen-reader users — acceptable on a dedicated
search page, but worth a conscious decision.

### 26. Glossary ordering

`glossary.astro:6-82` lists terms in editorial order. Alphabetize (or
add letter groupings) once the list grows past ~15 entries.

### 27. Page transitions

Astro's `ClientRouter` (view transitions) would give the archive a
calm, dissolve-style navigation consistent with the editorial tone —
optional, low risk on a fully static site.

---

## What is already excellent (keep)

- Token-driven theme in `@theme` — one palette, no hex leakage in
  components; `color-mix` accent-soft is elegant.
- `prefers-reduced-motion` handling, `:focus-visible` outline, skip
  link, `aria-live` result counts, `aria-labelledby` sections,
  `role="note"` disclaimer — a strong a11y baseline overall.
- Loose-date discipline (`formatLooseDate` never invents precision) and
  `tabular-nums` mono for all dates/amounts — exactly the brand.
- Consistent header pattern on list pages (title / lede / compact
  disclaimer) and the restrained badge system.
- `search.astro` no-JS/no-index fallback card.

---

## Remediation plan

Phased so each lands independently; every phase leaves `pnpm verify`
green.

**Fase 1 — Rendering & a11y fixes (P1, ~small)**
`global.css` prose additions (1), `mark` styling (2), ink-faint
contrast token (3), heading weight + font subset (4), `aria-current`
(6), global `scroll-margin-top` (7), related-status label (8), source
renumbering (9).

**Fase 2 — Metadata (P1/P2, ~small)**
PNG og-image + dimensions/alt (5), `ogType` prop (14), `datePublished`
fix (14), favicon/apple-touch links (16).

**Fase 3 — Deduplication (P2, ~medium)**
Shared `formatLooseDate`/`legalTone`/`sortKey` (10), re-aligned card
fields (10), trailing-slash standardization + `trailingSlash: 'always'`
(11), micro-drift cleanup (12), empty-state unification (15), badge
help affordance (13).

**Fase 4 — Experience upgrades (P3, ~medium/large)**
URL-synced filters (18), timeline year grouping (19), card grid /
line-length (20), blur removal (21), self-hosted fonts (22), nav
affordance (17), external-link affix (23), milestone card links (24),
search metadata (25), glossary ordering (26), view transitions (27).
