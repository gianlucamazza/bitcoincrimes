import { useMemo, useState } from 'react';
import {
  categoryLabels,
  legalStatusLabels,
  type Category,
  type LegalStatus,
} from '../lib/labels';
import { withBase } from '../lib/site';

export type TimelineEvent = {
  id: string;
  date: string;
  sortKey: string;
  title: string;
  body?: string;
  caseSlug: string;
  caseTitle: string;
  legalStatus: LegalStatus;
  categories: Category[];
};

type Props = {
  events: TimelineEvent[];
};

function formatDate(value: string) {
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
  const d = new Date(`${value}T00:00:00Z`);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export default function TimelineView({ events }: Props) {
  const [category, setCategory] = useState<string>('all');
  const [caseFilter, setCaseFilter] = useState<string>('all');

  const cases = useMemo(() => {
    const map = new Map<string, string>();
    for (const e of events) map.set(e.caseSlug, e.caseTitle);
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [events]);

  const filtered = useMemo(() => {
    return events
      .filter((e) => {
        if (category !== 'all' && !e.categories.includes(category as Category))
          return false;
        if (caseFilter !== 'all' && e.caseSlug !== caseFilter) return false;
        return true;
      })
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, [events, category, caseFilter]);

  const selectClass =
    'rounded-md border border-line bg-paper-sunken text-ink text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent';

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="flex flex-col gap-1 text-xs text-ink-faint uppercase tracking-wider">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={selectClass}
          >
            <option value="all">All</option>
            {Object.entries(categoryLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-ink-faint uppercase tracking-wider">
          Case
          <select
            value={caseFilter}
            onChange={(e) => setCaseFilter(e.target.value)}
            className={selectClass}
          >
            <option value="all">All cases</option>
            {cases.map(([slug, title]) => (
              <option key={slug} value={slug}>
                {title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-sm text-ink-muted" aria-live="polite">
        {filtered.length} events
      </p>

      <ol className="relative border-l border-line ml-2 sm:ml-3 space-y-0">
        {filtered.map((e) => (
          <li key={e.id} className="relative pl-6 sm:pl-8 pb-8 last:pb-0">
            <span
              className="absolute left-0 top-1.5 -translate-x-1/2 size-2.5 rounded-full bg-accent ring-4 ring-paper"
              aria-hidden
            />
            <time
              dateTime={e.date}
              className="font-mono text-xs text-accent tabular-nums"
            >
              {formatDate(e.date)}
            </time>
            <h3 className="font-serif text-lg sm:text-xl text-ink mt-1">
              {e.title}
            </h3>
            <p className="text-sm text-ink-muted mt-1">
              <a
                href={withBase(`/cases/${e.caseSlug}/`)}
                className="text-accent no-underline hover:underline"
              >
                {e.caseTitle}
              </a>
              <span className="text-ink-faint">
                {' '}
                · {legalStatusLabels[e.legalStatus]}
              </span>
            </p>
            {e.body && (
              <p className="mt-2 text-sm text-ink/85 leading-relaxed max-w-2xl">
                {e.body}
              </p>
            )}
          </li>
        ))}
      </ol>

      {filtered.length === 0 && (
        <p className="text-ink-muted card p-6">No events match these filters.</p>
      )}
    </div>
  );
}
