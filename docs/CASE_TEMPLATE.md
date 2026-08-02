# Case file template

One shape for every case. No alternate frontmatter dialects.

## Frontmatter (required fields)

```yaml
---
title: Short proper name
summary: >
  Neutral ≤400 chars. One narrative thread. Legal outcome in plain language.
legal_status: convicted   # see enums in content.config.ts
case_status: closed       # open | closed | partial
categories:
  - dark-market
start_date: 2011-01       # YYYY | YYYY-MM | YYYY-MM-DD
end_date: 2015-05         # optional
confidence: high
last_reviewed: 2026-08-02 # always YYYY-MM-DD when you edit
featured: false           # only curated starters on home
amounts: []               # or list with source_id; USD needs as_of
people: []
timeline: []
related: []               # only { id, note } — note required
sources: []               # ≥1 with primary: true
---
```

## Body H2 (in this order)

1. **What the public record establishes** — facts tied to sources; no spin  
2. **Why it matters for Bitcoin history** — context, not moral essay  
3. **Reading notes** — limits, what we do *not* claim, open threads  

Optional H2 only if needed: **People & entities** is already in UI from frontmatter — do not duplicate long lists in body.

## Rules

- Prefer BTC; every USD has `as_of` + `source_id`
- People `outcome` requires `source_id`
- `related[].note` explains *why* (public-record basis when possible)
- Charged ≠ convicted; pardon ≠ erase conviction (still label **convicted**, document clemency in timeline + people)
- Update `last_reviewed` on every material edit
