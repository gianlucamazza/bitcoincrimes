# Bitcoin Crimes

Curated archive of **high-profile, Bitcoin-primary criminal cases** with
historical context and **primary-source citations**.

> **No false claims.** Legal status is always labeled. USD figures are always
> dated. Content that violates source rules fails the build.

Live build target: set `site` in `astro.config.mjs` before deploy.

## Features

- Case files (MDX) with Zod claim-safety schema
- Legal status badges (alleged → convicted, etc.)
- Sourced amounts (BTC preferred; USD requires `as_of`)
- Cross-case timeline and category pages
- Full-text search (Pagefind, post-build)
- RSS (`/rss.xml`), sitemap, JSON-LD
- Methodology and glossary for trust and terminology

## Stack

- Astro 7 (static) + TypeScript
- Tailwind CSS 4
- MDX content collections + Zod
- React islands (filters, timeline)
- Pagefind search index

## Commands

```sh
pnpm install
pnpm dev              # http://localhost:4321
pnpm validate:related # related[] case ids exist
pnpm check            # astro check
pnpm build            # build + Pagefind index → dist/
pnpm preview
pnpm verify            # validate + check + build (CI)
```

## Content

| Path | Role |
|------|------|
| `src/content/cases/*.mdx` | Case files |
| `src/content.config.ts` | Schema + claim rules |
| `AGENTS.md` | Editorial rules for humans/agents |
| `/methodology` | Public methodology page |

### Published cases

1. Silk Road  
2. Bitfinex 2016  
3. Colonial Pipeline ransomware payment  
4. Mt. Gox 2011 theft (U.S. charges)  
5. BTC-e / Alexander Vinnik  
6. Bitcoin Fog  
7. AlphaBay  
8. Helix  

Brand and voice: `docs/BRAND.md`.

### Adding a case

1. Create `src/content/cases/<slug>.mdx` with required frontmatter.
2. At least one **primary** court/agency source for core claims.
3. Every amount needs `source_id`; every USD needs `as_of`.
4. Outcomes for named people need `source_id`.
5. `pnpm verify` must pass.
6. Set `last_reviewed` to the review date (YYYY-MM-DD).

## Deploy

Static output in `dist/`. Suitable for Cloudflare Pages, Netlify, or GitHub Pages.

1. Set `site` in `astro.config.mjs` and `Sitemap` URL in `public/robots.txt`.
2. Build command: `pnpm build`
3. Publish directory: `dist`

## Scope & limits

Not a live threat feed, not legal advice, not comprehensive of all crypto crime.
Not an address-risk lookup tool. See methodology for inclusion rules.

## License

Code: MIT (see `LICENSE`). Case summaries are editorial; linked public records
remain public.
