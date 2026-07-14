'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BrandToken } from '@/types/token';
import PillTabs from '@/components/PillTabs';
import PageHeader from '@/components/PageHeader';
import styles from './TokensIndex.module.css';
import { contrastOn } from '@/lib/tokens/resolveTheme';
import { lightTokens } from '@/lib/tokens/semanticTokens';

const CATEGORIES = ['전체', '핀테크/금융', '플랫폼', '커머스', '개발자 도구', '디자인 강자'];

function getBrandColors(colors: BrandToken['colors']) {
  const neutral = /gray|white|black|grey/i;
  const vivid = colors.filter((c) => !neutral.test(c.name));
  return vivid.length > 0 ? vivid : colors;
}

function getPrimaryColor(colors: BrandToken['colors']) {
  const explicit = colors.find((c) => /primary/i.test(c.role));
  return explicit?.value ?? getBrandColors(colors)[0]?.value ?? lightTokens['--color-fill-brand'];
}

function getBgColor(colors: BrandToken['colors']) {
  const warm = colors.find((c) => /메인 배경/.test(c.role));
  if (warm) return warm.value;
  const sub = colors.find((c) => /카드 배경|보조 배경/.test(c.role));
  return sub?.value ?? lightTokens['--color-fill-neutral'];
}

function BrandMiniUI({ token }: { token: BrandToken }) {
  const primary = getPrimaryColor(token.colors);
  const onPrimary = contrastOn(primary);
  const allColors = getBrandColors(token.colors);
  const secondaries = allColors.filter((c) => c.value !== primary);

  return (
    <div
      className={styles.miniUI}
      style={{
        padding: 0,
        gap: 0,
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
      }}
    >
      <div
        style={{
          flex: '0 0 62%',
          background: primary,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '8px 10px 7px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: 9,
            letterSpacing: '0.06em',
            fontWeight: 500,
            color: onPrimary,
            opacity: 0.55,
          }}
        >
          {primary.toUpperCase()}
        </span>
      </div>
      <div style={{ flex: 1, display: 'flex' }}>
        {secondaries.length > 0
          ? secondaries.slice(0, 5).map((c) => (
              <div
                key={c.variable ?? c.value}
                title={`${c.name} · ${c.value}`}
                style={{ flex: 1, background: c.value }}
              />
            ))
          : <div style={{ flex: 1, background: getBgColor(token.colors) }} />}
      </div>
    </div>
  );
}

export default function TokensIndexClient({ tokens }: { tokens: BrandToken[] }) {
  const [activeFilter, setActiveFilter] = useState('전체');

  const filtered = activeFilter === '전체'
    ? tokens
    : tokens.filter((t) => t.category === activeFilter);

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Templates"
        description="브랜드 디자인 시스템 템플릿의 컬러·타이포·여백·모양을 한 번에 확인해요."
      />

      <div className={styles.filterBar}>
        <PillTabs
          tabs={CATEGORIES.map((c) => ({ key: c, label: c }))}
          active={activeFilter}
          onChange={setActiveFilter}
        />
      </div>

      {filtered.length > 0 && (
        <section className={styles.section}>
          <div className={styles.grid}>
            {filtered.map((token, i) => (
              <Link key={token.slug} href={`/tokens/${token.slug}`} className={styles.card}>
                <BrandMiniUI token={token} />
                <div className={styles.cardFooter}>
                  <span className={styles.cardIndex}>
                    {String(i + 1).padStart(3, '0')}
                  </span>
                  <span className={styles.cardName}>
                    {token.tagline}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <div className={styles.empty}>준비 중</div>
      )}
    </div>
  );
}
