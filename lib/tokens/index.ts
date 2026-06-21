import { BrandToken } from '@/types/token';
import { tossToken } from './toss';

export const allTokens: BrandToken[] = [tossToken];

export function getTokenBySlug(slug: string): BrandToken | undefined {
  return allTokens.find((t) => t.slug === slug);
}
