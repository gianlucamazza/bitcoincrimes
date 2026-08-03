import { useEffect, useMemo, useState } from "react";
import {
  categoryLabels,
  legalStatusLabels,
  formatLooseDate,
  type Category,
  type LegalStatus,
} from "../lib/labels";
import { withBase } from "../lib/site";

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

export default function TimelineView({ events }: Props) {
  const [category, setCategory] = useState<string>("all");
  const [caseFilter, setCaseFilter] = useState<string>("all");
  const [hydrated, setHydrated] = useState(false);

  // Read initial filter state from the URL so filtered views are linkable.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCategory(params.get("category") ?? "all");
    setCaseFilter(params.get("case") ?? "all");
    setHydrated(true);
  }, []);

  // Mirror filter state back into the URL (survives back/forward and sharing).
  useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (caseFilter !== "all") params.set("case", caseFilter);
    const qs = params.toString();
    window.history.replaceState(
      null,
      "",
      qs ? `?${qs}` : window.location.pathname,
    );
  }, [hydrated, category, caseFilter]);

  const cases = useMemo(() => {
    const map = new Map<string, string>();
    for (const e of events) map.set(e.caseSlug, e.caseTitle);
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [events]);

  const filtered = useMemo(() => {
    return events
      .filter((e) => {
        if (category !== "all" && !e.categories.includes(category as Category))
          return false;
        if (caseFilter !== "all" && e.caseSlug !== caseFilter) return false;
        return true;
      })
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, [events, category, caseFilter]);

  // Group chronologically sorted events by year for scannable sticky markers.
  const byYear = useMemo(() => {
    const groups: { year: string; items: TimelineEvent[] }[] = [];
    for (const e of filtered) {
      const year = e.sortKey.slice(0, 4);
      const last = groups[groups.length - 1];
      if (last && last.year === year) last.items.push(e);
      else groups.push({ year, items: [e] });
    }
    return groups;
  }, [filtered]);

  const selectClass =
    "rounded-md border border-line bg-paper-sunken text-ink text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent";

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

      {filtered.length === 0 ? (
        <p className="text-ink-muted card p-6">
          No events match these filters.
        </p>
      ) : (
        <div className="space-y-10">
          {byYear.map((group) => (
            <section key={group.year} aria-label={group.year}>
              <h2 className="sticky top-16 z-10 -mx-2 mb-4 bg-paper/90 px-2 py-1 font-mono text-sm text-accent tabular-nums backdrop-blur-sm">
                {group.year}
              </h2>
              <ol className="relative border-l border-line ml-2 sm:ml-3 space-y-0">
                {group.items.map((e) => (
                  <li
                    key={e.id}
                    className="relative pl-6 sm:pl-8 pb-8 last:pb-0 [content-visibility:auto] [contain-intrinsic-size:auto_8rem]"
                  >
                    <span
                      className="absolute left-0 top-1.5 -translate-x-1/2 size-2.5 rounded-full bg-accent ring-4 ring-paper"
                      aria-hidden
                    />
                    <time
                      dateTime={e.date}
                      className="font-mono text-xs text-accent tabular-nums"
                    >
                      {formatLooseDate(e.date)}
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
                        {" "}
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
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
