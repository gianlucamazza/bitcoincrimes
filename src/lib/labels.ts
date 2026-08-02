export const legalStatusLabels = {
  alleged: 'Alleged',
  charged: 'Charged',
  indicted: 'Indicted',
  convicted: 'Convicted',
  acquitted: 'Acquitted',
  settled: 'Settled',
  civil: 'Civil',
  unresolved: 'Unresolved',
} as const;

/** Short reader-facing explanations for tooltips and guides. */
export const legalStatusHelp = {
  alleged: 'Claimed in a public record or complaint; not proven in court.',
  charged: 'Formally accused by prosecutors. Not a finding of guilt.',
  indicted: 'Charged by a grand jury (U.S. federal practice). Not a conviction.',
  convicted: 'Found guilty at trial or by guilty plea, per the public record cited.',
  acquitted: 'Found not guilty on the charge(s) referenced.',
  settled: 'Resolved by agreement (often without a full trial on the merits).',
  civil: 'Civil action (e.g. forfeiture), distinct from a criminal conviction.',
  unresolved: 'No single closed criminal outcome in the sources we cite.',
} as const;

export const caseStatusLabels = {
  open: 'Open',
  closed: 'Closed',
  partial: 'Partial resolution',
} as const;

export const caseStatusHelp = {
  open: 'Investigation or prosecution still active in the public record we track.',
  closed: 'Primary criminal thread we document has a terminal outcome.',
  partial:
    'Some threads resolved (e.g. seizure or one defendant); others remain open or outside this file.',
} as const;

export const BRAND = {
  name: 'Bitcoin Crimes',
  descriptor: 'Public Record Archive',
  tagline: 'Bitcoin’s criminal history, with sources you can open.',
  promise: 'Fewer cases. Harder sources. Status labeled. Dollars dated.',
} as const;

export const categoryLabels = {
  'dark-market': 'Dark market',
  'exchange-theft': 'Exchange theft',
  ransomware: 'Ransomware',
  fraud: 'Fraud',
  'money-laundering': 'Money laundering',
  mixer: 'Mixer',
  theft: 'Theft',
  other: 'Other',
} as const;

export const sourceKindLabels = {
  court: 'Court',
  agency: 'Agency',
  blockchain: 'Blockchain',
  academic: 'Academic',
  news: 'News',
  other: 'Other',
} as const;

export const confidenceLabels = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence',
} as const;

export type LegalStatus = keyof typeof legalStatusLabels;
export type CaseStatus = keyof typeof caseStatusLabels;
export type Category = keyof typeof categoryLabels;
export type SourceKind = keyof typeof sourceKindLabels;
export type Confidence = keyof typeof confidenceLabels;

/** Format loose dates for display without inventing precision. */
export function formatLooseDate(value: string): string {
  if (/^\d{4}$/.test(value)) return value;
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [y, m] = value.split('-');
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${months[Number(m) - 1]} ${y}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const d = new Date(`${value}T00:00:00Z`);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
  }
  return value;
}

export function formatBtc(n: number): string {
  return `${n.toLocaleString('en-US', { maximumFractionDigits: 8 })} BTC`;
}

export function formatUsd(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}
