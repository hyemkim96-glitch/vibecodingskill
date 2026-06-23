'use client';

import { useState, useMemo } from 'react';
import { BrandToken } from '@/types/token';
import { Copy, Check, Download } from 'lucide-react';
import BrandUIPreview from '@/components/BrandUIPreview';
import ComponentSheet, { COMPONENT_CATEGORIES, ComponentCategory } from '@/components/ComponentSheet';
import { renderPattern, PATTERN_TYPES, PatternType } from '@/components/patterns';
import { resolveTheme } from '@/lib/tokens/resolveTheme';
import { createDS, motionVars } from '@/components/ds';
import styles from './TokenPage.module.css';

type TabKey = 'designMd' | 'css' | 'tailwind' | 'json' | 'figma';
type Platform = 'mobile' | 'web';
type Section = 'foundation' | 'components' | 'patterns';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'designMd', label: 'Design.md' },
  { key: 'css',      label: 'CSS' },
  { key: 'tailwind', label: 'Tailwind' },
  { key: 'json',     label: '디자인 토큰' },
  { key: 'figma',    label: 'Figma 변수' },
];

const FILE_EXTENSIONS: Record<TabKey, string> = {
  designMd: 'DESIGN.md',
  css:      'tokens.css',
  tailwind: 'tailwind.config.js',
  json:     'tokens.json',
  figma:    'figma-variables.md',
};

const SECTIONS: { key: Section; label: string }[] = [
  { key: 'foundation', label: '파운데이션' },
  { key: 'components', label: '컴포넌트' },
  { key: 'patterns',   label: '패턴' },
];

interface Props {
  token: BrandToken;
  mobileCodes: Record<TabKey, string>;
  webCodes: Record<TabKey, string>;
}

const KOREAN_SAMPLE = '한글은 아름다운 언어입니다. 디자인 시스템이 이를 담아냅니다.';
const LATIN_SAMPLE  = 'The quick brown fox jumps over the lazy dog';

