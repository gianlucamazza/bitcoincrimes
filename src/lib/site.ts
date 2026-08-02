/**
 * Canonical site identity. Keep in sync with astro.config.mjs `site` + `base`.
 * GitHub Pages project site under gianlucamazza/bitcoincrimes.
 *
 * Rules:
 * - Always join with a trailing slash on the base segment.
 * - Never double-prefix: Astro `url.pathname` already includes the base.
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

/** Normalized base: always starts with `/` and ends with `/` (except root `/`). */
function normalizedBase(): string {
  const raw =
    (typeof import.meta !== 'undefined' &&
      import.meta.env &&
      (import.meta.env.BASE_URL as string | undefined)) ||
    `${SITE_BASE_PATH}/`;
  if (raw === '/') return '/';
  const withLead = raw.startsWith('/') ? raw : `/${raw}`;
  return withLead.endsWith('/') ? withLead : `${withLead}/`;
}

/**
 * Prefix a site path with the Astro base (GH Pages subpath).
 * Accepts `/cases`, `cases/foo`, or `/`.
 * If `path` already starts with the base, returns it normalized (no double prefix).
 */
export function withBase(path = '/'): string {
  const base = normalizedBase();

  if (path === '/' || path === '') return base;

  // Path already absolute under this base (e.g. Astro.url.pathname)
  if (path === base.slice(0, -1) || path.startsWith(base)) {
    return path.endsWith('/') || path.includes('.') ? path : `${path}/`;
  }
  // Path equals base without trailing slash
  if (base !== '/' && path === base.slice(0, -1)) {
    return base;
  }

  const clean = path.replace(/^\//, '');
  return `${base}${clean}`;
}

/**
 * Absolute https URL for canonical, OG, JSON-LD, cite.
 * Uses SITE_ORIGIN only (never double-count base from import.meta.env.SITE).
 */
export function absoluteUrl(path = '/'): string {
  const rooted = withBase(path);
  // rooted is always absolute path starting with /
  return new URL(rooted, `${SITE_ORIGIN}/`).href;
}
