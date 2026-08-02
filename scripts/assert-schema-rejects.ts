/**
 * Negative fixtures against the single caseSchema (no duplicate rules).
 */
import { caseSchema } from '../src/lib/caseSchema.ts';

const fixtures: Array<{
  name: string;
  mustFail: boolean;
  data: unknown;
}> = [
  {
    name: 'usd-without-as_of',
    mustFail: true,
    data: {
      title: 'X',
      summary:
        'Summary that is long enough to pass min length checks for a case file.',
      legal_status: 'convicted',
      case_status: 'closed',
      categories: ['theft'],
      start_date: '2020',
      confidence: 'high',
      last_reviewed: '2026-08-02',
      amounts: [{ label: 'Bad', usd: 1_000_000, source_id: 's1' }],
      sources: [
        {
          id: 's1',
          title: 'T',
          url: 'https://www.justice.gov/example',
          publisher: 'DOJ',
          kind: 'agency',
          primary: true,
        },
      ],
    },
  },
  {
    name: 'no-primary-source',
    mustFail: true,
    data: {
      title: 'X',
      summary:
        'Summary that is long enough to pass min length checks for a case file.',
      legal_status: 'convicted',
      case_status: 'closed',
      categories: ['theft'],
      start_date: '2020',
      confidence: 'high',
      last_reviewed: '2026-08-02',
      sources: [
        {
          id: 's1',
          title: 'T',
          url: 'https://example.com/news',
          publisher: 'News',
          kind: 'news',
          primary: false,
        },
      ],
    },
  },
  {
    name: 'outcome-without-source',
    mustFail: true,
    data: {
      title: 'X',
      summary:
        'Summary that is long enough to pass min length checks for a case file.',
      legal_status: 'convicted',
      case_status: 'closed',
      categories: ['theft'],
      start_date: '2020',
      confidence: 'high',
      last_reviewed: '2026-08-02',
      people: [{ name: 'A', role: 'B', outcome: 'Convicted' }],
      sources: [
        {
          id: 's1',
          title: 'T',
          url: 'https://www.justice.gov/example',
          publisher: 'DOJ',
          kind: 'agency',
          primary: true,
        },
      ],
    },
  },
  {
    name: 'valid-minimal',
    mustFail: false,
    data: {
      title: 'X',
      summary:
        'Summary that is long enough to pass min length checks for a case file.',
      legal_status: 'convicted',
      case_status: 'closed',
      categories: ['theft'],
      start_date: '2020',
      confidence: 'high',
      last_reviewed: '2026-08-02',
      sources: [
        {
          id: 's1',
          title: 'T',
          url: 'https://www.justice.gov/example',
          publisher: 'DOJ',
          kind: 'agency',
          primary: true,
        },
      ],
    },
  },
];

let failed = 0;
for (const fix of fixtures) {
  const result = caseSchema.safeParse(fix.data);
  const didFail = !result.success;
  if (didFail !== fix.mustFail) {
    console.error(
      `✗ ${fix.name}: expected mustFail=${fix.mustFail}, got fail=${didFail}`,
      result.success
        ? ''
        : result.error.issues.map((i) => i.message).join('; '),
    );
    failed++;
  } else {
    console.log(`✓ ${fix.name}`);
  }
}

if (failed) {
  process.exit(1);
}
console.log('✓ assert-schema-rejects ok');