/* ── Section nav ── */
function SectionNav({ section, onChange }: { section: Section; onChange: (s: Section) => void }) {
  return (
    <div style={{
      display: 'flex',
      gap: 2,
      marginBottom: 24,
      background: 'var(--color-bg-alt)',
      borderRadius: 8,
      padding: 3,
    }}>
      {SECTIONS.map(s => (
        <button
          key={s.key}
          onClick={() => onChange(s.key)}
          style={{
            flex: 1,
            padding: '6px 12px',
            fontSize: 'var(--font-size-caption)',
            fontFamily: 'var(--font-ui)',
            letterSpacing: '0.04em',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            transition: 'all 0.15s',
            background:  section === s.key ? 'var(--color-bg-normal)'    : 'transparent',
            color:       section === s.key ? 'var(--color-text-normal)'   : 'var(--color-text-assistive)',
            boxShadow:   section === s.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            fontWeight:  section === s.key ? 600 : 400,
          }}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

/* ── Sub-tab strip (components / patterns) ── */
function SubTabStrip({ items, active, onChange }: {
  items: { key: string; label: string }[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
      {items.map(it => (
        <button
          key={it.key}
          onClick={() => onChange(it.key)}
          style={{
            padding: '4px 12px',
            fontSize: 'var(--font-size-caption)',
            fontFamily: 'var(--font-ui)',
            letterSpacing: '0.04em',
            border: '1px solid',
            borderColor: active === it.key ? 'var(--color-text-normal)'  : 'var(--color-border-normal)',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            background:  active === it.key ? 'var(--color-text-normal)'  : 'transparent',
            color:       active === it.key ? 'var(--color-bg-normal)'     : 'var(--color-text-alternative)',
            transition: 'all 0.15s',
          }}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

export default function TokenPageClient({ token, mobileCodes, webCodes }: Props) {
  const [activeTab,       setActiveTab]       = useState<TabKey>('designMd');
  const [platform,        setPlatform]        = useState<Platform>('mobile');
  const [copied,          setCopied]          = useState(false);
  const [selectedType,    setSelectedType]    = useState<string | null>(null);
  const [section,         setSection]         = useState<Section>('foundation');
  const [compCategory,    setCompCategory]    = useState<ComponentCategory>('all');
  const [activePattern,   setActivePattern]   = useState<PatternType>('list');

  const codes = platform === 'mobile' ? mobileCodes : webCodes;
  const p = token.platforms[platform];

  /* Brand DS — same token names, brand-specific values */
  const brandTheme = useMemo(
    () => resolveTheme(token, platform, 'brand'),
    [token, platform],
  );
  const brandDS = useMemo(() => {
    const ds = createDS(brandTheme);
    ds.t = { ...ds.t, isMobile: platform === 'mobile' };
    return ds;
  }, [brandTheme, platform]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codes[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([codes[activeTab]], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${token.slug}-${platform}-${FILE_EXTENSIONS[activeTab]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.page}>
      {/* ── Left: main content ── */}
      <div className={styles.left}>
        {/* Header */}
        <div className={styles.brandHeader}>
          <div className={styles.brandMeta}>
            <span className={styles.metaChip}>{token.category}</span>
            <span className={styles.metaChip}>{token.country}</span>
            <span className={styles.metaChip}>{token.theme === 'light' ? '라이트' : '다크'}</span>
          </div>
          <h1 className={styles.brandName}>{token.tagline}</h1>
          <p className={styles.brandDesc}>{token.description}</p>
          <p className={styles.updatedAt}>업데이트: {token.updatedAt}</p>
        </div>

        <div className={styles.divider} />

        {/* Platform toggle */}
        <div className={styles.platformToggle}>
          {(['mobile', 'web'] as const).map(pl => (
            <button
              key={pl}
              className={`${styles.platformBtn} ${platform === pl ? styles.platformBtnActive : ''}`}
              onClick={() => setPlatform(pl)}
            >
              {pl === 'mobile' ? '모바일' : '웹'}
            </button>
          ))}
        </div>

        {/* Section navigation */}
        <SectionNav section={section} onChange={setSection} />

        {/* ── Foundation ── */}
        {section === 'foundation' && (
          <>
            <div
              className={styles.uiPreviewWrapper}
              style={{ maxWidth: platform === 'mobile' ? 390 : '100%' }}
            >
              <BrandUIPreview token={token} platform={platform} mode="brand" />
            </div>

            {/* Color Palette */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>컬러 팔레트</h2>
              <div className={styles.colorGrid}>
                {token.colors.map((color) => (
                  <div key={color.variable} className={styles.colorItem}>
                    <div className={styles.colorSwatch} style={{ background: color.value }} />
                    <div className={styles.colorInfo}>
                      <span className={styles.colorName}>{color.name}</span>
                      <span className={styles.colorValue}>{color.value}</span>
                      <span className={styles.colorRole}>{color.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className={styles.divider} />

            {/* Typography */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>타이포그래피</h2>
              <div className={styles.typeMeta}>
                <span className={styles.typeFamily}>{p.typography.family}</span>
                <span className={styles.typeSubstitute}>대체: {p.typography.substitute}</span>
                <span className={styles.typeWeights}>굵기: {p.typography.weights.join(', ')}</span>
              </div>
              <div className={styles.typeScaleTable}>
                <div className={styles.tableHeader}>
                  <span>역할</span>
                  <span>크기</span>
                  <span>행간</span>
                  <span>자간</span>
                </div>
                {p.typography.sizes.map((s) => {
                  const isSelected = selectedType === s.role;
                  return (
                    <div
                      key={s.role}
                      className={styles.tableRow}
                      onClick={() => setSelectedType(isSelected ? null : s.role)}
                      style={{ cursor: 'pointer', background: isSelected ? 'var(--color-fill-neutral)' : undefined }}
                    >
                      <span className={styles.typeRole}>{s.role}</span>
                      <span>{s.size}</span>
                      <span>{s.lineHeight}</span>
                      <span>{s.letterSpacing}</span>
                    </div>
                  );
                })}
              </div>
              {selectedType && (() => {
                const s = p.typography.sizes.find((x) => x.role === selectedType)!;
                const isDisplay = /display|h1|heading/i.test(s.role);
                return (
                  <div style={{
                    marginTop: 'var(--spacing-3)',
                    padding: 'var(--spacing-6)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--color-graphite)',
                    background: 'var(--color-carbon)',
                  }}>
                    <div style={{ fontSize: 'var(--font-size-caption)', fontFamily: 'var(--font-ui)', letterSpacing: '0.04em', color: 'var(--color-ash)', marginBottom: 'var(--spacing-4)', display: 'flex', gap: 'var(--spacing-3)' }}>
                      <span>{s.role}</span><span>·</span>
                      <span>{s.size}</span><span>·</span>
                      <span>lh {s.lineHeight}</span><span>·</span>
                      <span>ls {s.letterSpacing}</span>
                    </div>
                    <p style={{ fontSize: s.size, lineHeight: parseFloat(s.lineHeight) || 1.5, letterSpacing: s.letterSpacing, fontFamily: p.typography.family, margin: 0, color: 'var(--color-bone)' }}>
                      {isDisplay ? 'Aa — ' : ''}{KOREAN_SAMPLE}
                    </p>
                    <p style={{ fontSize: s.size, lineHeight: parseFloat(s.lineHeight) || 1.5, letterSpacing: s.letterSpacing, fontFamily: p.typography.family, margin: 'var(--spacing-2) 0 0', color: 'var(--color-ash)' }}>
                      {LATIN_SAMPLE}
                    </p>
                  </div>
                );
              })()}
            </section>

            <div className={styles.divider} />

            {/* Spacing */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>여백 & 모양</h2>
              <div className={styles.spacingMeta}>
                <span className={styles.metaChip}>기준: {p.spacing.baseUnit}</span>
                <span className={styles.metaChip}>{p.spacing.density === 'comfortable' ? '여유' : p.spacing.density === 'compact' ? '촘촘' : '넉넉'}</span>
                <span className={styles.metaChip}>최대폭: {p.layout.maxWidth}</span>
              </div>
              <div className={styles.spacingTable}>
                <div className={styles.tableHeader}>
                  <span>이름</span><span>값</span><span>미리보기</span>
                </div>
                {p.spacing.scale.map((s) => (
                  <div key={s.token} className={styles.tableRow}>
                    <span>{s.name}</span>
                    <span>{s.value}</span>
                    <div className={styles.spacingBar} style={{ width: s.value, maxWidth: '100%' }} />
                  </div>
                ))}
              </div>

              <h3 className={styles.subTitle}>모서리 둥글기</h3>
              <div className={styles.shapeTable}>
                <div className={styles.tableHeader}>
                  <span>요소</span><span>값</span><span>미리보기</span>
                </div>
                {p.shapes.map((s) => (
                  <div key={s.element} className={styles.tableRow}>
                    <span>{s.element}</span>
                    <span>{s.value}</span>
                    <div className={styles.shapePreview} style={{ borderRadius: s.value }} />
                  </div>
                ))}
              </div>
            </section>

            <div className={styles.divider} />

            {/* Guidelines */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>디자인 가이드라인</h2>
              <div className={styles.guidelinesGrid}>
                <div className={styles.guideCol}>
                  <h3 className={styles.guideTitle}>이렇게 해요</h3>
                  <ul className={styles.guideList}>
                    {token.guidelines.dos.map((d, i) => (
                      <li key={i} className={styles.guideItemDo}>{d}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.guideCol}>
                  <h3 className={styles.guideTitle}>이렇게 하지 마세요</h3>
                  <ul className={styles.guideList}>
                    {token.guidelines.donts.map((d, i) => (
                      <li key={i} className={styles.guideItemDont}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── Components ── */}
        {section === 'components' && (
          <div>
            <SubTabStrip
              items={COMPONENT_CATEGORIES}
              active={compCategory}
              onChange={(k) => setCompCategory(k as ComponentCategory)}
            />
            <ComponentSheet theme={brandTheme} category={compCategory} />
          </div>
        )}

        {/* ── Patterns ── */}
        {section === 'patterns' && (
          <div>
            <SubTabStrip
              items={PATTERN_TYPES}
              active={activePattern}
              onChange={(k) => setActivePattern(k as PatternType)}
            />
            <div
              style={{
                border: '1px solid var(--color-border-normal)',
                borderRadius: 8,
                overflow: 'hidden',
                maxWidth: platform === 'mobile' ? 390 : '100%',
              }}
            >
              <div className="ds-root" style={motionVars(brandTheme)}>
                {renderPattern(activePattern, brandDS, platform)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Right: sticky code export panel ── */}
      <div className={styles.rightWrapper}>
        <div className={styles.codePanel}>
          <div className={styles.tabs}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={styles.codeActions}>
            <span className={styles.fileName}>{platform.toUpperCase()} · {FILE_EXTENSIONS[activeTab]}</span>
            <div className={styles.actionBtns}>
              <button
                className={`${styles.actionBtn} ${copied ? styles.actionBtnCopied : ''}`}
                onClick={handleCopy}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? '복사됨' : '복사'}
              </button>
              <button className={styles.actionBtn} onClick={handleDownload}>
                <Download size={14} />
                다운로드
              </button>
            </div>
          </div>

          <pre className={styles.codeBlock}>
            <code>{codes[activeTab]}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
