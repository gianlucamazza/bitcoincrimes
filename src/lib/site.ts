/**
 * Canonical site identity. Keep in sync with astro.config.mjs `site` + `base`.
 * GitHub Pages project site under gianlucamazza/bitcoincrimes.
 */
export const SITE_ORIGIN = 'https://gianlucamazza.github.io';
export const SITE_BASE_PATH = '/bitcoincrimes';
export const SITE_URL = `${SITE_ORIGIN}${SITE_BASE_PATH}`;
export const REPO_URL = 'https://github.com/gianlucamazza/bitcoincrimes';
export const REPO_ISSUES_URL = `${REPO_URL}/issues`;

export const BRAND_META = {
  description:
    "Bitcoin’s criminal history, with sources you can open. Public-record case files. Status labeled. Dollars dated.",
} as const;

/**
 * Prefix a site-absolute path with Astro base (handles GH Pages subpath).
 * Pass paths like `/cases` or `cases/foo` or `/`.
 */
export function withBase(path = '/'): string {
  const base = import.meta.env.BASE_URL || `${SITE_BASE_PATH}/`;
  if (path === '/' || path === '') return base;
  const clean = path.replace(/^\//, '');
  return `${base}${clean}`;
}

/** Absolute https URL for a path (canonical, OG, JSON-LD, cite). */
export function absoluteUrl(path = '/'): string {
  const origin = (import.meta.env.SITE as string | undefined) ?? SITE_ORIGIN;
  return new URL(withBase(path), origin.endsWith('/') ? origin : `${origin}/`)
    .href;
}
