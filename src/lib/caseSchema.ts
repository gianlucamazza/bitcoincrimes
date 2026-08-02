import { z } from 'astro/zod';

/** YAML may parse bare years as numbers and full dates as Date objects. */
function toDateString(value: unknown): unknown {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return value;
}

const looseDate = z.preprocess(
  toDateString,
  z
    .string()
    .regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, 'Use YYYY, YYYY-MM, or YYYY-MM-DD'),
);

const isoDay = z.preprocess(
  toDateString,
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
);

const sourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  url: z.url(),
  publisher: z.string().min(1),
  date: looseDate.optional(),
  kind: z.enum([
    'court',
    'agency',
    'blockchain',
    'vendor',
    'academic',
    'news',
    'other',
  ]),
  primary: z.boolean(),
});

const amountSchema = z
  .object({
    label: z.string().min(1),
    btc: z.number().nonnegative().optional(),
    usd: z.number().nonnegative().optional(),
    as_of: looseDate.optional(),
    source_id: z.string().min(1),
    note: z.string().optional(),
  })
  .refine((a) => a.btc !== undefined || a.usd !== undefined, {
    message: 'Amount must include btc and/or usd',
  })
  .refine((a) => a.usd === undefined || a.as_of !== undefined, {
    message: 'USD amounts require as_of date (no undated dollar claims)',
  });

const personSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  outcome: z.string().optional(),
  source_id: z.string().optional(),
});

const timelineEventSchema = z.object({
  date: looseDate,
  title: z.string().min(1),
  body: z.string().optional(),
  source_ids: z.array(z.string()).optional(),
});

export const caseSchema = z
  .object({
    title: z.string().min(1),
    summary: z.string().min(1).max(400),
    legal_status: z.enum([
      'alleged',
      'charged',
      'indicted',
      'convicted',
      'acquitted',
      'settled',
      'civil',
      'unresolved',
    ]),
    case_status: z.enum(['open', 'closed', 'partial']),
    categories: z
      .array(
        z.enum([
          'dark-market',
          'exchange-theft',
          'ransomware',
          'fraud',
          'money-laundering',
          'mixer',
          'theft',
          'other',
        ]),
      )
      .min(1),
    start_date: looseDate,
    end_date: looseDate.optional(),
    confidence: z.enum(['high', 'medium', 'low']),
    last_reviewed: isoDay,
    featured: z.boolean().optional().default(false),
    amounts: z.array(amountSchema).optional().default([]),
    people: z.array(personSchema).optional().default([]),
    timeline: z.array(timelineEventSchema).optional().default([]),
    related: z
      .array(
        z.object({
          id: z.string().min(1),
          note: z.string().min(1).max(280),
        }),
      )
      .optional()
      .default([]),
    sources: z.array(sourceSchema).min(1, 'At least one source is required'),
  })
  .superRefine((data, ctx) => {
    const sourceIds = new Set(data.sources.map((s) => s.id));

    const checkRef = (id: string | undefined, path: (string | number)[]) => {
      if (id && !sourceIds.has(id)) {
        ctx.addIssue({
          code: 'custom',
          message: `Unknown source_id "${id}" — must match sources[].id`,
          path,
        });
      }
    };

    data.amounts?.forEach((a, i) =>
      checkRef(a.source_id, ['amounts', i, 'source_id']),
    );
    data.people?.forEach((p, i) => {
      checkRef(p.source_id, ['people', i, 'source_id']);
      if (p.outcome && !p.source_id) {
        ctx.addIssue({
          code: 'custom',
          message: 'People outcomes require source_id',
          path: ['people', i, 'source_id'],
        });
      }
    });
    data.timeline?.forEach((e, i) => {
      e.source_ids?.forEach((sid, j) =>
        checkRef(sid, ['timeline', i, 'source_ids', j]),
      );
    });

    if (!data.sources.some((s) => s.primary)) {
      ctx.addIssue({
        code: 'custom',
        message: 'At least one primary source is required (primary: true)',
        path: ['sources'],
      });
    }

    const primaryKinds = data.sources
      .filter((s) => s.primary)
      .map((s) => s.kind);
    const hasStrongPrimary = primaryKinds.some((k) =>
      ['court', 'agency', 'blockchain', 'vendor'].includes(k),
    );
    if (data.confidence === 'high' && !hasStrongPrimary) {
      ctx.addIssue({
        code: 'custom',
        message:
          'confidence: high requires a primary court, agency, or blockchain source',
        path: ['confidence'],
      });
    }
  });

export type CaseData = z.infer<typeof caseSchema>;
