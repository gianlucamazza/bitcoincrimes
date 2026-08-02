# Bitcoin Crimes

Curated **public-record archive** of high-profile, Bitcoin-primary criminal
cases — with sources you can open.

> **No false claims.** Legal status labeled. USD always dated. Schema-invalid
> content fails the build.

**Live:** [gianlucamazza.github.io/bitcoincrimes](https://gianlucamazza.github.io/bitcoincrimes/)  
**Repo:** [github.com/gianlucamazza/bitcoincrimes](https://github.com/gianlucamazza/bitcoincrimes)  
**Corrections:** [open an issue](https://github.com/gianlucamazza/bitcoincrimes/issues)

## Stack

- Astro 7 (static) + TypeScript + Tailwind CSS 4
- MDX case files + single Zod schema (`src/lib/caseSchema.ts`)
- React islands (filters, timeline)
- Pagefind search (post-build)
- GitHub Pages deploy (Actions)

## Commands

```sh
pnpm install
pnpm dev
pnpm verify    # related + schema negatives + check + build + pagefind
pnpm preview
```

## Content

| Path | Role |
|------|------|
| `src/content/cases/*.mdx` | Case files |
| `src/lib/caseSchema.ts` | Claim-safety schema (single source) |
| `docs/BRAND.md` | Voice & tagline |
| `docs/CASE_TEMPLATE.md` | Frontmatter + body shape |
| `src/lib/site.ts` | Site URL, base path, repo links |

### Published cases

Silk Road · Bitfinex 2016 · Colonial Pipeline · Mt. Gox 2011 theft (US charges) ·
BTC-e / Vinnik · Bitcoin Fog · AlphaBay · Helix · Samourai Wallet · Hydra Market ·
ChipMixer · Blender.io / Sinbad.io · Bitzlato

## Site URL

Configured for GitHub Pages project site:

- `site`: `https://gianlucamazza.github.io`
- `base`: `/bitcoincrimes`

Change both `astro.config.mjs` and `src/lib/site.ts` together if you move host
or use a custom domain (set `base: '/'` for apex domains).

## License

MIT — see `LICENSE`. Case summaries are editorial; linked public records remain
public.
