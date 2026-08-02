# Bitcoin Crimes — agent & contributor rules

## Product north star

**No false claims.** Every quantitative or legal assertion must be supported by a
citable public source. Prefer court filings and agency releases over news.

## Scope (v1)

- Bitcoin-primary, high-profile cases only
- English, public/research audience
- Curated case files in `src/content/cases/*.mdx`
- Static site (Astro); no live chain scanner; no address-risk tool

## Case shape

See `docs/CASE_TEMPLATE.md` and `docs/BRAND.md`. Body H2 order:

1. What the public record establishes  
2. Technical analysis (when primary sources support it)  
3. Why it matters for Bitcoin history  
4. Reading notes  

See `docs/TECHNICAL_ATTACKS.md` for the technical-analysis index.

## Content rules (enforced by Zod in `src/content.config.ts`)

1. At least one **primary** source (`primary: true`).
2. `confidence: high` requires a primary `court`, `agency`, or `blockchain` source.
3. Every `amounts[]` entry needs `source_id` matching `sources[].id`.
4. USD amounts require `as_of` (YYYY / YYYY-MM / YYYY-MM-DD).
5. Prefer BTC; never invent USD from memory.
6. People `outcome` requires `source_id`.
7. Timeline events should cite `source_ids` for hard facts.
8. Legal status must be honest: charged ≠ convicted.
9. Update `last_reviewed` when materially editing a case.
10. `related[]` is only `{ id, note }[]` — no bare string lists. Ids must exist
    (`pnpm validate:related`). Each note explains *why* the cases link.

## Voice

- Neutral, encyclopedia tone
- “According to [source]”, “pled guilty”, “the jury convicted”
- No unsourced guilt language; no sensational nicknames unless quoting a source
- When only charges exist, keep `legal_status: charged` / `indicted` and state presumption of innocence

## Stack

- Astro + TypeScript + Tailwind CSS 4 + MDX
- React islands only for filters/timeline
- `pnpm dev` / `pnpm verify` / `pnpm build`

## Do not

- Add cases from social media alone
- Publish undated billion-dollar headlines
- Imply law-enforcement affiliation
- Build “is this address criminal?” features in v1
- Claim foreign judgments without that jurisdiction’s primary source
