import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { caseSchema } from './lib/caseSchema';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/cases' }),
  schema: caseSchema,
});

export const collections = { cases };
