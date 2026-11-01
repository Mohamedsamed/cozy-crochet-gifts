import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(8),
    description: z.string().min(40).max(180),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum([
      'Crochet Gift Ideas',
      'Amigurumi Inspiration',
      'Beginner Crochet',
      'Crochet Pattern Guides',
      'Handmade Gift Guides',
      'Seasonal Crochet Ideas',
    ]),
    featuredImage: z.string().startsWith('/images/'),
    imageAlt: z.string().min(12),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };