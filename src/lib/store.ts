import { z } from 'astro/zod';
import productsJson from '../data/products.json';
import categoriesJson from '../data/categories.json';
import bundlesJson from '../data/bundles.json';

const ImageSchema = z.object({
  src: z.string().startsWith('/images/'),
  alt: z.string().min(8),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const gumroadUrl = z
  .url()
  .refine((value) => {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      (url.hostname === 'gumroad.com' || url.hostname.endsWith('.gumroad.com')) &&
      url.pathname.includes('/l/')
    );
  }, 'Use an official HTTPS Gumroad product URL.');

const ProductSchema = z
  .object({
    id: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: z.string().min(3),
    category: z.string().min(1),
    price: z.number().nonnegative(),
    currency: z.literal('USD').default('USD'),
    shortDescription: z.string().min(12),
    description: z.string().min(40),
    images: z.array(ImageSchema).min(1),
    gumroadUrl: gumroadUrl.optional(),
    skillLevel: z.string().optional(),
    language: z.string().optional(),
    fileFormat: z.string().optional(),
    materials: z.array(z.string()).optional(),
    includedFiles: z.array(z.string()).optional(),
    finishedDimensions: z.string().optional(),
    requiredKnowledge: z.array(z.string()).optional(),
    licenseSummary: z.string().optional(),
    publishedAt: z.string().optional(),
    compareAtPrice: z.number().positive().optional(),
    discountEvidence: z.string().min(8).optional(),
    badge: z.enum(['new', 'bestseller']).optional(),
    badgeReason: z.string().min(8).optional(),
    featured: z.boolean().default(false),
    published: z.boolean().default(false),
  })
  .superRefine((product, context) => {
    if (product.published && !product.publishedAt) {
      context.addIssue({ code: 'custom', path: ['publishedAt'], message: 'A published product needs its real publication date.' });
    }
    if (product.published && !product.fileFormat) {
      context.addIssue({ code: 'custom', path: ['fileFormat'], message: 'Set the verified file format before publishing.' });
    }
    if (product.published && (!product.includedFiles || product.includedFiles.length === 0)) {
      context.addIssue({ code: 'custom', path: ['includedFiles'], message: 'List the exact files included before publishing.' });
    }
    if (product.published && !product.gumroadUrl) {
      context.addIssue({
        code: 'custom',
        path: ['gumroadUrl'],
        message: 'A published product needs a real Gumroad URL.',
      });
    }
    if (product.compareAtPrice !== undefined && !product.discountEvidence) {
      context.addIssue({ code: 'custom', path: ['discountEvidence'], message: 'Record the genuine basis for an original-price comparison.' });
    }
    if (
      product.compareAtPrice !== undefined &&
      product.compareAtPrice <= product.price
    ) {
      context.addIssue({
        code: 'custom',
        path: ['compareAtPrice'],
        message: 'An original price must be higher than the current price.',
      });
    }
    if (product.badge && !product.badgeReason) {
      context.addIssue({ code: 'custom', path: ['badgeReason'], message: 'Record the factual reason for this product badge.' });
    }
    if (product.badge === 'bestseller' && !product.published) {
      context.addIssue({
        code: 'custom',
        path: ['badge'],
        message: 'A badge can only be used on a published product.',
      });
    }
  });

const CategorySchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(3),
  navLabel: z.string().min(2),
  description: z.string().min(20),
  intro: z.string().min(30),
  image: ImageSchema.optional(),
  relatedArticles: z.array(z.string()).default([]),
});

const BundleSchema = z
  .object({
    id: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: z.string().min(3),
    description: z.string().min(40),
    image: ImageSchema,
    productIds: z.array(z.string()).min(1),
    price: z.number().nonnegative(),
    currency: z.literal('USD').default('USD'),
    gumroadUrl: gumroadUrl.optional(),
    published: z.boolean().default(false),
    publishedAt: z.string().optional(),
  })
  .superRefine((bundle, context) => {
    if (bundle.published && !bundle.gumroadUrl) {
      context.addIssue({
        code: 'custom',
        path: ['gumroadUrl'],
        message: 'A published bundle needs a real Gumroad URL.',
      });
    }
  });

export const products = z.array(ProductSchema).parse(productsJson);
export const categories = z.array(CategorySchema).parse(categoriesJson);
export const bundles = z.array(BundleSchema).parse(bundlesJson);
export type Product = (typeof products)[number];
export type Category = (typeof categories)[number];

export const publishedProducts = products.filter(
  (product) => product.published && Boolean(product.gumroadUrl),
);

export const publishedBundles = bundles.filter(
  (bundle) => bundle.published && Boolean(bundle.gumroadUrl),
);

for (const product of publishedProducts) {
  if (!categories.some((category) => category.slug === product.category)) {
    throw new Error('Published product "' + product.slug + '" uses an unknown category.');
  }
}

for (const bundle of publishedBundles) {
  const missingProduct = bundle.productIds.find(
    (productId) =>
      !publishedProducts.some((product) => product.id === productId),
  );
  if (missingProduct) {
    throw new Error(
      'Published bundle "' + bundle.slug + '" references an unpublished product.',
    );
  }
}

export const activeCategories = categories
  .map((category) => ({
    ...category,
    products: publishedProducts.filter(
      (product) => product.category === category.slug,
    ),
  }))
  .filter((category) => category.products.length > 0);

export function getProduct(slug: string) {
  return publishedProducts.find((product) => product.slug === slug);
}

export function getCategory(slug: string) {
  return activeCategories.find((category) => category.slug === slug);
}

export function getBundle(slug: string) {
  return publishedBundles.find((bundle) => bundle.slug === slug);
}

export function getBundleProducts(bundleId: string) {
  const bundle = publishedBundles.find((item) => item.id === bundleId);
  return bundle
    ? bundle.productIds
        .map((id) => publishedProducts.find((product) => product.id === id))
        .filter((product) => product !== undefined)
    : [];
}

export function formatPrice(price: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
}
