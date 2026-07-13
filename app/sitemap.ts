import type { MetadataRoute } from 'next';
import { allTokens } from '@/lib/tokens';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/tokens`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/components`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/patterns`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/foundation`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/wiki`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const tokenRoutes: MetadataRoute.Sitemap = allTokens.map((t) => ({
    url: `${SITE_URL}/tokens/${t.slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...tokenRoutes];
}
