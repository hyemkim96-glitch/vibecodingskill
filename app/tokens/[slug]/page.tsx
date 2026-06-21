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

  const codes = {
    designMd: generateDesignMd(token),
    css: generateCSS(token),
    tailwind: generateTailwind(token),
    json: generateDesignTokensJSON(token),
    figma: generateFigmaVariables(token),
  };

  return <TokenPageClient token={token} codes={codes} />;
}
