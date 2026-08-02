import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const cases = (await getCollection('cases')).sort((a, b) =>
    b.data.last_reviewed.localeCompare(a.data.last_reviewed),
  );

  return rss({
    title: 'Bitcoin Crimes',
    description:
      'Updates to curated, source-backed Bitcoin-primary criminal case files.',
    site: context.site ?? 'https://bitcoincrimes.example',
    items: cases.map((c) => ({
      title: c.data.title,
      description: c.data.summary,
      link: `/cases/${c.id}/`,
      pubDate: new Date(`${c.data.last_reviewed}T00:00:00Z`),
      categories: c.data.categories,
    })),
    customData: '<language>en-us</language>',
  });
}
