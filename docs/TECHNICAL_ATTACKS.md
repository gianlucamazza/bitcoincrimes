# Technical attack analyses (index)

This archive documents **crimes and high-profile Bitcoin-primary incidents**.
Where public primary sources allow, case bodies include a **Technical analysis**
section. This file is a maintainer index — not a substitute for case pages.

## Full technical treatment

| Case | Attack class | Primary technical sources |
|------|----------------|---------------------------|
| [Coldcard RNG 2026](../src/content/cases/coldcard-rng-2026.mdx) | Firmware seed entropy / offline key recovery | Coinkite advisory + entropy deep dive + 5.6.1/5.6.2 updates + historical disclosures; Block RNG report; TRM/Galaxy/Bitquery tracker tallies (unofficial); precedent table (Android SecureRandom 2013, Randstorm, Milk Sad, Trust Wallet ext.) |
| [Liquid 2026 peg-out](../src/content/cases/liquid-peg-out-2026.mdx) | Elements range-proof cache key (confidential amounts) | Liquid + SideSwap statements; Elements git (`c26d719`, PR #1592 / #1599); Bitcoin/Liquid explorers; Bitquery reconstruction; mononaut on-chain pair (4050335/4050336) |
| [Bitfinex 2016](../src/content/cases/bitfinex-2016.mdx) | Exchange network compromise + multi-year laundering graph | DOJ plea/sentence; investigative affidavit |
| [Colonial Pipeline](../src/content/cases/colonial-pipeline.mdx) | Ransomware payment + chain analysis seizure | DOJ seizure PR |
| [Mt. Gox 2011 theft charges](../src/content/cases/mt-gox-2011-theft.mdx) | Server-side wallet access (alleged) | SDNY 2023 charging PR |
| [Samourai Wallet](../src/content/cases/samourai-wallet.mdx) | Privacy wallet / mixer as MSB | SDNY charge/plea/sentence |
| [Helix](../src/content/cases/helix.mdx) | Darknet mixer | DOJ/USADC plea/sentence/forfeiture |
| [ChipMixer](../src/content/cases/chipmixer.mdx) | Darknet mixer | DOJ/EDPA 2023 |

## Lighter technical notes (agency-level only)

| Case | Notes |
|------|--------|
| Hydra | Market infrastructure seizure; in-house mixing claimed in AG report |
| Blender/Sinbad | Mixer advertising model; LE takedown of Sinbad infra |
| Bitzlato | High-risk exchange rail for Hydra/ransomware volume |
| Bitcoin Fog | Long-running darknet tumbler; jury conviction |
| Silk Road / SR2 / AlphaBay | Marketplace + Bitcoin payment system design (agency) |

## Rules for technical sections

1. Prefer **vendor security advisories**, **independent engineering write-ups**,
   and **court/agency technical allegations** over Twitter threads.
2. Label **allegations** vs **admitted/convicted** facts.
3. Never invent BTC/USD totals the primary source does not state.
4. Optional H2 order in case bodies: after “What the public record establishes”,
   before “Why it matters” — see `CASE_TEMPLATE.md`.
