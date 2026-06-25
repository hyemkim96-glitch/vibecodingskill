import { notFound } from 'next/navigation';
import { getTokenBySlug } from '@/lib/tokens';
import TokenPageClient from './TokenPageClient';
import {
  generateDesignMd,
  generateCSS,
  generateTailwind,
  generateDesignTokensJSON,
  generateFigmaVariables,
} from '@/lib/tokens/generate';

export default async function TokenPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const token = getTokenBySlug(slug);

  if (!token) notFound();

  const mobileCodes = {
    designMd: generateDesignMd(token, 'mobile'),
    css: generateCSS(token, 'mobile'),
    tailwind: generateTailwind(token, 'mobile'),
    json: generateDesignTokensJSON(token, 'mobile'),
    figma: generateFigmaVariables(token, 'mobile'),
  };

  return <TokenPageClient token={token} mobileCodes={mobileCodes} />;
}
