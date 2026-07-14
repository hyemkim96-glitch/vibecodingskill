import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { allTokens, getTokenBySlug } from '@/lib/tokens';
import TokenPageClient from './TokenPageClient';
import {
  generateDesignMd,
  generateCSS,
  generateTailwind,
  generateDesignTokensJSON,
  generateFigmaVariables,
} from '@/lib/tokens/generate';

export function generateStaticParams() {
  return allTokens.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const token = getTokenBySlug(slug);
  if (!token) return {};

  const title = `${token.nameKo ?? token.name} 디자인 토큰 — ${token.tagline}`;
  const description = `${token.nameKo ?? token.name}(${token.category}) 디자인 시스템을 OKLCH 4계층 토큰으로 제공해요. ${token.description}`;

  return {
    title,
    description,
    openGraph: { title, description, url: `/tokens/${token.slug}` },
    twitter: { title, description },
  };
}

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
