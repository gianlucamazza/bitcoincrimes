import { useMemo, useState } from 'react';
import {
  categoryLabels,
  legalStatusLabels,
  type Category,
  type LegalStatus,
} from '../lib/labels';

export type CaseListItem = {
  slug: string;
  title: string;
  summary: string;
  legalStatus: LegalStatus;
  caseStatus: string;
  categories: Category[];
  startDate: string;
  endDate?: string;
  lastReviewed: string;
  year: number;
};

const legalTone: Record<LegalStatus, string> = {
  alleged: 'border-warn/40 text-warn bg-warn/10',
  charged: 'border-warn/50 text-warn bg-warn/15',
  indicted: 'border-warn/60 text-warn bg-warn/15',
  convicted: 'border-danger/50 text-danger bg-danger/10',
  acquitted: 'border-signal/50 text-signal bg-signal/10',
  settled: 'border-info/50 text-info bg-info/10',
  civil: 'border-info/40 text-info bg-info/10',
  unresolved: 'border-ink-faint/50 text-ink-muted bg-ink-faint/10',
};

function formatRange(start: string, end?: string) {
  const fmt = (v: string) => {
    if (/^\d{4}$/.test(v)) return v;
    if (/^\d{4}-\d{2}$/.test(v)) {
      const [y, m] = v.split('-');
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
    const d = new Date(`${v}T00:00:00Z`);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
  };
  return end ? `${fmt(start)} – ${fmt(end)}` : `${fmt(start)} –`;
}

type Props = {
  cases: CaseListItem[];
};

export default function CaseFilters({ cases }: Props) {
  const [category, setCategory] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [year, setYear] = useState<string>('all');
  const [q, setQ] = useState('');

  const years = useMemo(
    () =>
      [...new Set(cases.map((c) => c.year))].sort((a, b) => b - a),
    [cases],
  );

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return cases.filter((c) => {
      if (category !== 'all' && !c.categories.includes(category as Category))
        return false;
      if (status !== 'all' && c.legalStatus !== status) return false;
      if (year !== 'all' && c.year !== Number(year)) return false;
      if (
        query &&
        !`${c.title} ${c.summary}`.toLowerCase().includes(query)
      )
        return false;
      return true;
    });
  }, [cases, category, status, year, q]);

  const selectClass =
    'rounded-md border border-line bg-paper-sunken text-ink text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
        <label className="flex flex-col gap-1 text-xs text-ink-faint uppercase tracking-wider">
          Search
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Title or summary…"
            className={`${selectClass} min-w-[12rem]`}
          />
        </label>
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
          Legal status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={selectClass}
          >
            <option value="all">All</option>
            {Object.entries(legalStatusLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-ink-faint uppercase tracking-wider">
          Start year
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={selectClass}
          >
            <option value="all">All</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-sm text-ink-muted" aria-live="polite">
        Showing {filtered.length} of {cases.length} cases
      </p>

      {filtered.length === 0 ? (
        <p className="text-ink-muted card p-6">
          No cases match these filters.
        </p>
      ) : (
        <ul className="grid gap-4 sm:gap-5">
          {filtered.map((c) => (
            <li key={c.slug}>
              <article className="card group transition-colors hover:border-line-strong">
                <a
                  href={`/cases/${c.slug}`}
                  className="block p-5 sm:p-6 no-underline text-inherit"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <span
                      className={`badge px-2 py-0.5 text-[10px] ${legalTone[c.legalStatus]}`}
                    >
                      {legalStatusLabels[c.legalStatus]}
                    </span>
                    <time
                      className="text-xs text-ink-faint font-mono tabular-nums"
                      dateTime={c.startDate}
                    >
                      {formatRange(c.startDate, c.endDate)}
                    </time>
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl group-hover:text-accent transition-colors mb-2">
                    {c.title}
                  </h2>
                  <p className="text-sm sm:text-base text-ink-muted leading-relaxed line-clamp-3">
                    {c.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {c.categories.map((cat) => (
                      <span
                        key={cat}
                        className="badge border-line text-ink-muted bg-paper-sunken"
                      >
                        {categoryLabels[cat]}
                      </span>
                    ))}
                  </div>
                </a>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
